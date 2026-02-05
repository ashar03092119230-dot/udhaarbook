 import { useState, useEffect, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from './useAuth';
 
 interface SubscriptionStatus {
   subscribed: boolean;
   subscriptionEnd: Date | null;
   isLoading: boolean;
   error: string | null;
 }
 
 export const useSubscription = () => {
   const { session } = useAuth();
   const [status, setStatus] = useState<SubscriptionStatus>({
     subscribed: false,
     subscriptionEnd: null,
     isLoading: true,
     error: null,
   });
 
   const checkSubscription = useCallback(async () => {
     if (!session?.access_token) {
       setStatus(prev => ({ ...prev, isLoading: false, subscribed: false }));
       return;
     }
 
     try {
       setStatus(prev => ({ ...prev, isLoading: true, error: null }));
       
       const { data, error } = await supabase.functions.invoke('check-subscription', {
         headers: {
           Authorization: `Bearer ${session.access_token}`,
         },
       });
 
       if (error) throw error;
 
       setStatus({
         subscribed: data.subscribed,
         subscriptionEnd: data.subscription_end ? new Date(data.subscription_end) : null,
         isLoading: false,
         error: null,
       });
     } catch (err) {
       console.error('Error checking subscription:', err);
       setStatus(prev => ({
         ...prev,
         isLoading: false,
         error: err instanceof Error ? err.message : 'Failed to check subscription',
       }));
     }
   }, [session?.access_token]);
 
   const startCheckout = async () => {
     if (!session?.access_token) {
       throw new Error('User not authenticated');
     }
 
     const { data, error } = await supabase.functions.invoke('create-checkout', {
       headers: {
         Authorization: `Bearer ${session.access_token}`,
       },
     });
 
     if (error) throw error;
     if (data?.url) {
       window.open(data.url, '_blank');
     }
   };
 
   // Check subscription on mount and when session changes
   useEffect(() => {
     checkSubscription();
   }, [checkSubscription]);
 
   // Auto-refresh every 60 seconds
   useEffect(() => {
     if (!session?.access_token) return;
     
     const interval = setInterval(checkSubscription, 60000);
     return () => clearInterval(interval);
   }, [session?.access_token, checkSubscription]);
 
   // Check for subscription success URL parameter
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     if (params.get('subscription') === 'success') {
       // Clear the URL parameter
       window.history.replaceState({}, '', window.location.pathname);
       // Refresh subscription status
       setTimeout(checkSubscription, 2000);
     }
   }, [checkSubscription]);
 
   return {
     ...status,
     checkSubscription,
     startCheckout,
   };
 };