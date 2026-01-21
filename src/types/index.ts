export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalDue: number;
  totalPaid: number;
  balance: number;
  createdAt: Date;
  lastTransactionDate: Date;
}

export interface UdhaarEntry {
  id: string;
  customerId: string;
  amount: number;
  type: 'udhaar' | 'payment';
  description?: string;
  date: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  supplier: string;
  soldOut: boolean;
  totalSold: number;
  createdAt: Date;
}

export interface DailyRecord {
  id: string;
  date: Date;
  earnings: number;
  expenses: ExpenseItem[];
  totalExpenses: number;
  netProfit: number;
}

export interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  description?: string;
}

export type Language = 'en' | 'ur' | 'roman_urdu' | 'sindhi' | 'pashto';

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  qrCodeUrl?: string;
  closingReminderEnabled?: boolean;
  closingTime?: string;
}

export interface AppSettings {
  onboardingCompleted: boolean;
  language: Language;
}
