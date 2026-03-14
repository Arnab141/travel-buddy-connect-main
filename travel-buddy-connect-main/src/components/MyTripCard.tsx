import { Trip, TripStatus } from "@/types/trip";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, differenceInHours } from "date-fns";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  Luggage,
  Navigation,
  Ban,
  LogOut,
  ChevronRight,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  Radio,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TripCardProps {
  trip: Trip;
}

const statusConfig: Record<TripStatus, { label: string; className: string; icon: React.ReactNode }> = {
  scheduled: {
    label: "Upcoming",
    className: "bg-info/10 text-info border-info/20",
    icon: <Calendar className="w-3.5 h-3.5" />,
  },
  ongoing: {
    label: "Ongoing",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: <Radio className="w-3.5 h-3.5 animate-pulse" />,
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success border-success/20",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

function canCancelOrLeave(tripDateTime: string): boolean {
  const tripTime = parseISO(tripDateTime);
  return differenceInHours(tripTime, new Date()) > 24;
}

export default function ({ trip }: TripCardProps) {
  const status = statusConfig[trip.status];
  const canModify = trip.status === "scheduled" && canCancelOrLeave(trip.tripDateTime);
  const tripDate = parseISO(trip.tripDateTime);

  return (
    <div className="group relative bg-card rounded-2xl border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${status.className} gap-1.5 font-semibold text-xs px-2.5 py-1`}>
            {status.icon}
            {status.label}
          </Badge>
          <Badge variant="outline" className="text-xs font-medium capitalize px-2.5 py-1 bg-card">
            {trip.role === "host" ? "🚗 Host" : "👤 Passenger"}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {format(tripDate, "MMM dd, yyyy")}
        </span>
      </div>

      {/* Route Section */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 pt-1">
            <CircleDot className="w-4 h-4 text-primary" />
            <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
            <MapPin className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <p className="text-sm font-semibold text-foreground truncate">{trip.from.name}</p>
              <p className="text-xs text-muted-foreground truncate">{trip.from.fullAddress}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground truncate">{trip.to.name}</p>
              <p className="text-xs text-muted-foreground truncate">{trip.to.fullAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Details Grid */}
      <div className="px-5 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <DetailChip icon={<Clock className="w-3.5 h-3.5" />} label="Time" value={trip.tripTime} />
          <DetailChip icon={<Car className="w-3.5 h-3.5" />} label="Vehicle" value={trip.vehicleType} />
          <DetailChip icon={<Users className="w-3.5 h-3.5" />} label="Seats" value={`${trip.availableSeats} left`} />
          <DetailChip icon={<Luggage className="w-3.5 h-3.5" />} label="Luggage" value={trip.luggage} />
        </div>
      </div>

      {/* Price */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl px-4 py-3 border border-primary/10">
          <span className="text-sm text-muted-foreground font-medium">Base Price</span>
          <span className="text-xl font-extrabold text-primary">₹{trip.basePrice}</span>
        </div>
      </div>

      {/* Driver Details */}
      <DriverSection driver={trip.driver} />

      {/* Passengers */}
      {trip.joinedPassengers.length > 0 && (
        <div className="px-5 pb-3">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
            Passengers ({trip.joinedPassengers.length})
          </p>
          <div className="space-y-2">
            {trip.joinedPassengers.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-xl px-3 py-2.5">
                <Avatar className="w-9 h-9 ring-2 ring-primary/10">
                  <AvatarImage src={p.user.avatar} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                    {p.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{p.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.seatsBooked} seat{p.seatsBooked > 1 ? "s" : ""} booked
                  </p>
                </div>
                <Badge variant="outline" className="text-xs capitalize bg-success/10 text-success border-success/20 font-semibold">
                  {p.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pickup Points */}
      {trip.pickupPoints.length > 0 && (
        <div className="px-5 pb-3">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
            Pickup Points
          </p>
          <div className="space-y-1.5">
            {trip.pickupPoints.map((pp, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 py-2.5">
                <Navigation className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">{pp.location.name}</span>
                <span className="text-sm font-bold text-primary">₹{pp.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Messages & Actions */}
      <div className="px-5 pb-5 pt-1">
        {trip.status === "ongoing" && (
          <div className="bg-warning/5 border border-warning/20 rounded-xl p-3.5 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-warning animate-pulse" />
              <p className="text-sm font-semibold text-warning">Trip is currently ongoing</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              Cancel and leave options are disabled during an ongoing trip.
            </p>
          </div>
        )}

        {trip.status === "completed" && (
          <div className="bg-success/5 border border-success/20 rounded-xl p-3.5 mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <p className="text-sm font-semibold text-success">Trip completed successfully</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              Thanks for riding! Rating feature coming soon.
            </p>
          </div>
        )}

        {trip.status === "cancelled" && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3.5 mb-3">
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-destructive" />
              <p className="text-sm font-semibold text-destructive">This trip has been cancelled</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              No further actions are available.
            </p>
          </div>
        )}

        {trip.status === "scheduled" && (
          <div className="flex items-center gap-3">
            {trip.role === "host" ? (
              <Button variant="destructive" className="flex-1 gap-2 rounded-xl h-11 font-semibold" disabled={!canModify}>
                <Ban className="w-4 h-4" />
                {canModify ? "Cancel Trip" : "Cannot cancel (<24h)"}
              </Button>
            ) : (
              <Button variant="destructive" className="flex-1 gap-2 rounded-xl h-11 font-semibold" disabled={!canModify}>
                <LogOut className="w-4 h-4" />
                {canModify ? "Leave Trip" : "Cannot leave (<24h)"}
              </Button>
            )}
            <Button variant="outline" className="gap-2 rounded-xl h-11 px-5 font-semibold">
              Details
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {trip.status === "ongoing" && (
          <Link to={`/user/my-trips/track/${trip._id}`} >
            <Button className="w-full gap-2 rounded-xl h-12 bg-primary hover:bg-primary/90 font-bold text-base shadow-md shadow-primary/20">
              <Navigation className="w-4 h-4" />
              Track Trip
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function DriverSection({ driver }: { driver: Trip["driver"] }) {
  return (
    <div className="px-5 pb-3">
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
        Driver
      </p>
      <div className="bg-gradient-to-r from-primary/5 via-card to-accent/5 rounded-xl p-4 border border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20 shadow-md">
            <AvatarImage src={driver.avatar} />
            <AvatarFallback className="text-sm bg-primary text-primary-foreground font-bold">
              {driver.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">{driver.name}</p>
            <p className="text-xs text-muted-foreground truncate">{driver.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`tel:${driver.phone}`}
            className="flex-1 flex items-center justify-center gap-2 bg-success/10 hover:bg-success/20 text-success rounded-lg py-2.5 text-xs font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          <a
            href={`mailto:${driver.email}`}
            className="flex-1 flex items-center justify-center gap-2 bg-info/10 hover:bg-info/20 text-info rounded-lg py-2.5 text-xs font-semibold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Email
          </a>
          <a
            href={`https://wa.me/${driver.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg py-2.5 text-xs font-semibold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5 border border-border/30">
      <span className="text-primary">{icon}</span>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
        <p className="text-xs font-bold text-foreground capitalize">{value}</p>
      </div>
    </div>
  );
}
