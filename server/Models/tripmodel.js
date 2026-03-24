const mongoose = require("mongoose");
const User = require('./usermodel')

/* ------------------ Sub Schemas ------------------ */

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fullAddress: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const pickupPointSchema = new mongoose.Schema(
  {
    location: { type: locationSchema, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

/* ------------------ Passenger Schema ------------------ */

const passengerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seatsBooked: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },

    // ✅ Store full pickup location instead of index
    selectedPickup: {
      type: locationSchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* ------------------ Main Trip Schema ------------------ */

const tripSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    from: { type: locationSchema, required: true },
    to: { type: locationSchema, required: true },

    pickupPoints: {
      type: [pickupPointSchema],
      default: [],
    },

    tripDate: { type: String, required: true },
    tripTime: { type: String, required: true },

    // ✅ Important for backend time comparison
    tripDateTime: {
      type: Date,
      required: true,
      index: true,
    },

    basePrice: { type: Number, required: true, min: 0 },

    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "bike", "suv", "van"],
    },

    availableSeats: {
      type: Number,
      required: true,
    },

    luggage: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "small",
    },

    genderPreference: {
      type: String,
      enum: ["anyone", "male", "female"],
      default: "anyone",
    },

    notes: { type: String, maxlength: 500 },

    joinedPassengers: {
      type: [passengerSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["scheduled",   // trip created, not started yet
        "ongoing",     // trip started, tracking active
        "completed",
        "cancelled"
      ],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);