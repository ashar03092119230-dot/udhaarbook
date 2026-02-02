import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, UdhaarEntry, Product, DailyRecord, ShopSettings, ExpenseItem, Language, Supplier, LoyaltyCustomer, TokenState, SubscriptionState, FREE_DAILY_TOKENS } from '@/types';

interface AppState {
  // App Settings
  onboardingCompleted: boolean;
  language: Language;
  setOnboardingCompleted: (completed: boolean) => void;
  setLanguage: (language: Language) => void;

  // Shop Settings
  shopSettings: ShopSettings;
  setShopSettings: (settings: ShopSettings) => void;
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'lastTransactionDate'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomer: (id: string) => Customer | undefined;

  // Udhaar Entries
  udhaarEntries: UdhaarEntry[];
  addUdhaarEntry: (entry: Omit<UdhaarEntry, 'id' | 'date'>) => void;
  getCustomerEntries: (customerId: string) => UdhaarEntry[];

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'totalSold' | 'soldOut'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  markProductSoldOut: (id: string) => void;
  deleteProduct: (id: string) => void;

  // Daily Records
  dailyRecords: DailyRecord[];
  addDailyEarnings: (date: Date, earnings: number) => void;
  addExpense: (date: Date, expense: Omit<ExpenseItem, 'id'>) => void;
  getTodayRecord: () => DailyRecord | undefined;
  getMonthlyStats: (year: number, month: number) => { earnings: number; expenses: number; profit: number };

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Loyalty Customers
  loyaltyCustomers: LoyaltyCustomer[];
  addLoyaltyCustomer: (customer: Omit<LoyaltyCustomer, 'id' | 'addedAt'>) => void;
  removeLoyaltyCustomer: (id: string) => void;
  getRandomLoyaltyWinner: () => LoyaltyCustomer | undefined;

  // Token System
  tokenState: TokenState;
  refreshTokensIfNeeded: () => void;
  consumeToken: () => boolean; // Returns true if token was consumed, false if no tokens left
  getTokensRemaining: () => number;

  // Subscription System
  subscriptionState: SubscriptionState;
  isSubscribed: () => boolean;
  subscribe: () => void;
  cancelSubscription: () => void;
  hasUnlimitedAccess: () => boolean;
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Get today's date string for comparison
const getDateString = (date: Date) => new Date(date).toISOString().split('T')[0];

// Get today's date string
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // App Settings
      onboardingCompleted: false,
      language: 'roman_urdu' as Language,
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      setLanguage: (language) => set({ language }),

      // Shop Settings
      shopSettings: {
        shopName: '',
        ownerName: '',
        phone: '',
        address: '',
      },
      setShopSettings: (settings) => set({ shopSettings: settings }),
      customers: [],
      addCustomer: (customer) => {
        const newCustomer: Customer = {
          ...customer,
          id: generateId(),
          createdAt: new Date(),
          lastTransactionDate: new Date(),
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
      },
      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },
      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
          udhaarEntries: state.udhaarEntries.filter((e) => e.customerId !== id),
        }));
      },
      getCustomer: (id) => get().customers.find((c) => c.id === id),

      // Udhaar Entries
      udhaarEntries: [],
      addUdhaarEntry: (entry) => {
        const newEntry: UdhaarEntry = {
          ...entry,
          id: generateId(),
          date: new Date(),
        };

        set((state) => {
          // Update customer balance
          const customer = state.customers.find((c) => c.id === entry.customerId);
          if (customer) {
            const updatedCustomer = {
              ...customer,
              totalDue: entry.type === 'udhaar' 
                ? customer.totalDue + entry.amount 
                : customer.totalDue,
              totalPaid: entry.type === 'payment' 
                ? customer.totalPaid + entry.amount 
                : customer.totalPaid,
              balance: entry.type === 'udhaar'
                ? customer.balance + entry.amount
                : customer.balance - entry.amount,
              lastTransactionDate: new Date(),
            };

            return {
              udhaarEntries: [...state.udhaarEntries, newEntry],
              customers: state.customers.map((c) =>
                c.id === entry.customerId ? updatedCustomer : c
              ),
            };
          }
          return { udhaarEntries: [...state.udhaarEntries, newEntry] };
        });
      },
      getCustomerEntries: (customerId) =>
        get().udhaarEntries.filter((e) => e.customerId === customerId),

      // Products
      products: [],
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: generateId(),
          createdAt: new Date(),
          totalSold: 0,
          soldOut: false,
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },
      markProductSoldOut: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, soldOut: true, quantity: 0, totalSold: p.totalSold + p.quantity } : p
          ),
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      // Daily Records
      dailyRecords: [],
      addDailyEarnings: (date, earnings) => {
        const dateStr = getDateString(date);
        set((state) => {
          const existingRecord = state.dailyRecords.find(
            (r) => getDateString(r.date) === dateStr
          );

          if (existingRecord) {
            return {
              dailyRecords: state.dailyRecords.map((r) =>
                getDateString(r.date) === dateStr
                  ? { ...r, earnings, netProfit: earnings - r.totalExpenses }
                  : r
              ),
            };
          }

          const newRecord: DailyRecord = {
            id: generateId(),
            date: new Date(dateStr),
            earnings,
            expenses: [],
            totalExpenses: 0,
            netProfit: earnings,
          };

          return { dailyRecords: [...state.dailyRecords, newRecord] };
        });
      },
      addExpense: (date, expense) => {
        const dateStr = getDateString(date);
        const newExpense: ExpenseItem = { ...expense, id: generateId() };

        set((state) => {
          const existingRecord = state.dailyRecords.find(
            (r) => getDateString(r.date) === dateStr
          );

          if (existingRecord) {
            const updatedExpenses = [...existingRecord.expenses, newExpense];
            const totalExpenses = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);

            return {
              dailyRecords: state.dailyRecords.map((r) =>
                getDateString(r.date) === dateStr
                  ? {
                      ...r,
                      expenses: updatedExpenses,
                      totalExpenses,
                      netProfit: r.earnings - totalExpenses,
                    }
                  : r
              ),
            };
          }

          const newRecord: DailyRecord = {
            id: generateId(),
            date: new Date(dateStr),
            earnings: 0,
            expenses: [newExpense],
            totalExpenses: expense.amount,
            netProfit: -expense.amount,
          };

          return { dailyRecords: [...state.dailyRecords, newRecord] };
        });
      },
      getTodayRecord: () => {
        const today = getDateString(new Date());
        return get().dailyRecords.find((r) => getDateString(r.date) === today);
      },
      getMonthlyStats: (year, month) => {
        const records = get().dailyRecords.filter((r) => {
          const d = new Date(r.date);
          return d.getFullYear() === year && d.getMonth() === month;
        });

        return {
          earnings: records.reduce((sum, r) => sum + r.earnings, 0),
          expenses: records.reduce((sum, r) => sum + r.totalExpenses, 0),
          profit: records.reduce((sum, r) => sum + r.netProfit, 0),
        };
      },

      // Suppliers
      suppliers: [],
      addSupplier: (supplier) => {
        const newSupplier: Supplier = {
          ...supplier,
          id: generateId(),
          createdAt: new Date(),
        };
        set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
      },
      updateSupplier: (id, updates) => {
        set((state) => ({
          suppliers: state.suppliers.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      },
      deleteSupplier: (id) => {
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id),
        }));
      },

      // Loyalty Customers
      loyaltyCustomers: [],
      addLoyaltyCustomer: (customer) => {
        const newEntry: LoyaltyCustomer = {
          ...customer,
          id: generateId(),
          addedAt: new Date(),
        };
        set((state) => ({ loyaltyCustomers: [...state.loyaltyCustomers, newEntry] }));
      },
      removeLoyaltyCustomer: (id) => {
        set((state) => ({
          loyaltyCustomers: state.loyaltyCustomers.filter((c) => c.id !== id),
        }));
      },
      getRandomLoyaltyWinner: () => {
        const list = get().loyaltyCustomers;
        if (list.length === 0) return undefined;
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
      },

      // Token System
      tokenState: {
        tokensRemaining: FREE_DAILY_TOKENS,
        lastRefreshDate: getTodayDateString(),
        maxDailyTokens: FREE_DAILY_TOKENS,
      },
      refreshTokensIfNeeded: () => {
        const today = getTodayDateString();
        const { tokenState } = get();
        
        if (tokenState.lastRefreshDate !== today) {
          set({
            tokenState: {
              ...tokenState,
              tokensRemaining: FREE_DAILY_TOKENS,
              lastRefreshDate: today,
            },
          });
        }
      },
      consumeToken: () => {
        const { hasUnlimitedAccess, tokenState } = get();
        
        // Subscribers have unlimited access
        if (hasUnlimitedAccess()) {
          return true;
        }
        
        // Refresh tokens if new day
        get().refreshTokensIfNeeded();
        
        if (tokenState.tokensRemaining > 0) {
          set({
            tokenState: {
              ...tokenState,
              tokensRemaining: tokenState.tokensRemaining - 1,
            },
          });
          return true;
        }
        return false;
      },
      getTokensRemaining: () => {
        get().refreshTokensIfNeeded();
        return get().tokenState.tokensRemaining;
      },

      // Subscription System
      subscriptionState: {
        isSubscribed: false,
        planType: 'free',
      },
      isSubscribed: () => {
        const { subscriptionState } = get();
        if (!subscriptionState.isSubscribed) return false;
        
        // Check if subscription has expired
        if (subscriptionState.expiresAt) {
          const now = new Date();
          if (new Date(subscriptionState.expiresAt) < now) {
            // Subscription expired
            set({
              subscriptionState: {
                ...subscriptionState,
                isSubscribed: false,
                planType: 'free',
              },
            });
            return false;
          }
        }
        return true;
      },
      subscribe: () => {
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription
        
        set({
          subscriptionState: {
            isSubscribed: true,
            subscribedAt: now,
            expiresAt,
            planType: 'premium',
          },
        });
      },
      cancelSubscription: () => {
        set({
          subscriptionState: {
            isSubscribed: false,
            planType: 'free',
          },
        });
      },
      hasUnlimitedAccess: () => {
        return get().isSubscribed();
      },
    }),
    {
      name: 'udhaar-khata-storage',
    }
  )
);
