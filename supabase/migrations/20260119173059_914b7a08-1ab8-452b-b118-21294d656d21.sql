-- Fix overly permissive RLS policies - remove the USING(true) policies and create proper service role access

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Service can read shops for notifications" ON public.shops;
DROP POLICY IF EXISTS "Service can read customers for notifications" ON public.customers;
DROP POLICY IF EXISTS "Service can insert notification logs" ON public.notification_logs;

-- Note: Edge functions using service_role key bypass RLS entirely, so no need for these policies
-- The existing user-specific policies are sufficient for authenticated access