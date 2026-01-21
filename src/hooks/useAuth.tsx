import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (phone: string, pin: string) => Promise<{ error: Error | null }>;
  signIn: (phone: string, pin: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  shopId: string | null;
  setShopId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert phone to email format for Supabase auth
const phoneToEmail = (phone: string): string => {
  // Clean phone number - remove spaces, dashes, etc.
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return `${cleanPhone}@udhaarbook.local`;
};

// Validate Pakistani phone number
export const validatePhoneNumber = (phone: string): { valid: boolean; error?: string } => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if starts with 03 (local) or +923 or 923 (international)
  const localPattern = /^03\d{9}$/;
  const intlPattern = /^(\+92|92)3\d{9}$/;
  
  if (localPattern.test(cleanPhone) || intlPattern.test(cleanPhone)) {
    return { valid: true };
  }
  
  if (cleanPhone.length < 10) {
    return { valid: false, error: 'numberTooShort' };
  }
  
  if (cleanPhone.length > 13) {
    return { valid: false, error: 'numberTooLong' };
  }
  
  return { valid: false, error: 'invalidFormat' };
};

// Validate PIN
export const validatePin = (pin: string): { valid: boolean; error?: string } => {
  if (pin.length < 4) {
    return { valid: false, error: 'pinTooShort' };
  }
  if (pin.length > 6) {
    return { valid: false, error: 'pinTooLong' };
  }
  if (!/^\d+$/.test(pin)) {
    return { valid: false, error: 'pinMustBeNumbers' };
  }
  return { valid: true };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Defer shop fetching
        if (session?.user) {
          setTimeout(() => {
            fetchShopId(session.user.id);
          }, 0);
        } else {
          setShopId(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        fetchShopId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchShopId = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (!error && data) {
        setShopId(data.id);
      }
    } catch (err) {
      console.error('Error fetching shop:', err);
    }
  };

  const signUp = async (phone: string, pin: string): Promise<{ error: Error | null }> => {
    try {
      const email = phoneToEmail(phone);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password: pin,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            phone: phone.replace(/[\s\-\(\)]/g, ''),
          }
        }
      });
      
      if (error) {
        return { error: new Error(error.message) };
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signIn = async (phone: string, pin: string): Promise<{ error: Error | null }> => {
    try {
      const email = phoneToEmail(phone);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pin,
      });
      
      if (error) {
        return { error: new Error(error.message) };
      }
      
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setShopId(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      shopId,
      setShopId
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
