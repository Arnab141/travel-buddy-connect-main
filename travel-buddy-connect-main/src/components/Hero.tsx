import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Search } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-95" />

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        animate={{
          y: [0, 30, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="relative container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="w-2 h-2 bg-accent rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-primary-foreground">Save money, make friends, travel together</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Share Your Journey,
            <br />
            <motion.span
              className="text-primary-foreground/90 inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Split the Cost
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with travelers heading your way. Share rides, reduce costs, and make new friends on the road.
          </motion.p>

          {/* Search Card */}
          {/* <motion.div 
            className="bg-card rounded-2xl p-6 card-shadow max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          > */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <input
                  type="text"
                  placeholder="From (e.g., Delhi)"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </motion.div>


              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                <input
                  type="text"
                  placeholder="To (e.g., Himachal)"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>


              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  min={today}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button variant="hero" size="lg" className="w-full">
                  <Search className="w-5 h-5" />
                  Search
                </Button>
              </motion.div>
            </div> */}

          {/* Popular Routes */}
          {/* <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {['Delhi → Manali', 'Mumbai → Goa', 'Bangalore → Ooty'].map((route, index) => (
                <motion.button
                  key={route}
                  className="px-3 py-1 rounded-full bg-secondary text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {route}
                </motion.button>
              ))}
            </div>
          </motion.div> */}

          {/* Stats */}

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {/* Share Ride */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="hero"
                size="xl"
                className="min-w-[220px] shadow-xl shadow-primary/30"
                onClick={() => (window.location.href = "/#share")}
              >
                🚗 Share a Ride
              </Button>
            </motion.div>

            {/* Find Ride */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="hero-outline"
                size="xl"
                className="min-w-[220px]"
                onClick={() => (window.location.href = "/user/all-trips")}
              >
                🔍 Find a Ride
              </Button>
            </motion.div>
          </motion.div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            {[
              { number: '10K+', label: 'Happy Travelers' },
              { number: '5K+', label: 'Trips Shared' },
              { number: '₹2M+', label: 'Money Saved' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-primary-foreground"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
