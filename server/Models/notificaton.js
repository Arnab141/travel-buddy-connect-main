const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  id: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: [
      "join_request",
      "accepted",
      "rejected",
      "trip_completed",
      "trip_cancelled",
      "request_expired"
    ],
    required: true
  },

  message: {
    type: String,
    required: true
  },

  read: {
    type: Boolean,
    default: false
  },

  isActive: {                 // ✅ ADD THIS
    type: Boolean,
    default: true
  },

  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip"
  },

  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JoinRequest"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notificationSchema);