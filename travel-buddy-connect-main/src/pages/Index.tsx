import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedTrips from "@/components/FeaturedTrips";
import HowItWorks from "@/components/HowItWorks";
import ShareRide from "@/components/ShareRide";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedTrips />
      <HowItWorks />
      <ShareRide />
      <Footer />
    </div>
  );
};

export default Index;
