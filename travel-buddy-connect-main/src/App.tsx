import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter  , Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { UserProvider } from "./context/UserContext";
import { ToastContainer } from "react-toastify";
import Trip from "./pages/Trip";
import ScrollToHash from "./components/ScrollToHash";
import Profile from "./pages/Profile";
import MyTrip from "./pages/MyTrip";
import TripRequest from "./pages/TripRequest";
import Allnotification from "./pages/Allnotification";
import TripTraking from "./pages/TripTraking";
import ChatWidget from "./components/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter  >
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ScrollToHash />
          <Toaster />
          <Sonner />
          <ToastContainer />
          <Routes>
            
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/user/trips" element={<Trip />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/my-trips" element={<MyTrip />} />
            <Route path="/trips/request/:requestId" element={<TripRequest />} />
            <Route path="/user/notifications" element={<Allnotification />} />
            <Route path="/user/my-trips/track/:tripId" element={<TripTraking />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
            <ChatWidget />
        </TooltipProvider>
      </QueryClientProvider>
    </UserProvider>
  </BrowserRouter  >
);

export default App;
