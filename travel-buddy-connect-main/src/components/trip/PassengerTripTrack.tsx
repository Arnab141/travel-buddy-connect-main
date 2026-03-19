import React from "react";
import { Phone, Check } from "lucide-react";

function PassengerTripTrack({ data }: any) {

  const { trip, tracking } = data;
  const driver = trip.driver;

  // ✅ FIXED
  const currentIndex = tracking.currentCheckpointIndex;

  return (
    <div className="space-y-8">

      {/* DRIVER CARD */}
      <div className="bg-white shadow-md rounded-xl p-5 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <img
            src={driver.avatar}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold text-lg">{driver.name}</p>
            <p className="text-gray-500 text-sm">Driver</p>
          </div>
        </div>

        <a
          href={`tel:${driver.phone}`}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          <Phone size={16} />
          Call
        </a>

      </div>


      {/* TRIP TIMELINE */}

      <div className="bg-white shadow-md rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-6">
          Trip Progress
        </h2>

        <div className="relative">

          {tracking.checkpoints.map((cp: any, i: number) => {

            // ✅ LOGIC FIX
            const completed = i < currentIndex;
            const current = i === currentIndex;

            return (

              <div key={i} className="flex gap-4 relative pb-8">

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
                      className={`w-[2px] h-10 ${
                        completed ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}

                </div>

                {/* RIGHT CONTENT */}
                <div>

                  <p className="font-semibold">
                    {cp.location.name}
                  </p>

                  <p className="text-sm text-gray-500 capitalize">
                    {cp.type}
                  </p>

                  {completed && (
                    <p className="text-green-600 text-sm mt-1">
                      Completed
                    </p>
                  )}

                  {current && (
                    <p className="text-yellow-600 text-sm mt-1">
                      Driver Arriving
                    </p>
                  )}

                  {!completed && !current && (
                    <p className="text-gray-400 text-sm mt-1">
                      Upcoming
                    </p>
                  )}

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}

export default PassengerTripTrack;