import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedTrips from "@/components/FeaturedTrips";
import HowItWorks from "@/components/HowItWorks";
import ShareRide from "@/components/ShareRide";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedTrips />
      <HowItWorks />
      <ShareRide />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
