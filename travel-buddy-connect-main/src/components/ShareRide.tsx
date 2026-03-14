import { useState } from "react";
import { Button } from "@/components/ui/button";
import LocationSearchInput, {
  LocationValue,
} from "@/components/LocationSearchInput";
import { useUser } from "@/context/UserContext";
import {
  Car,
  Wallet,
  Users,
  Shield,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const benefits = [
  {
    icon: Wallet,
    title: "Earn Extra Income",
    description: "Cover your fuel costs and earn money from empty seats.",
  },
  {
    icon: Users,
    title: "Meet New People",
    description: "Connect with like-minded travelers and make lasting friendships.",
  },
  {
    icon: Shield,
    title: "Verified Passengers",
    description: "All passengers are verified for your safety and peace of mind.",
  },
];

type PickupPoint = {
  location: LocationValue | null; // ✅ FIXED
  price: string;
};

const ShareRide = () => {
  /* ------------------ ALL STATES ------------------ */

  const { tbtoken, shareTrip } = useUser(); // later for API

  // ✅ FIXED: now store full object not string
  const [from, setFrom] = useState<LocationValue | null>(null);
  const [to, setTo] = useState<LocationValue | null>(null);

  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([
    { location: null, price: "" },
  ]);

  const [tripDate, setTripDate] = useState("");
  const [tripTime, setTripTime] = useState("");

  const [basePrice, setBasePrice] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const [luggage, setLuggage] = useState("");
  const [genderPreference, setGenderPreference] = useState("anyone");

  const [availableSeats, setAvailableSeats] = useState<number>(3);
  const [notes, setNotes] = useState("");

  // ✅ prevent past date
  const today = new Date().toISOString().split("T")[0];

  /* ------------------ Pickup Point Functions ------------------ */

  const addPickupPoint = () => {
    setPickupPoints((prev) => [...prev, { location: null, price: "" }]);
  };

  const removePickupPoint = (index: number) => {
    setPickupPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePickupLocation = (index: number, value: LocationValue | null) => {
    setPickupPoints((prev) =>
      prev.map((p, i) => (i === index ? { ...p, location: value } : p))
    );
  };

  const updatePickupPrice = (index: number, value: string) => {
    setPickupPoints((prev) =>
      prev.map((p, i) => (i === index ? { ...p, price: value } : p))
    );
  };

  /* ------------------ Submit (for now just console) ------------------ */

  const handlePostTrip = async () => {
    try {
      setButtonLoading(true);

      // ✅ basic validation
      if (!from || !to || !tripDate || !tripTime || !basePrice || !vehicleType) {
        toast.error("Please fill all required fields!",{position:"top-center"});
        return;
      }

      const tripData = {
        from,
        to,
        pickupPoints,
        tripDate,
        tripTime,
        basePrice,
        vehicleType,
        luggage,
        genderPreference,
        availableSeats,
        notes,
      };

      // console.log("Trip Data:", tripData);
      // console.log("Token:", tbtoken);

      // 🔥 later: API call here

      if (!tbtoken) {
        toast.error("You must be logged in to share a trip!",{position:"top-center"});
        return;
      }
      const responce = await shareTrip(tripData);

      if (responce.success) {
        toast.success("trip share successfully")
        setTripDate("");
        setTripTime("");
        setBasePrice("");
        setVehicleType("");
        setLuggage("");
        setGenderPreference("anyone");
        setAvailableSeats(3);
        setNotes("");
        setPickupPoints([{ location: null, price: "" }]);
        setFrom(null);
        setTo(null);
      }else{
        toast.error(responce.message || "Failed to share trip");
      }

    } catch (err) {
      console.log(err);
    } finally {
      // ✅ always runs (even if return happens)
      setButtonLoading(false);
    }
  };


  return (
    <section id="share" className="py-20 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full hero-gradient opacity-5 rounded-l-[100px]"
        initial={{ x: "100%" }}
        whileInView={{ x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Become a Driver
            </motion.span>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Share Your Ride &
              <br />
              <span className="text-gradient">Earn While You Travel</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Have empty seats in your car? Share your upcoming trip and let
              others join you. It’s a win-win — reduce your travel costs while
              helping fellow travelers reach their destination.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.15 }}
                  whileHover={{ x: 10 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="hero" size="lg">
                <Car className="w-5 h-5" />
                Offer a Ride
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Trip Form */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div className="bg-card rounded-3xl p-8 card-shadow border border-border/50">
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Post Your Trip
                </h3>

                {/* FROM (Photon) */}
                <LocationSearchInput
                  label="From"
                  placeholder="Enter starting point"
                  value={from}
                  onChange={setFrom}
                />

                {/* TO (Photon) */}
                <LocationSearchInput
                  label="To"
                  placeholder="Enter destination"
                  value={to}
                  onChange={setTo}
                />

                {/* PICKUP POINTS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground">
                      Pickup Points
                    </label>

                    <motion.button
                      type="button"
                      onClick={addPickupPoint}
                      className="flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {pickupPoints.map((point, index) => (
                      <motion.div
                        key={index}
                        className="grid grid-cols-12 gap-2 items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {/* Location (Photon) */}
                        <div className="relative col-span-7">
                          <LocationSearchInput
                            label=""
                            placeholder={`Pickup point ${index + 1}`}
                            value={point.location}
                            onChange={(val) => updatePickupLocation(index, val)}
                          />
                        </div>

                        {/* Price */}
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={point.price}
                            onChange={(e) =>
                              updatePickupPrice(index, e.target.value)
                            }
                            placeholder="₹ price"
                            className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                          />
                        </div>

                        {/* Remove */}
                        <div className="col-span-1 flex justify-end">
                          {pickupPoints.length > 1 && (
                            <motion.button
                              type="button"
                              onClick={() => removePickupPoint(index)}
                              className="w-12 h-12 rounded-xl bg-secondary hover:bg-destructive/15 flex items-center justify-center transition"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-5 h-5 text-destructive" />
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* DATE + TIME */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={tripDate}
                      min={today}
                      onChange={(e) => setTripDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="time"
                        value={tripTime}
                        onChange={(e) => setTripTime(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* BASE PRICE + VEHICLE */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Base Price / Seat
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="₹500"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                      <option value="">Select</option>
                      <option value="car">Car</option>
                      <option value="bike">Bike</option>
                      <option value="suv">SUV</option>
                      <option value="van">Van</option>
                    </select>
                  </div>
                </div>

                {/* LUGGAGE + GENDER */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Max Luggage
                    </label>
                    <select
                      value={luggage}
                      onChange={(e) => setLuggage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                      <option value="">Select</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Gender Preference
                    </label>
                    <select
                      value={genderPreference}
                      onChange={(e) => setGenderPreference(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                      <option value="anyone">Anyone</option>
                      <option value="male">Male Only</option>
                      <option value="female">Female Only</option>
                    </select>
                  </div>
                </div>

                {/* SEATS */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Available Seats
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <motion.button
                        type="button"
                        key={num}
                        onClick={() => setAvailableSeats(num)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all ${num === availableSeats
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-primary/20"
                          }`}
                        whileHover={{ scale: 1.08, y: -3 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {num}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* NOTES */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Example: I can stop near New Town. Please be on time 🙂"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>

                {/* SUBMIT */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full mt-2"
                    onClick={handlePostTrip}
                    disabled={buttonLoading}
                  >
                    {buttonLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Posting...
                      </div>
                    ) : (
                      "Post Trip"
                    )}
                  </Button>

                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShareRide;
