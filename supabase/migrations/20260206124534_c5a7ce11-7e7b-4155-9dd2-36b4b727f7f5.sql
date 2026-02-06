-- Add UPDATE and DELETE policies for udhaar_entries table
-- These policies verify the user owns the shop associated with the customer

CREATE POLICY "Users can update their customer entries" 
ON public.udhaar_entries 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 
  FROM customers c
  JOIN shops s ON c.shop_id = s.id
  WHERE c.id = udhaar_entries.customer_id 
  AND s.user_id = auth.uid()
));

CREATE POLICY "Users can delete their customer entries" 
ON public.udhaar_entries 
FOR DELETE 
USING (EXISTS (
  SELECT 1 
  FROM customers c
  JOIN shops s ON c.shop_id = s.id
  WHERE c.id = udhaar_entries.customer_id 
  AND s.user_id = auth.uid()
));