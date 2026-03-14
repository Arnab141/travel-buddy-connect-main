import { useUser } from "@/context/UserContext";
import TripCard from "@/components/TripCard";
import { Trip, TripStatus } from "@/types/trip";
import { Car, Calendar, CheckCircle2, Ban, MapPin } from "lucide-react";

const tabConfig: { status: TripStatus; label: string; icon: React.ReactNode; emptyText: string }[] = [
  { status: "scheduled", label: "Upcoming", icon: <Calendar className="w-4 h-4" />, emptyText: "No upcoming trips scheduled." },
  { status: "ongoing", label: "Ongoing", icon: <Car className="w-4 h-4" />, emptyText: "No trips currently ongoing." },
  { status: "completed", label: "Completed", icon: <CheckCircle2 className="w-4 h-4" />, emptyText: "No completed trips yet." },
  { status: "cancelled", label: "Cancelled", icon: <Ban className="w-4 h-4" />, emptyText: "No cancelled trips." },
];

import { useState } from "react";
import MyTripCard from "@/components/MyTripCard";
import Navbar from "@/components/Navbar";

export default function MyTrip() {
  const { myTrips } = useUser();
  const [activeTab, setActiveTab] = useState<TripStatus>("scheduled");

const groupedTrips = myTrips.reduce<Record<TripStatus, Trip[]>>(
  (acc, trip) => {
    acc[trip.status as TripStatus].push(trip);
    return acc;
  },
  { scheduled: [], ongoing: [], completed: [], cancelled: [] }
);
  const activeTrips = groupedTrips[activeTab];
  const activeConfig = tabConfig.find((t) => t.status === activeTab)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">My Trips</h1>
              <p className="text-xs text-muted-foreground">
                {myTrips.length} total trip{myTrips.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            {tabConfig.map((tab) => {
              const count = groupedTrips[tab.status].length;
              const isActive = activeTab === tab.status;
              return (
                <button
                  key={tab.status}
                  onClick={() => setActiveTab(tab.status)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {count > 0 && (
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trip Cards */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {activeTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              {activeConfig.icon}
            </div>
            <p className="text-muted-foreground font-medium">{activeConfig.emptyText}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your trips will appear here when available.
            </p>
          </div>
        ) : (
          activeTrips.map((trip) => <MyTripCard key={trip._id} trip={trip} />)
        )}
      </div>
    </div>
  );
}
