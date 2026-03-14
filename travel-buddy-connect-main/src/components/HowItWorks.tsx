import { Search, MessageCircle, Car, Smile } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Search a Trip",
    description: "Enter your destination, choose a date, and find rides going your way.",
    color: "bg-primary",
  },
  {
    icon: MessageCircle,
    title: "Connect with Driver",
    description: "Review driver profiles, ratings, and message them to confirm details.",
    color: "bg-accent",
  },
  {
    icon: Car,
    title: "Book Your Seat",
    description: "Choose your pickup point, pay securely, and get ready for the trip.",
    color: "bg-primary",
  },
  {
    icon: Smile,
    title: "Enjoy the Journey",
    description: "Meet at the pickup point, share the ride, and make new friends!",
    color: "bg-accent",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Simple Process
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How TravelBuddy Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting started is easy. Find your perfect ride in just a few simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              variants={cardVariants}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-accent/30"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                />
              )}
              
              <motion.div 
                className="relative bg-card rounded-2xl p-8 text-center card-shadow"
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/* Step Number */}
                <motion.div 
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  {index + 1}
                </motion.div>
                
                {/* Icon */}
                <motion.div 
                  className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
