import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, UdhaarEntry, Product, DailyRecord, ShopSettings, ExpenseItem } from '@/types';

interface AppState {
  // Shop Settings
  shopSettings: ShopSettings;
  setShopSettings: (settings: ShopSettings) => void;

  // Customers
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
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Get today's date string for comparison
const getDateString = (date: Date) => new Date(date).toISOString().split('T')[0];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Shop Settings
      shopSettings: {
        shopName: 'میری دکان',
        ownerName: '',
        phone: '',
        address: '',
      },
      setShopSettings: (settings) => set({ shopSettings: settings }),

      // Customers
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
    }),
    {
      name: 'udhaar-khata-storage',
    }
  )
);
