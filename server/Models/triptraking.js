const mongoose = require("mongoose");
const User = require('./usermodel')
const Trip = require('./tripmodel')

/* ---------------- Passenger Verification Schema ---------------- */

const passengerVerificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
    },
  },
  { _id: false }
);

/* ---------------- Checkpoint Schema ---------------- */

const checkpointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["start", "pickup", "destination"],
      required: true,
    },

    location: {
      name: String,
      fullAddress: String,
      lat: Number,
      lng: Number,
    },

    passengers: {
      type: [passengerVerificationSchema],
      default: [],
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },
  },
  { _id: false }
);

/* ---------------- Trip Tracking Schema ---------------- */

const tripTrackingSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      unique: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tripStarted: {
      type: Boolean,
      default: false,
    },

    tripEnded: {
      type: Boolean,
      default: false,
    },

    currentCheckpointIndex: {
      type: Number,
      default: 0,
    },

    checkpoints: {
      type: [checkpointSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TripTracking", tripTrackingSchema);