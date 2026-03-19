const Trip = require("../../Models/tripmodel");
const JoinRequest = require("../../Models/joinRequest");
const User = require("../../Models/usermodel");
const Notification = require("../../Models/notificaton");
const nodemailer = require("nodemailer");
const { text } = require("body-parser");
const TripTracking = require("../../Models/triptraking");



const sendEmail = async (to, subject, html) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
  } catch (error) {
    console.log("Error sending email:", error);
  }
}

const sheareTrip = async (req, res) => {
  console.log("trip model is call");

  try {
    const driverId = req.userId; // from isLogin middleware

    const {
      from,
      to,
      pickupPoints,
      tripDate,
      tripTime,
      basePrice,
      vehicleType,
      luggage,
      genderPreference,
      availableSeats,
      notes,
    } = req.body;

    /* -------------------- Basic Validation -------------------- */

    if (!from || !to || !tripDate || !tripTime || !basePrice || !vehicleType || !availableSeats) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided!",
      });
    }

    if (!driverId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: driver id not found!",
      });
    }

    /* -------------------- Convert Date + Time -------------------- */

    // ✅ Combine date and time (India timezone safe)
    const tripDateTime = new Date(`${tripDate}T${tripTime}:00+05:30`);

    if (isNaN(tripDateTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip date or time format",
      });
    }

    /* -------------------- Create Trip -------------------- */

    const trip = await Trip.create({
      driver: driverId,

      from,
      to,

      pickupPoints: (pickupPoints || []).map((p) => ({
        location: p.location,
        price: Number(p.price),
      })),

      tripDate,
      tripTime,
      tripDateTime, // ✅ Important for cron

      basePrice: Number(basePrice),
      vehicleType,

      luggage,
      genderPreference,

      availableSeats: Number(availableSeats),

      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Trip shared successfully!",
      trip,
    });

  } catch (error) {
    console.log("shareTrip error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sharing trip",
      error: error.message,
    });
  }
};

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ status: "scheduled" }).populate("driver", "name email phone avatar gender");
    // console.log("Fetched trips:", trips);
    return res.status(200).json({
      success: true,
      trips,
    });
  } catch (error) {
    console.log("getTrips error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching trips",
      error: error.message,
    });
  }
};

const joinRequest = async (req, res) => {
  try {
    const io = req.app.get("io");   // ✅ get socket instance

    const userId = req.userId;
    const { tripId, pickupIndex } = req.body;

    // 1️⃣ Check user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Check trip
    const trip = await Trip.findById(tripId).populate("driver");
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Trip is not scheduled for joining",
      });
    }

    // 3️⃣ Prevent host joining own trip
    if (trip.driver.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot join your own trip",
      });
    }

    // 4️⃣ Gender validation
    if (
      trip.genderPreference !== "anyone" &&
      trip.genderPreference !== user.gender
    ) {
      return res.status(400).json({
        success: false,
        message: `${trip.genderPreference} only trip`,
      });
    }

    // 5️⃣ Seat availability
    if (trip.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: "No seats available",
      });
    }

    // 6️⃣ Validate pickupIndex
    if (pickupIndex !== null && pickupIndex !== undefined) {
      if (
        pickupIndex < 0 ||
        pickupIndex >= trip.pickupPoints.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid pickup point selected",
        });
      }
    }

    // 7️⃣ Prevent duplicate request
    const existingRequest = await JoinRequest.findOne({
      user: userId,
      trip: tripId,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already requested this trip and your request is " + existingRequest.status,
      });
    }

    // 8️⃣ Create join request
    const joinRequestDoc = await JoinRequest.create({
      user: userId,
      trip: tripId,
      pickupIndex: pickupIndex ?? null,
    });

    // ============================
    // 🔥 EMIT SOCKET TO HOST
    // ============================
    const notification = await Notification.create({
      user: trip.driver._id,
      id: joinRequestDoc._id.toString(),
      type: "join_request",
      message: `${user.name} requested to join your trip from ${trip.from.name} to ${trip.to.name}`,
      tripId: trip._id,
      requestId: joinRequestDoc._id,
    });

    // Emit full notification document
    io.to(trip.driver._id.toString()).emit(
      "new_join_request",
      notification
    );
    sendEmail(
      trip.driver.email,
      "🚗 New Join Request for Your Trip",
      `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">New Join Request 🚘</h2>
        <p style="margin: 5px 0 0;">Someone wants to join your trip!</p>
      </div>

      <!-- Body -->
      <div style="padding: 25px; color: #333;">
        
        <h3 style="margin-top: 0;">📍 Trip Details</h3>
        <p><strong>From:</strong> ${trip.from.name}</p>
        <p><strong>To:</strong> ${trip.to.name}</p>
        <p><strong>Date:</strong> ${new Date(trip.tripDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${trip.tripTime}</p>

        <hr style="margin: 20px 0;" />

        <h3>👤 Passenger Details</h3>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>x 

        <div style="text-align: center; margin-top: 30px;">
          <a href="YOUR_FRONTEND_URL/trip-requests"
             style="background: #16a34a; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
             View Request
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background: #f8fafc; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        <p style="margin: 0;">You received this email because you posted a trip on TravelBuddy.</p>
        <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} TravelBuddy. All rights reserved.</p>
      </div>

    </div>
  </div>
  `
    );

    return res.status(201).json({
      success: true,
      message: "Join request sent successfully!",
      joinRequest: joinRequestDoc,
    });

  } catch (error) {
    console.log("joinRequest error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while sending join request",
      error: error.message,
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification
      // .find({ user: req.userId, isActive: true })   // ✅ filter here
      .find({ user: req.userId })   // ✅ filter here
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};

const getJoinRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    const request = await JoinRequest.findById(requestId)
      .populate({
        path: "trip",
        select:
          "from to tripDate tripTime basePrice availableSeats pickupPoints status driver",
        populate: {
          path: "driver",
          select: "name email phone avatar rating",
        },
      })
      .populate({
        path: "user",
        select: "name email phone avatar rating gender",
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const isHost =
      request.trip.driver._id.toString() === userId.toString();

    const isPassenger =
      request.user._id.toString() === userId.toString();

    if (!isHost && !isPassenger) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    /* -------- Pickup Logic -------- */

    let selectedPickupPoint;
    let isDefaultPickup = false;

    if (
      request.pickupIndex !== null &&
      request.trip.pickupPoints &&
      request.trip.pickupPoints[request.pickupIndex]
    ) {
      selectedPickupPoint =
        request.trip.pickupPoints[request.pickupIndex];
    } else {
      selectedPickupPoint = {
        location: request.trip.from,
        price: request.trip.basePrice,
      };
      isDefaultPickup = true;
    }

    /* -------- Format Response -------- */

    const responseData = {
      _id: request._id,
      status: request.status,
      message: request.message,
      createdAt: request.createdAt,
      acceptedAt: request.acceptedAt,

      role: isHost ? "host" : "passenger",

      seen: {
        seenByHost: request.seenByHost,
      },

      pickup: {
        index: request.pickupIndex,
        isDefault: isDefaultPickup,
        location: selectedPickupPoint.location,
        price: selectedPickupPoint.price,
      },

      passenger: {
        _id: request.user._id,
        name: request.user.name,
        email: request.user.email,
        phone: request.user.phone,
        avatar: request.user.avatar,
        rating: request.user.rating,
        gender: request.user.gender,
      },

      trip: {
        _id: request.trip._id,
        from: request.trip.from,
        to: request.trip.to,
        tripDate: request.trip.tripDate,
        tripTime: request.trip.tripTime,
        basePrice: request.trip.basePrice,
        availableSeats: request.trip.availableSeats,
        status: request.trip.status,

        driver: {
          _id: request.trip.driver._id,
          name: request.trip.driver.name,
          email: request.trip.driver.email,
          phone: request.trip.driver.phone,
          avatar: request.trip.driver.avatar,
          rating: request.trip.driver.rating,
        },
      },
    };



    return res.status(200).json({
      success: true,
      request: responseData,
    });

  } catch (error) {
    console.error("Fetch join request error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    const notification = await Notification.findOneAndUpdate(
      {
        id: notificationId,   // using your custom id field
        user: userId          // security check
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });

  } catch (error) {
    console.log("Mark notification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.userId;
    const io = req.app.get("io");   // ✅ get socket instance

    const request = await JoinRequest.findById(requestId)
      .populate("trip")
      .populate("user");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Only host can update
    if (request.trip.driver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Update status
    request.status = status;
    request.acceptedAt =
      status === "accepted" ? new Date() : null;

    await request.save();

    // 🔥 Conditional Logic
    if (status === "accepted") {
      await addUserInTrip(request, io);
    }

    if (status === "rejected") {
      await rejectJoinRequest(request, io);
    }

    return res.status(200).json({
      success: true,
      message: `Request ${status}`,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const addUserInTrip = async (request, io) => {
  // Fetch fresh trip


  const trip = await Trip.findById(request.trip._id)
    .populate("driver")
    .populate("joinedPassengers.user");

  if (!trip) {
    throw new Error("Trip not found");
  }

  if (trip.availableSeats <= 0) {
    throw new Error("No seats available");
  }

  // 🚫 Prevent duplicate addition
  const alreadyJoined = trip.joinedPassengers.find(
    (p) => p.user._id.toString() === request.user._id.toString()
  );

  if (alreadyJoined) {
    throw new Error("User already added to trip");
  }

  /* ---------------- Pickup Logic ---------------- */

  let selectedPickupLocation;

  if (
    request.pickupIndex === null ||
    request.pickupIndex === undefined
  ) {
    selectedPickupLocation = trip.from;
  } else {
    const pickup = trip.pickupPoints[request.pickupIndex];

    if (!pickup) {
      throw new Error("Invalid pickup index");
    }

    selectedPickupLocation = pickup.location;
  }

  /* ---------------- Add Passenger ---------------- */

  trip.joinedPassengers.push({
    user: request.user._id,
    seatsBooked: 1,
    selectedPickup: selectedPickupLocation,
    status: "accepted",
    joinedAt: new Date(),
  });

  trip.availableSeats -= 1;

  await trip.save();

  /* ===============================
     📧 SEND EMAIL TO PASSENGER
     =============================== */

  await sendEmail(
    request.user.email,
    "🎉 Your Trip Request Has Been Accepted!",
    `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
        
        <div style="background:#16a34a;color:white;padding:20px;text-align:center;">
          <h2 style="margin:0;">Trip Confirmed 🚗</h2>
        </div>

        <div style="padding:25px;color:#333;">
          <p>Hello <strong>${request.user.name}</strong>,</p>

          <p>Your join request has been <strong>accepted</strong> by the host.</p>

          <h3>📍 Trip Details</h3>
          <p><strong>From:</strong> ${trip.from.name}</p>
          <p><strong>To:</strong> ${trip.to.name}</p>
          <p><strong>Date:</strong> ${new Date(trip.tripDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${trip.tripTime}</p>

          <h3>📌 Pickup Location</h3>
          <p>${selectedPickupLocation.name}</p>

          <h3>👤 Driver Details</h3>
          <p><strong>Name:</strong> ${trip.driver.name}</p>
          <p><strong>Phone:</strong> ${trip.driver.phone}</p>

          <div style="text-align:center;margin-top:30px;">
            <a href="${process.env.FRONTEND_URL}/trips"
               style="background:#2563eb;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
               View Trip
            </a>
          </div>
        </div>

        <div style="background:#f8fafc;text-align:center;padding:15px;font-size:12px;color:#777;">
          <p>© ${new Date().getFullYear()} TravelBuddy</p>
        </div>
      </div>
    </div>
    `
  );

  const notification = await Notification.create({
    user: request.user._id,
    id: request._id.toString(),
    type: "accepted",
    message: `Your request to join the trip from ${trip.from.name} to ${trip.to.name} has been accepted!`,
    tripId: trip._id,
    requestId: request._id,
  });

  io.to(request.user._id.toString()).emit(
    "request_accepted",
    notification
  );
};

const removeUserFromTrip = async (request) => {
  const trip = await Trip.findById(request.trip._id);

  if (!trip) {
    throw new Error("Trip not found");
  }

  const passengerIndex = trip.joinedPassengers.findIndex(
    (p) => p.user.toString() === request.user._id.toString()
  );

  if (passengerIndex === -1) {
    return; // Not in trip
  }

  trip.joinedPassengers.splice(passengerIndex, 1);

  // Increase seat back
  trip.availableSeats += 1;

  await trip.save();
};

const rejectJoinRequest = async (request, io) => {
  try {
    // 1️⃣ Update status

    request.status = "rejected";
    await request.save();

    // 2️⃣ Populate required data
    await request.populate("user");
    await request.populate({
      path: "trip",
      populate: { path: "driver" }
    });

    const trip = request.trip;
    const passenger = request.user;

    /* ===============================
       🔔 Create Notification
       =============================== */

    const notification = await Notification.create({
      user: passenger._id,
      id: request._id.toString(),
      type: "rejected",
      message: `Your join request for trip from ${trip.from.name} to ${trip.to.name} was rejected.`,
      tripId: trip._id,
      requestId: request._id,
    });

    // Emit real-time socket notification
    if (io) {
      io.to(passenger._id.toString()).emit(
        "request_rejected",
        notification
      );
    }

    /* ===============================
       📧 Send Email to Passenger
       =============================== */

    await sendEmail(
      passenger.email,
      "❌ Your Trip Request Was Rejected",
      `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          
          <div style="background:#dc2626;color:white;padding:20px;text-align:center;">
            <h2 style="margin:0;">Trip Request Rejected</h2>
          </div>

          <div style="padding:25px;color:#333;">
            <p>Hello <strong>${passenger.name}</strong>,</p>

            <p>Unfortunately, your request to join the trip has been <strong>rejected</strong> by the host.</p>

            <h3>📍 Trip Details</h3>
            <p><strong>From:</strong> ${trip.from.name}</p>
            <p><strong>To:</strong> ${trip.to.name}</p>
            <p><strong>Date:</strong> ${new Date(trip.tripDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${trip.tripTime}</p>

            <p>You can explore other available trips in TravelBuddy.</p>

            <div style="text-align:center;margin-top:30px;">
              <a href="${process.env.FRONTEND_URL}/"
                 style="background:#2563eb;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
                 Find Another Trip
              </a>
            </div>
          </div>

          <div style="background:#f8fafc;text-align:center;padding:15px;font-size:12px;color:#777;">
            <p>© ${new Date().getFullYear()} TravelBuddy</p>
          </div>
        </div>
      </div>
      `
    );



  } catch (error) {
    console.log("Reject join request error:", error);
    throw new Error("Failed to reject join request");
  }
};

const getMyTrips = async (req, res) => {
  try {
    const userId = req.userId;

    const trips = await Trip.find({
      $or: [
        { driver: userId },
        { "joinedPassengers.user": userId }
      ]
    })
      .populate("driver", "name email phone avatar")
      .populate("joinedPassengers.user", "name email phone avatar")
      .sort({ tripDateTime: -1 });

    // Add role field for frontend
    const formattedTrips = trips.map(trip => {
      const isHost = trip.driver._id.toString() === userId.toString();

      return {
        ...trip.toObject(),
        role: isHost ? "host" : "passenger"
      };
    });

    return res.status(200).json({
      success: true,
      message: "My trips fetched successfully",
      data: formattedTrips
    });

  } catch (error) {
    console.log("Get my trips error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your trips",
      error: error.message,
    });
  }
};

const getTripTracking = async (req, res) => {
  try {

    const { tripId } = req.params;
    const userId = req.user.id; 

    /* ---------------- Get Trip ---------------- */

    const trip = await Trip.findById(tripId)
      .populate("driver", "name email phone avatar rating")
      .populate("joinedPassengers.user", "name email phone avatar");

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    /* ---------------- Get Tracking ---------------- */

    const tracking = await TripTracking.findOne({ trip: tripId })
      .populate("driver", "name email phone avatar rating")
      .populate("checkpoints.passengers.user", "name email phone avatar");

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Trip tracking not found",
      });
    }

    /* ---------------- Check Host ---------------- */

    const host = trip.driver._id.toString() === userId;

    /* ---------------- Response ---------------- */

res.status(200).json({
  success: true,
  data: {
    host,

    trip: {
      _id: trip._id,
      driver: {
        _id: trip.driver._id,
        name: trip.driver.name,
        email: trip.driver.email,
        phone: trip.driver.phone,
        avatar: trip.driver.avatar,
        rating: trip.driver.rating, 
      },

      from: trip.from,
      to: trip.to,
      pickupPoints: trip.pickupPoints,
      tripDate: trip.tripDate,
      tripTime: trip.tripTime,
      basePrice: trip.basePrice,
      availableSeats: trip.availableSeats,
      status: trip.status,

      joinedPassengers: trip.joinedPassengers.map(p => ({
        user: {
          _id: p.user._id,
          name: p.user.name,
          email: p.user.email,
          phone: p.user.phone,
          avatar: p.user.avatar,
          // rating: p.user.rating,
        },
        seatsBooked: p.seatsBooked,
        selectedPickup: p.selectedPickup,
        status: p.status,
        joinedAt: p.joinedAt,
      })),
    },

    tracking: {
      tripStarted: tracking.tripStarted,
      tripEnded: tracking.tripEnded,
      currentCheckpointIndex: tracking.currentCheckpointIndex,

      checkpoints: tracking.checkpoints.map(cp => ({
        type: cp.type,
        location: cp.location,
        completed: cp.completed,
        completedAt: cp.completedAt,

        passengers: cp.passengers.map(p => ({
          user: {
            _id: p.user._id,
            name: p.user.name,
            email: p.user.email,
            phone: p.user.phone,
            avatar: p.user.avatar,
          },
          verified: p.verified,
          verifiedAt: p.verifiedAt,
        })),
      })),
    },
  },
});

  } catch (error) {

    console.error("Trip tracking fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};


// POST /trip/start/:tripId

const startTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;
    const io = req.app.get("io");   

    const trip = await Trip.findById(tripId)
      .populate("driver", "name email phone avatar rating")
      .populate("joinedPassengers.user", "name email phone avatar");

    const tracking = await TripTracking.findOne({ trip: tripId })
      .populate("checkpoints.passengers.user", "name email phone avatar");

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Tracking not found",
      });
    }

    // UPDATE
    tracking.tripStarted = true;
    tracking.currentCheckpointIndex = 0;

    await tracking.save();

    const host = trip.driver._id.toString() === userId;

    // 🔥 CREATE SAME STRUCTURE AS API RESPONSE
    const responseData = {
      host,
      trip,
      tracking,
    };

    // 🔥 SOCKET EMIT (IMPORTANT)
    io.to(tripId).emit("tracking_update", responseData);

    res.json({
      success: true,
      data: responseData,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};


module.exports = {
  sheareTrip,
  getTrips,
  joinRequest,
  markNotificationRead,
  getJoinRequestById,
  getNotifications,
  updateJoinRequest,
  addUserInTrip,
  removeUserFromTrip,
  getMyTrips,
  getTripTracking,
  startTrip,
};