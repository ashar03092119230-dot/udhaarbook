import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Product {
  name: string;
  supplier: string;
  totalSold: number;
  quantity: number;
  price: number;
  soldOut: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { products, language, insightType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating ${insightType} insight for ${products?.length || 0} products in ${language}`);

    // Build language-specific prompts
    const languageInstructions = {
      en: "Respond in simple English.",
      ur: "Respond in Urdu script (اردو).",
      roman_urdu: "Respond in Roman Urdu (like 'Yeh product zyada bik raha hai').",
      sindhi: "Respond in Sindhi script (سنڌي).",
      pashto: "Respond in Pashto script (پښتو).",
    };

    const langInstruction = languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.roman_urdu;

    let systemPrompt = "";
    let userPrompt = "";

    if (insightType === "popular") {
      systemPrompt = `You are a helpful shopkeeper assistant. Analyze product sales data and identify:
1. Which supplier/company's products are selling the most
2. Fast-selling products (high totalSold)
3. Slow-moving products (low totalSold, high quantity remaining)

${langInstruction}

Keep your response VERY SHORT and SIMPLE - like advice from an experienced shopkeeper.
Use simple words, no technical terms. Maximum 4-5 bullet points.
Use emojis to make it friendly: 🔥 for fast selling, 🐢 for slow moving, 📦 for stock advice.`;

      userPrompt = `Here are my shop's products:\n${JSON.stringify(products, null, 2)}\n\nTell me which products/companies are selling well and which are slow.`;
    } else if (insightType === "tips") {
      systemPrompt = `You are an experienced local shopkeeper giving marketing advice. Based on the product data:
1. Suggest product placement ideas
2. Recommend discount offers for slow items
3. Suggest combo offers (items that go well together)
4. Advise on stock for fast-selling items

${langInstruction}

Keep tips VERY SHORT (1-2 lines each). Maximum 3-4 practical tips.
Make them actionable for a small shop owner.
Use emojis: 💡 for tips, 🛒 for placement, 💰 for discounts, 📈 for stock.`;

      userPrompt = `Here are my shop's products:\n${JSON.stringify(products, null, 2)}\n\nGive me simple marketing tips for my shop.`;
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

    console.log("Generated insight successfully");

    return new Response(
      JSON.stringify({ insight }),
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
