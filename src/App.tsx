import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PasswordResetConfirm from './components/PasswordResetConfirm';


// Page imports
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import RegisterProgram from "./pages/RegisterProgram";
// import Recruitment from "./pages/Recruitment";
import Team from "./pages/Team";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import RegistrationPage from "./pages/RegistrationPage";
import PaymentResultPage from './pages/PaymentResultPage';
import ProgramPaymentResult from "./pages/ProgramPaymentResult";
import RecruitmentHome from "./pages/recruitment/RecruitmentHome";
import CapabilityForm from "./pages/recruitment/CapabilityForm";
import ThankYou from "./pages/recruitment/ThankYou";
import UserDashboard from "./pages/recruitment/UserDashboard";
import UserProfile from './pages/recruitment/UserProfile';

import VerifyEmail from "./pages/VerifyEmail";
import VerifyEmailDone from "./pages/VerifyEmailDone";
import AdminDashboard from "./pages/admin/AdminDashboard";





const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/team" element={<Team />} />
          
          {/* Programs Routes */}
          <Route path="/programs" element={<Programs />} />
          <Route path="/register-program" element={<RegisterProgram />} />
          <Route path="/program-payment-result" element={<ProgramPaymentResult />} />
          
          {/* Events Routes - Specific first */}
          <Route path="/events/:id/register" element={<RegistrationPage />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events" element={<Events />} />

                    // In your App.tsx or routing file
          <Route path="/verify-email/:key?" element={<VerifyEmail />} />
          <Route path="/verify-email/done" element={<VerifyEmailDone />} />
          // In your App.tsx or routing file
          <Route path="/reset-password/confirm" element={<PasswordResetConfirm />} />
                    
          {/* Recruitment */}
          {/* <Route path="/recruitment" element={<Recruitment />} /> */}
           <Route path="/recruitment" element={<RecruitmentHome />} />
          <Route path="/recruitment/form" element={<CapabilityForm />} />
          <Route path="/recruitment/thank-you" element={<ThankYou />} />
          <Route path="/recruitment/user-dashboard" element={<UserDashboard />} />
          <Route path="/recruitment/user-profile" element={<UserProfile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />



          
          {/* Registration & Payment */}
          <Route path="/register" element={<Register />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          
          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;