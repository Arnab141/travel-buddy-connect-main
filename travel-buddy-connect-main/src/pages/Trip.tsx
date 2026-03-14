import { useState, useMemo } from "react";
import { Car, Search, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import OrgTripCard from "../components/OrgTripCart";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Navbar";

const Trip = () => {
  const { tripData } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  /* ---------------- Filter Logic ---------------- */
  const filteredTrips = useMemo(() => {
    if (!tripData) return [];

    return tripData.filter((trip: any) => {
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        !q ||
        trip.from.name.toLowerCase().includes(q) ||
        trip.to.name.toLowerCase().includes(q) ||
        trip.driver?.name?.toLowerCase().includes(q) ||
        trip.pickupPoints?.some((pp: any) =>
          pp.location.name.toLowerCase().includes(q)
        );

      const matchesDate = !dateFilter || trip.tripDate === dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [searchQuery, dateFilter, tripData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Navbar />

      {/* ---------------- Hero Section ---------------- */}
      <div className="max-w-6xl mx-auto px-5 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 px-4 sm:px-0 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Perfect Ride
              </span>
            </h1>

            {/* Responsive Accent Line */}
            <div className="h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-primary to-purple-600 rounded-full mt-4 mb-6 mx-auto md:mx-0" />

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md sm:max-w-xl md:max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Travel smarter with verified drivers, flexible pickup points,
              and affordable shared journeys — all in one place.
            </p>
          </div>
        </motion.div>

        {/* Search + Filter */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search city, driver, pickup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="relative">
            <CalendarDays className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Showing <span className="font-semibold">{filteredTrips.length}</span> trips
        </p>
      </div>

      {/* ---------------- Trip Grid ---------------- */}
      <div className="max-w-6xl mx-auto px-5 pb-16">
        {filteredTrips.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTrips.map((trip: any, i: number) => (
              <OrgTripCard key={trip._id || i} trip={trip} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Car className="mx-auto w-10 h-10 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold">No trips found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trip;