import {
  MapPin,
  Users,
  Luggage,
  Shield,
  Phone,
  Mail,
  Calendar,
  Car,
  IndianRupee,
  Circle,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/* ---------------- Trip Type ---------------- */
interface Trip {
  _id: string;
  driver: {
    name: string;
    avatar: string;
    phone: string;
    email: string;
    gender: string;
  };
  from: { name: string; fullAddress: string };
  to: { name: string; fullAddress: string };
  pickupPoints: {
    location: { name: string; fullAddress: string };
    price: number;
  }[];
  tripDate: string;
  tripTime: string;
  vehicleType: string;
  basePrice: number;
  availableSeats: number;
  luggage: string;
  genderPreference: string;
  status: string;
  notes?: string;
}

interface Props {
  trip: Trip;
  index: number;
}

const OrgTripCard = ({ trip, index }: Props) => {
  const [joinedrequest, setJoinedrequest] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState("-1"); // "-1" means full journey
  const { user, joinrequest } = useUser();
  const [joinLoading, setJoinLoading] = useState(false);

  /* ---------------- Host + Gender Logic ---------------- */

  const isHost = user?.email === trip.driver.email;

  const genderMismatch =
    trip.genderPreference.toLowerCase() !== "anyone" &&
    user?.gender &&
    trip.genderPreference.toLowerCase() !== user.gender.toLowerCase();

  const shouldDisable = isHost || genderMismatch || joinedrequest;

  let buttonText = "Request to Join";

  if (isHost) {
    buttonText = "You are the Host";
  } else if (genderMismatch) {
    buttonText =
      trip.genderPreference.toLowerCase() === "male"
        ? "Male Only"
        : "Female Only";
  } else if (joinedrequest) {
    buttonText = "Request Sent ✓";
  }

  const formattedDate = format(parseISO(trip.tripDate), "EEE, dd MMM");

  const initials = trip.driver.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  /* ---------------- Price + Address Logic ---------------- */
  const { finalPrice, selectedAddress } = useMemo(() => {
    if (selectedPickup === "-1") {
      return {
        finalPrice: trip.basePrice,
        selectedAddress: trip.from.fullAddress,
      };
    }

    const pickupIndex = Number(selectedPickup);
    const pickup = trip.pickupPoints[pickupIndex];

    return {
      finalPrice: pickup?.price ?? trip.basePrice,
      selectedAddress:
        pickup?.location.fullAddress ?? trip.from.fullAddress,
    };
  }, [selectedPickup, trip]);

  /* ---------------- WhatsApp Chat ---------------- */
  const whatsappURL = `https://wa.me/91${trip.driver.phone.replace(
    /\D/g,
    ""
  )}`;

  const handleJoin = async () => {
    try {
      setJoinLoading(true);

      const requestData = {
        tripId: trip._id,
        pickupIndex:
          selectedPickup === "-1" ? null : Number(selectedPickup),
      };

      const response = await joinrequest(
        requestData.tripId,
        requestData.pickupIndex
      );

      if (response.success) {
        toast.success("Join request sent successfully!");
        setJoinedrequest(true);
      } else {
        toast.error(response.message || "Failed to send join request");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg border border-border p-6 space-y-6 transition-all"
    >
      <div
        className="h-1.5 w-full"
        style={{ background: "var(--gradient-primary)" }}
      />

      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <Avatar className="h-12 w-12">
            <AvatarImage src={trip.driver.avatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold">{trip.driver.name}</p>

            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
              <a
                href={`tel:${trip.driver.phone}`}
                className="flex items-center gap-1 hover:text-primary transition"
              >
                <Phone className="w-3 h-3" />
                {trip.driver.phone}
              </a>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${trip.driver.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition"
              >
                <Mail className="w-3 h-3" />
                Email
              </a>
              <div>
                <p>{trip.driver.gender}</p>
              </div>
            </div>
          </div>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${trip.status === "scheduled"
              ? "bg-green-100 text-green-600"
              : trip.status === "completed"
                ? "bg-blue-100 text-blue-600"
                : "bg-red-100 text-red-600"
            }`}
        >
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-2 bottom-2 w-[2px] bg-primary/30" />

        <div className="flex gap-4 mb-6 relative">
          <Circle className="w-6 h-6 text-primary bg-white z-10" />
          <div>
            <p className="font-medium text-sm">{trip.from.name}</p>
            <p className="text-xs text-muted-foreground">
              {trip.from.fullAddress}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 ml-10">
          <Calendar className="w-4 h-4" />
          {formattedDate} • {trip.tripTime}
        </div>

        <div className="flex gap-4 relative">
          <Circle className="w-6 h-6 text-destructive bg-white z-10" />
          <div>
            <p className="font-medium text-sm">{trip.to.name}</p>
            <p className="text-xs text-muted-foreground">
              {trip.to.fullAddress}
            </p>
          </div>
        </div>
      </div>

      {trip.pickupPoints.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2">
            Select Pickup Point
          </p>

          <select
            value={selectedPickup}
            onChange={(e) => setSelectedPickup(e.target.value)}
            className="w-full rounded-xl border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="-1">
              Full Journey (From Start) - ₹{trip.basePrice}
            </option>

            {trip.pickupPoints.map((pp, i) => (
              <option key={i} value={i}>
                {pp.location.name} - ₹{pp.price}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-muted-foreground">
            {selectedAddress}
          </p>
        </div>
      )}

      <div className="flex justify-between text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {trip.availableSeats} seats
        </div>

        <div className="flex items-center gap-1">
          <Luggage className="w-4 h-4" />
          {trip.luggage}
        </div>

        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4" />
          {trip.genderPreference}
        </div>

        <div className="flex items-center gap-1">
          <Car className="w-4 h-4" />
          {trip.vehicleType}
        </div>
      </div>

      {trip.notes && (
        <div className="text-xs bg-muted/40 p-3 rounded-lg">
          📝 {trip.notes}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-5">
        <div>
          <p className="text-xs text-muted-foreground">
            {selectedPickup === "-1"
              ? "Full Journey Price"
              : "Pickup Price"}
          </p>

          <p className="text-2xl font-bold text-primary flex items-center gap-1">
            <IndianRupee className="w-5 h-5" />
            {finalPrice}
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-sm font-medium bg-green-500 text-white flex items-center gap-2 hover:scale-105 transition"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </a>

          <Button
            onClick={handleJoin}
            disabled={shouldDisable || joinLoading}
            className={`px-6 py-2 rounded-xl text-sm font-medium ${shouldDisable
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary text-white hover:scale-105"
              }`}
          >
            {joinLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Sending...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrgTripCard; 