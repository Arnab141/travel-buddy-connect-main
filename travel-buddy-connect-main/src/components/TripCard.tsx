import { MapPin, Clock, Users, Star, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PickupPoint {
  location: string;
  time: string;
}

interface TripCardProps {
  from: string;
  to: string;
  date: string;
  departureTime: string;
  driver: {
    name: string;
    rating: number;
    trips: number;
    avatar: string;
  };
  car: string;
  seats: number;
  price: number;
  pickupPoints: PickupPoint[];
}

const TripCard = ({
  from,
  to,
  date,
  departureTime,
  driver,
  car,
  seats,
  price,
  pickupPoints,
}: TripCardProps) => {
  return (
    <motion.div 
      className="bg-card rounded-2xl p-6 card-shadow border border-border/50 cursor-pointer"
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
      }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
    >
      {/* Route Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex flex-col items-center">
              <motion.div 
                className="w-3 h-3 rounded-full bg-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.div 
                className="w-0.5 h-8 bg-gradient-to-b from-primary to-accent"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-accent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{from}</p>
              <p className="text-sm text-muted-foreground my-2">{departureTime}</p>
              <p className="font-semibold text-foreground">{to}</p>
            </div>
          </div>
        </div>
        <motion.div 
          className="text-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-3xl font-bold text-primary">₹{price}</p>
          <p className="text-sm text-muted-foreground">per seat</p>
        </motion.div>
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-4 py-3 border-y border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{seats} seats available</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Car className="w-4 h-4" />
          <span>{car}</span>
        </div>
      </div>

      {/* Pickup Points */}
      <div className="mt-4 mb-4">
        <p className="text-sm font-medium text-foreground mb-2">Pickup Points:</p>
        <div className="flex flex-wrap gap-2">
          {pickupPoints.map((point, index) => (
            <motion.div
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
            >
              <MapPin className="w-3 h-3 text-primary" />
              <span className="font-medium">{point.location}</span>
              <span className="text-muted-foreground">• {point.time}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Driver Info & CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.img
            src={driver.avatar}
            alt={driver.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
            whileHover={{ scale: 1.1 }}
          />
          <div>
            <p className="font-semibold text-foreground">{driver.name}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Star className="w-4 h-4 text-accent fill-accent" />
              </motion.div>
              <span>{driver.rating}</span>
              <span>•</span>
              <span>{driver.trips} trips</span>
            </div>
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {/* <Button variant="default">Book Seat</Button> */}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TripCard;
