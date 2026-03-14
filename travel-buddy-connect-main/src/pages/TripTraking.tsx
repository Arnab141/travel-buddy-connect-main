import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import { useParams } from "react-router-dom";

import TripMap from "@/components/TripMap";
import HostTripTrack from "@/components/trip/HostTripTrack";
import PassengerTripTrack from "../components/trip/PassengerTripTrack";

function TripTracking() {

  const { tripId } = useParams();
  const { tbtoken, fetchTripTracking, tracking } = useUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!tripId || !tbtoken) return;

    const loadTracking = async () => {
      setLoading(true);
      await fetchTripTracking(tripId);
      setLoading(false);
    };

    loadTracking();

  }, [tripId, tbtoken]);

  useEffect(() => {
    console.log("Tracking data updated:", tracking);
  }, [tracking]);

  if (loading) return <div>Loading...</div>;

  const trip = tracking.trip;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 space-y-6">

        {/* MAP ALWAYS VISIBLE */}
        <TripMap
          tripId={trip._id}
          from={trip.from}
          to={trip.to}
          pickupPoint={trip.pickupPoints}
        />

        {/* ROLE BASED UI */}

        {tracking.host ? (
          <HostTripTrack data={tracking} />
        ) : (
          <PassengerTripTrack data={tracking} />
        )}

      </div>
    </div>
  );
}

export default TripTracking;