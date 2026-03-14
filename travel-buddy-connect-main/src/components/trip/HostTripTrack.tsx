function HostTripTrack({ data }: any) {

  const { tracking } = data;

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      {!tracking.tripStarted && (
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg">
          Start Journey
        </button>
      )}

      {tracking.checkpoints.map((cp: any, i: number) => (

        <div key={i} className="border p-4 rounded-lg mt-4">

          <h3 className="font-semibold">
            {cp.location.name}
          </h3>

          {/* PASSENGERS */}

          {cp.passengers.map((p: any, j: number) => (

            <div
              key={j}
              className="flex justify-between mt-2 bg-gray-50 p-2 rounded"
            >

              <span>{p.user.name}</span>

              {p.verified ? (
                <span className="text-green-600">
                  Verified
                </span>
              ) : (
                <button className="bg-blue-600 text-white px-3 py-1 rounded">
                  Verify OTP
                </button>
              )}

            </div>

          ))}

        </div>

      ))}

    </div>
  );
}

export default HostTripTrack;