import React, { useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button"; // ✅ your button

function HostTripTrack({ data }: any) {

  const { backendUrl, tbtoken } = useUser();
  const { tracking, trip } = data;

  const currentIndex = tracking.currentCheckpointIndex;

  const [loadingStart, setLoadingStart] = useState(false);

  const handleStart = async () => {
    try {
      setLoadingStart(true);

      await axios.post(
        `${backendUrl}/trip/start/${trip._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tbtoken}`,
          },
        }
      );

      // no need to manually update UI → socket will update

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStart(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">

      {/* START BUTTON */}

      {!tracking.tripStarted ? (
        <Button
          onClick={handleStart}
          disabled={loadingStart}
          className="w-full"
        >
          {loadingStart ? "Starting..." : "Start Journey"}
        </Button>
      ) : (
        <p className="text-yellow-600 font-semibold">
          🚗 Driver Arriving at{" "}
          {tracking.checkpoints[currentIndex]?.location?.name}
        </p>
      )}

      {/* TIMELINE */}

      {tracking.checkpoints.map((cp: any, i: number) => {

        const completed = i < currentIndex || cp.completed;
        const current = i === currentIndex;

        return (
          <div key={i} className="flex gap-4 pb-8">

            {/* LEFT TIMELINE */}

            <div className="flex flex-col items-center">

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center
                ${
                  completed
                    ? "bg-green-500 text-white"
                    : current
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {completed ? <Check size={18} /> : i + 1}
              </div>

              {i !== tracking.checkpoints.length - 1 && (
                <div
                  className={`w-[2px] h-12 ${
                    completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}

            </div>

            {/* RIGHT CONTENT */}

            <div className="flex-1">

              <p className="font-semibold text-lg">
                {cp.location.name}
              </p>

              <p className="text-sm text-gray-500 mb-3 capitalize">
                {cp.type}
              </p>

              {current && (
                <p className="text-yellow-600 text-sm">
                  Driver Arriving
                </p>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default HostTripTrack;