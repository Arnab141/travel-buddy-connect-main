import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function TripRequest() {
  const { requestId } = useParams();
  const location = useLocation();

  const { fetchRequest, markNotificationRead, tbtoken, backendUrl } = useUser();

  const notificationId = location.state?.notificationId;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<
    "accepted" | "rejected" | null
  >(null);

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    if (!requestId || !tbtoken) return;

    const loadData = async () => {
      setLoading(true);

      const data = await fetchRequest(requestId);

      console.log(data);

      if (data && data.success) {
        setRequest(data.request);
      } else {
        setRequest(null);
      }

      setLoading(false);
    };

    loadData();
  }, [requestId, tbtoken]);

  /* ---------------- Mark Notification Read ---------------- */
  useEffect(() => {
    if (notificationId) {
      markNotificationRead(notificationId);
    }
  }, [notificationId]);

  /* ---------------- Accept / Reject ---------------- */
  const handleStatusChange = async (
    status: "accepted" | "rejected"
  ) => {
    try {
      setActionLoading(status);

      const res = await axios.put(
        `${backendUrl}/trip/join/${requestId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${tbtoken}` },
        }
      );

      if (res.data.success) {
        setRequest((prev: any) => ({
          ...prev,
          status,
        }));
      }
    } catch (error) {
      console.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  /* ---------------- Loading Screen ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="pt-32 text-center text-lg">
        Request not found
      </div>
    );
  }

  const isHost = request.role === "host";
  const isPassenger = request.role === "passenger";

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {request.trip.from.name} → {request.trip.to.name}
            </h1>
            <p className="text-gray-500 mt-1">
              {request.trip.tripDate} • {request.trip.tripTime}
            </p>
          </div>

          <span
            className={`px-5 py-2 rounded-full text-sm font-semibold ${request.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : request.status === "accepted"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {request.status.toUpperCase()}
          </span>
        </div>

        {/* Pickup Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-2">
            Pickup Location
          </h2>

          <p className="text-base font-medium">
            {request.pickup.location.name}
          </p>

          <p className="text-gray-500 text-sm">
            {request.pickup.location.fullAddress}
          </p>

          <p className="mt-2 font-medium">
            Price: ₹{request.pickup.price}
          </p>

          {request.pickup.isDefault && (
            <p className="text-xs text-blue-600 mt-1">
              Boarding from trip starting point
            </p>
          )}
        </div>

        {/* Person Section */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">
            {isHost ? "Passenger Details" : "Driver Details"}
          </h2>

          <div className="flex items-center gap-5">
            <img
              src={
                isHost
                  ? request.passenger.avatar
                  : request.trip.driver.avatar
              }
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />

            <div className="flex-1">
              <p className="text-lg font-semibold">
                {isHost
                  ? request.passenger.name
                  : request.trip.driver.name}
              </p>

              <p className="text-gray-500">
                ⭐{" "}
                {isHost
                  ? request.passenger.rating
                  : request.trip.driver.rating}
              </p>

              <p className="text-sm text-gray-500">
                {isHost
                  ? request.passenger.phone
                  : request.trip.driver.phone}
              </p>

              <p className="text-sm text-gray-500">
                {isHost
                  ? request.passenger.email
                  : request.trip.driver.email}
              </p>

              {/* Contact Buttons */}
              <div className="flex gap-3 mt-3">
                <a
                  href={`tel:${isHost
                    ? request.passenger.phone
                    : request.trip.driver.phone
                    }`}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  📞 Call
                </a>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${isHost
                      ? request.passenger.email?.trim()
                      : request.trip.driver.email?.trim()
                    }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                  ✉ Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Host Controls */}
        {isHost && request.status === "pending" && (
          <div className="flex gap-6">
            <Button
              size="lg"
              className="flex-1"
              disabled={actionLoading !== null}
              onClick={() =>
                handleStatusChange("accepted")
              }
            >
              {actionLoading === "accepted" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Accepting...
                </>
              ) : (
                "Accept Request"
              )}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              disabled={actionLoading !== null}
              onClick={() =>
                handleStatusChange("rejected")
              }
            >
              {actionLoading === "rejected" ? (
                <>
                  <Loader2 className="animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Request"
              )}
            </Button>
          </div>
        )}

        {/* Passenger Accepted */}
        {isPassenger && request.status === "accepted" && (
          <div className="flex gap-6">
            <Button asChild size="lg" className="flex-1">
              <a href={`tel:${request.trip.driver.phone}`}>
                Call Driver
              </a>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              Chat
            </Button>
          </div>
        )}

        {/* Passenger Pending */}
        {isPassenger && request.status === "pending" && (
          <p className="text-center text-gray-500 text-lg">
            Waiting for driver approval...
          </p>
        )}

        {/* Passenger Rejected */}
        {isPassenger && request.status === "rejected" && (
          <p className="text-center text-red-500 text-lg">
            Your request was rejected.
          </p>
        )}
      </div>
    </div>
  );
}

export default TripRequest;