const Trip = require("./tripmodel");
const User = require("./usermodel");
const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    pickupIndex: {
      type: Number,
      default: null,
      validate: {
        validator: function (value) {
          return value === null || value >= 0;
        },
        message: "pickupIndex must be null or >= 0",
      },
    },

    message: {
      type: String,
      maxlength: 300,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled_by_user",
        "cancelled_by_host",
        "expired" // ✅ NEW
      ],
      default: "pending",
    },

    seenByHost: {
      type: Boolean,
      default: false,
    },

    acceptedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

joinRequestSchema.index({ trip: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("JoinRequest", joinRequestSchema);