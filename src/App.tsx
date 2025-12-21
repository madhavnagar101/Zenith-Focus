import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import CommandCenter from "./pages/CommandCenter";
import DeepWork from "./pages/DeepWork";
import FocusTube from "./pages/FocusTube";
import MindGym from "./pages/MindGym";
import JOMOArena from "./pages/JOMOArena";
import NotificationJail from "./pages/NotificationJail";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/deep-work" element={<DeepWork />} />
              <Route path="/focus-tube" element={<FocusTube />} />
              <Route path="/mind-gym" element={<MindGym />} />
              <Route path="/jomo-arena" element={<JOMOArena />} />
              <Route path="/notification-jail" element={<NotificationJail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
