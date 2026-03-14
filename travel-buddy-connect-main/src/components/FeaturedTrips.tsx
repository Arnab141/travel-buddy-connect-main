
import TripCard from "./TripCard";
import { motion } from "framer-motion";
import {Link} from "react-router-dom";

const trips = [
  {
    from: "Delhi",
    to: "Manali, Himachal Pradesh",
    date: "Sat, 25 Jan 2025",
    departureTime: "6:00 AM",
    driver: {
      name: "Rahul Sharma",
      rating: 4.9,
      trips: 156,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    car: "Maruti Ertiga",
    seats: 3,
    price: 800,
    pickupPoints: [
      { location: "Kashmere Gate", time: "6:00 AM" },
      { location: "Majnu Ka Tilla", time: "6:20 AM" },
      { location: "Murthal", time: "7:00 AM" },
    ],
  },
  {
    from: "Mumbai",
    to: "Goa",
    date: "Sun, 26 Jan 2025",
    departureTime: "5:30 AM",
    driver: {
      name: "Priya Patel",
      rating: 4.8,
      trips: 89,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    car: "Honda City",
    seats: 2,
    price: 1200,
    pickupPoints: [
      { location: "Dadar Station", time: "5:30 AM" },
      { location: "Panvel", time: "6:30 AM" },
      { location: "Mahad", time: "8:00 AM" },
    ],
  },
  {
    from: "Bangalore",
    to: "Ooty",
    date: "Sat, 25 Jan 2025",
    departureTime: "4:00 AM",
    driver: {
      name: "Karthik Reddy",
      rating: 5.0,
      trips: 234,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    car: "Mahindra XUV700",
    seats: 4,
    price: 650,
    pickupPoints: [
      { location: "Majestic", time: "4:00 AM" },
      { location: "Electronic City", time: "4:45 AM" },
      { location: "Mysore Road", time: "5:15 AM" },
    ],
  },
  {
    from: "Chennai",
    to: "Pondicherry",
    date: "Sun, 26 Jan 2025",
    departureTime: "7:00 AM",
    driver: {
      name: "Arun Kumar",
      rating: 4.7,
      trips: 67,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    car: "Toyota Innova",
    seats: 5,
    price: 400,
    pickupPoints: [
      { location: "T. Nagar", time: "7:00 AM" },
      { location: "Guindy", time: "7:30 AM" },
      { location: "Mahabalipuram", time: "8:30 AM" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const FeaturedTrips = () => {
  return (
    <section id="trips" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
          >
            Available Rides
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Trips This Week
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through verified rides from trusted drivers. Book your seat and enjoy the journey together.
          </p>
        </motion.div>

        {/* Trip Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {trips.map((trip, index) => (
            <motion.div key={index} variants={itemVariants}>
              <TripCard {...trip} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.button 
            className="px-8 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="user/trips" className="block w-full h-full">
                 View All Trips
            </Link>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedTrips;
