-- Create tables for syncing shop data to cloud for notifications

-- Shop profiles table (one per shop/user)
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL DEFAULT 'میری دکان',
  owner_name TEXT,
  phone TEXT,
  address TEXT,
  onesignal_player_id TEXT, -- Store OneSignal player ID for push notifications
  notification_enabled BOOLEAN DEFAULT true,
  overdue_days_threshold INTEGER DEFAULT 7, -- Days after which udhaar is considered overdue
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Customers table (synced from local storage)
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  local_id TEXT NOT NULL, -- Local storage ID for syncing
  name TEXT NOT NULL,
  phone TEXT,
  balance NUMERIC(12, 2) DEFAULT 0, -- Current pending balance
  last_transaction_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(shop_id, local_id)
);

-- Udhaar entries for tracking overdue amounts
CREATE TABLE public.udhaar_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  local_id TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('udhaar', 'payment')),
  description TEXT,
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, local_id)
);

-- Notification logs to track sent notifications
CREATE TABLE public.notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL DEFAULT 'overdue_reminder',
  message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  success BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.udhaar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shops
CREATE POLICY "Users can view their own shop" ON public.shops
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shop" ON public.shops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shop" ON public.shops
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for customers
CREATE POLICY "Users can view their shop customers" ON public.customers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can manage their shop customers" ON public.customers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update their shop customers" ON public.customers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete their shop customers" ON public.customers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND user_id = auth.uid())
  );

-- RLS Policies for udhaar_entries
CREATE POLICY "Users can view their customer entries" ON public.udhaar_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.customers c
      JOIN public.shops s ON c.shop_id = s.id
      WHERE c.id = customer_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their customer entries" ON public.udhaar_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.customers c
      JOIN public.shops s ON c.shop_id = s.id
      WHERE c.id = customer_id AND s.user_id = auth.uid()
    )
  );

-- RLS Policies for notification_logs
CREATE POLICY "Users can view their notification logs" ON public.notification_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.shops WHERE id = shop_id AND user_id = auth.uid())
  );

-- Allow edge function to read all data for notifications (using service role)
CREATE POLICY "Service can read shops for notifications" ON public.shops
  FOR SELECT USING (true);

CREATE POLICY "Service can read customers for notifications" ON public.customers
  FOR SELECT USING (true);

CREATE POLICY "Service can insert notification logs" ON public.notification_logs
  FOR INSERT WITH CHECK (true);

-- Enable pg_cron and pg_net for scheduled notifications
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON public.shops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();