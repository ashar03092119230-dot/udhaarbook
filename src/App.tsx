import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import Dashboard from "./pages/Dashboard";
import CustomersPage from "./pages/CustomersPage";
import NewCustomerPage from "./pages/NewCustomerPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import NewUdhaarPage from "./pages/NewUdhaarPage";
import NewPaymentPage from "./pages/NewPaymentPage";
import SlipPage from "./pages/SlipPage";
import ProductsPage from "./pages/ProductsPage";
import NewProductPage from "./pages/NewProductPage";
import EarningsPage from "./pages/EarningsPage";
import CalculatorPage from "./pages/CalculatorPage";
import SettingsPage from "./pages/SettingsPage";
import AIHelperPage from "./pages/AIHelperPage";
import RemindersPage from "./pages/RemindersPage";
import SuppliersPage from "./pages/SuppliersPage";
import InaamPage from "./pages/InaamPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { onboardingCompleted } = useStore();

  if (!onboardingCompleted) {
    return <OnboardingFlow />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/customers/new" element={<NewCustomerPage />} />
      <Route path="/customers/:id" element={<CustomerDetailPage />} />
      <Route path="/udhaar/new" element={<NewUdhaarPage />} />
      <Route path="/payment/new" element={<NewPaymentPage />} />
      <Route path="/slip/:id" element={<SlipPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/new" element={<NewProductPage />} />
      <Route path="/earnings" element={<EarningsPage />} />
      <Route path="/earnings/add" element={<EarningsPage />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      <Route path="/ai-helper" element={<AIHelperPage />} />
      <Route path="/reminders" element={<RemindersPage />} />
      <Route path="/suppliers" element={<SuppliersPage />} />
      <Route path="/inaam" element={<InaamPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
