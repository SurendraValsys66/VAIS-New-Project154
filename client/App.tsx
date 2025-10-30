import "./global.css";
import React from "react";
import "rsuite/dist/rsuite-no-reset.min.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TourProvider } from "./contexts/TourContext";
import { MasteryAnimationProvider } from "./contexts/MasteryAnimationContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import BuildVAIS from "./pages/BuildVAIS";
import VAISResults from "./pages/VAISResults";
import ABMLAL from "./pages/ABMLAL";
import FindProspect from "./pages/FindProspect";
import ProspectResults from "./pages/ProspectResults";
import FavoritesProspects from "./pages/FavoritesProspects";
import BuildCampaign from "./pages/BuildCampaign";
import BuildMyCampaign from "./pages/BuildMyCampaign";
import CampaignOverview from "./pages/CampaignOverview";
import MyDownloadedList from "./pages/MyDownloadedList";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Support from "./pages/Support";
import ChatSupport from "./pages/ChatSupport";
import FAQs from "./pages/FAQs";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import Payments from "./pages/Payments";

import FreeTrial from "./pages/FreeTrial";
import CreateAccount from "./pages/CreateAccount";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import AllNotifications from "./pages/AllNotifications";
import SpendingHistory from "./pages/SpendingHistory";
import Integrations from "./pages/Integrations";
import OnboardingRole from "./pages/OnboardingRole";
import OnboardingUseCase from "./pages/OnboardingUseCase";
import OnboardingExperience from "./pages/OnboardingExperience";
import OnboardingIndustry from "./pages/OnboardingIndustry";
import OnboardingCategory from "./pages/OnboardingCategory";
import OnboardingThankYou from "./pages/OnboardingThankYou";
import MasteryGuide from "./pages/MasteryGuide";
import ContactSales from "./pages/ContactSales";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem={false}
    forcedTheme="light"
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TourProvider>
          <MasteryAnimationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/free-trial" element={<FreeTrial />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route
                  path="/email-verification"
                  element={<EmailVerification />}
                />
                <Route path="/build-vais" element={<BuildVAIS />} />
                <Route path="/vais-results" element={<VAISResults />} />
                <Route path="/abm-lal" element={<ABMLAL />} />
                <Route path="/find-prospect" element={<FindProspect />} />
                <Route path="/prospect-results" element={<ProspectResults />} />
                <Route
                  path="/favorites-prospects"
                  element={<FavoritesProspects />}
                />
                <Route path="/build-campaign" element={<BuildCampaign />} />
                <Route
                  path="/build-my-campaign"
                  element={<BuildMyCampaign />}
                />
                <Route
                  path="/campaign-overview/:id"
                  element={<CampaignOverview />}
                />
                <Route path="/my-downloads" element={<MyDownloadedList />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/users" element={<Users />} />
                <Route path="/manage-users" element={<Users />} />
                <Route path="/support" element={<Support />} />
                <Route
                  path="/chat-support/:ticketId"
                  element={<ChatSupport />}
                />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/contact-sales" element={<ContactSales />} />
                <Route path="/notifications" element={<AllNotifications />} />
                <Route path="/spending-history" element={<SpendingHistory />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/mastery" element={<MasteryGuide />} />

                {/* Onboarding flow */}
                <Route path="/onboarding/role" element={<OnboardingRole />} />
                <Route
                  path="/onboarding/use-case"
                  element={<OnboardingUseCase />}
                />
                <Route
                  path="/onboarding/experience"
                  element={<OnboardingExperience />}
                />
                <Route
                  path="/onboarding/industry"
                  element={<OnboardingIndustry />}
                />
                <Route
                  path="/onboarding/category"
                  element={<OnboardingCategory />}
                />
                <Route
                  path="/onboarding/complete"
                  element={<OnboardingThankYou />}
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </MasteryAnimationProvider>
        </TourProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

// Handle HMR properly to avoid multiple createRoot calls
const container = document.getElementById("root")!;

// Check if we're in development and already have a root
let root: any;
if (import.meta.hot) {
  // Store root in hot module data to persist across reloads
  const hotData = import.meta.hot.data;
  if (hotData.root) {
    root = hotData.root;
  } else {
    root = createRoot(container);
    hotData.root = root;
  }
} else {
  // Production: create root normally
  root = createRoot(container);
}

root.render(<App />);
