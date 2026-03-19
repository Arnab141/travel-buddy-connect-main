const cron = require("node-cron");
const Trip = require("../Models/tripmodel");
const JoinRequest = require("../Models/joinRequest");
const Notification = require("../Models/notificaton");
const user = require("../Models/usermodel");
const mongoose = require("mongoose");
const TripTracking = require("../Models/triptraking");

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const createNewTriptarking = async (tripId) => {
  try {
    const trip = await Trip.findById(tripId).populate("joinedPassengers.user");

    if (!trip) {
      throw new Error("Trip not found");
    }

    /* ---------------- Check if tracking already exists ---------------- */

    const existing = await TripTracking.findOne({ trip: tripId });

    if (existing) {
      return existing;
    }

    /* ---------------- Build Checkpoints ---------------- */

    const checkpoints = [];

    /* ---------- Start Location ---------- */

    checkpoints.push({
      type: "start",
      location: trip.from,
      completed: false,
      passengers: [],
    });

    /* ---------- Pickup Points ---------- */

    trip.pickupPoints.forEach((pickup) => {

      const passengersAtPickup = trip.joinedPassengers
        .filter(
          (p) =>
            p.status === "accepted" &&
            p.selectedPickup.lat === pickup.location.lat &&
            p.selectedPickup.lng === pickup.location.lng
        )
        .map((p) => ({
          user: p.user._id,
          otp: generateOtp(),
          verified: false,
        }));

      checkpoints.push({
        type: "pickup",
        location: pickup.location,
        passengers: passengersAtPickup,
        completed: false,
      });

    });

    /* ---------- Destination ---------- */

    checkpoints.push({
      type: "destination",
      location: trip.to,
      passengers: [],
      completed: false,
    });

    /* ---------------- Create Tracking ---------------- */

    const tracking = await TripTracking.create({
      trip: trip._id,
      driver: trip.driver,
      tripStarted: false,
      tripEnded: false,
      currentCheckpointIndex: 0,
      checkpoints,
    });

    return tracking;

  } catch (error) {
    console.error("TripTracking creation error:", error);
    throw error;
  }
};


// Runs every 1 minute
cron.schedule("* * * * *", async () => {
  try {

    console.log("⏳ Checking for completed trips...");

    const now = new Date();

    // 1️⃣ Find trips that should start
    const trips = await Trip.find({
      status: "scheduled",
      tripDateTime: { $lte: now },
    });

    if (!trips.length) return;

    for (const trip of trips) {

      /* ---------------- Update Trip Status ---------------- */

      trip.status = "ongoing";
      await trip.save();

      /* ---------------- Expire Pending Requests ---------------- */

      await JoinRequest.updateMany(
        { trip: trip._id, status: "pending" },
        { $set: { status: "expired" } }
      );

      /* ---------------- Mark Old Notifications Inactive ---------------- */

      await Notification.updateMany(
        { tripId: trip._id, type: "join_request" },
        { $set: { read: true, isActive: false } }
      );

      /* ---------------- Create Trip Tracking ---------------- */

      await createNewTriptarking(trip._id);

      console.log(
        `✅ Trip ${trip._id} marked ongoing, pending requests expired, and tracking created.`
      );
    }

  } catch (error) {
    console.log("Cron error:", error);
  }
});