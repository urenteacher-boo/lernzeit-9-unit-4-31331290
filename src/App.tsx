import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext";
import Index from "./pages/Index.tsx";
import Vocabulary from "./pages/Vocabulary.tsx";
import Week1Reading from "./pages/Week1Reading.tsx";
import Week2Listening from "./pages/Week2Listening.tsx";
import Week3Grammar from "./pages/Week3Grammar.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/week/1" element={<Week1Reading />} />
            <Route path="/week/2" element={<Week2Listening />} />
            <Route path="/week/3" element={<Week3Grammar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
