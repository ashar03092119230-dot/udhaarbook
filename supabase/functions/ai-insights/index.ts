import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Product {
  id?: string;
  name: string;
  supplier: string;
  totalSold: number;
  quantity: number;
  price: number;
  soldOut: boolean;
}

interface Customer {
  id?: string;
  name: string;
  balance: number;
  lastTransactionDate?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { products, customers, language, insightType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating ${insightType} insight for ${products?.length || 0} products in ${language}`);

    // Build language-specific prompts
    const languageInstructions: Record<string, string> = {
      en: "Respond in simple English.",
      ur: "Respond in Urdu script (اردو).",
      roman_urdu: "Respond in Roman Urdu (like 'Yeh product zyada bik raha hai').",
      sindhi: "Respond in Sindhi script (سنڌي).",
      pashto: "Respond in Pashto script (پښتو).",
    };

    const langInstruction = languageInstructions[language] || languageInstructions.roman_urdu;

    let systemPrompt = "";
    let userPrompt = "";

    if (insightType === "hero") {
      // HERO DECISION - One clear action for today
      systemPrompt = `You are a smart local shopkeeper assistant. Based on the shop data, give EXACTLY ONE clear, actionable decision for today.

${langInstruction}

Rules:
- Give ONLY ONE decision in 1-2 sentences
- Make it specific and actionable
- Use simple language like talking to a friend
- Include the specific product/customer name if relevant
- Examples of good decisions:
  * "Aaj Pepsi zyada rakho, yeh sabse zyada bik rahi hai"
  * "Ahmad sahab ko udhaar mat do, unka 5000 pehle se baqi hai"
  * "Chips ki qeemat 5 rupay barha do"
  * "Lays aur Pepsi sath mein rakho, combo mein bikenge"

DO NOT give lists or multiple options. ONE DECISION ONLY.`;

      const productsData = products?.length > 0 ? JSON.stringify(products.slice(0, 10)) : "No products";
      const customersData = customers?.length > 0 ? JSON.stringify(customers.slice(0, 10)) : "No customers";

      userPrompt = `Shop Data:
Products: ${productsData}
Customers with pending udhaar: ${customersData}

Give me ONE decision for today.`;
    } else if (insightType === "popular") {
      // Fast selling products
      systemPrompt = `You are a shopkeeper assistant. Identify the FAST-SELLING products.

${langInstruction}

Keep response to 2-3 lines ONLY. Be specific with product names.
Use 🔥 emoji for hot items.`;

      userPrompt = `Products: ${JSON.stringify(products?.slice(0, 15) || [])}

Which products are selling fast?`;
    } else if (insightType === "slow") {
      // Slow selling products
      systemPrompt = `You are a shopkeeper assistant. Identify the SLOW-MOVING products that need attention.

${langInstruction}

Keep response to 2-3 lines ONLY. Be specific with product names.
Use 🐌 emoji for slow items. Suggest one quick fix.`;

      userPrompt = `Products: ${JSON.stringify(products?.slice(0, 15) || [])}

Which products are selling slow and need attention?`;
    } else if (insightType === "loss") {
      // Loss/problem analysis
      systemPrompt = `You are a shopkeeper assistant. Identify potential LOSS CAUSES in the shop.

${langInstruction}

Look for:
- Products with low sales but high stock (money stuck)
- Customers with high pending udhaar
- Products that might expire or go stale

Keep response to 2-3 lines. Use ⚠️ emoji for warnings.`;

      const customersData = customers?.filter((c: Customer) => c.balance > 1000) || [];
      userPrompt = `Products: ${JSON.stringify(products?.slice(0, 15) || [])}
High Balance Customers: ${JSON.stringify(customersData.slice(0, 5))}

What could be causing loss?`;
    } else if (insightType === "tips") {
      // Marketing tips
      systemPrompt = `You are an experienced local shopkeeper giving MARKETING TIPS for a small shop.

${langInstruction}

Give 2-3 practical tips about:
- Product placement (kahan rakhen)
- Combo offers (kya sath mein bikta hai)
- Price adjustment
- Udhaar control

Use 💡 emoji. Keep tips SHORT and PRACTICAL.`;

      userPrompt = `Products: ${JSON.stringify(products?.slice(0, 15) || [])}

Give me 2-3 quick marketing tips.`;
    } else {
      throw new Error("Invalid insight type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const insight = data.choices?.[0]?.message?.content || "Unable to generate insight";

    // Determine suggested action based on insight content
    let suggestedAction = "";
    const insightLower = insight.toLowerCase();
    if (insightLower.includes("stock") || insightLower.includes("maal") || insightLower.includes("rakho")) {
      suggestedAction = "stock";
    } else if (insightLower.includes("price") || insightLower.includes("qeemat") || insightLower.includes("rate")) {
      suggestedAction = "price";
    } else if (insightLower.includes("udhaar") || insightLower.includes("credit") || insightLower.includes("baqi")) {
      suggestedAction = "udhaar";
    }

    console.log("Generated insight successfully");

    return new Response(
      JSON.stringify({ insight, suggestedAction }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI insights error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
