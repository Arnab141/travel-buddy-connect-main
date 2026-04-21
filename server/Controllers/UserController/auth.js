const User = require("../../Models/usermodel");
const Otp = require("../../Models/otpmodel")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const notemailer = require("nodemailer");
const Trip = require('../../Models/tripmodel')


dotenv.config();


// In real projects: store OTP in DB or Redis


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ✅ LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ---------------- Validation ---------------- */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    /* ---------------- Find User ---------------- */

    const user = await User.findOne({ email: normalizedEmail });

    // Prevent email enumeration
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* ---------------- Check Password ---------------- */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* ---------------- Check Email Verification ---------------- */

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    /* ---------------- Generate Token ---------------- */

    const token = generateToken(user._id);

    /* ---------------- Response ---------------- */

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        gender: user.gender,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, phone, gender } = req.body;

    /* ---------------- Validation ---------------- */

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    /* ---------------- Check Existing User ---------------- */

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    /* ---------------- Hash Password ---------------- */

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* ---------------- Create User ---------------- */

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone?.trim(),
      gender,
      isVerified: true,
    });

    /* ---------------- Generate Token ---------------- */

    const token = generateToken(user._id);

    /* ---------------- Response ---------------- */

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        gender: user.gender,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ GENERATE OTP (for email verification / password reset)
const genarateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("Received OTP generation request for email:", email);


    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    const existingOtp = await Otp.findOne({ email: email.toLowerCase() });

    if (existingOtp) {
      await Otp.deleteOne({ email: email.toLowerCase() });
    }

    if (user) {
      return res.status(409).json({
        message: "Email already registered. Please login.",
        success: false
      });
    }

    // Create 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 5 minutes
    const otpDoc = new Otp({
      email: email.toLowerCase(),
      otp,
      // expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await otpDoc.save();

    const transporter = notemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.toLowerCase(),
      subject: "Your OTP for Travel Buddy Connect",
      html: `
    <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:30px;">
      <div style="max-width:500px; margin:auto; background:white; border-radius:12px; padding:25px; box-shadow:0px 4px 12px rgba(0,0,0,0.1);">
        
        <h2 style="text-align:center; color:#1e293b; margin-bottom:10px;">
          Travel Buddy Connect 🚀
        </h2>

        <p style="color:#334155; font-size:15px;">
          Hello <b>${email.toLowerCase()}</b>,
        </p>

        <p style="color:#334155; font-size:15px;">
          Your One-Time Password (OTP) is:
        </p>

        <div style="text-align:center; margin:25px 0;">
          <span style="
            display:inline-block;
            font-size:28px;
            font-weight:bold;
            letter-spacing:6px;
            color:#0f172a;
            background:#e2e8f0;
            padding:14px 25px;
            border-radius:10px;
          ">
            ${otp}
          </span>
        </div>

        <p style="color:#334155; font-size:14px;">
          ⏳ This OTP is valid for <b>5 minutes</b>.  
          Please do not share it with anyone.
        </p>

        <hr style="margin:20px 0; border:none; border-top:1px solid #e2e8f0;" />

        <p style="font-size:12px; color:#64748b; text-align:center;">
          If you did not request this OTP, please ignore this email.
        </p>
      </div>
    </div>
  `,
    };


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send OTP email", success: false, error: error.message });
      }
      // console.log("Email sent:", info.response);
    });

    res.status(200).json({
      message: "OTP generated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in genarateOTP:", error);
    res.status(500).json({ message: "Server error", error: error.message, success: false });
  }
};

// ✅ VERIFY OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    const savedOtpData = await Otp.findOne({ email: email.toLowerCase() });

    if (!savedOtpData) {
      return res.status(400).json({
        message: "OTP not found. Please generate again.",
        success: false,
      });
    }

    // ✅ Expired check
    // if (Date.now() > savedOtpData.expiresAt) {
    //   await Otp.deleteOne({ email: email.toLowerCase() });
    //   return res.status(400).json({
    //     message: "OTP expired. Please generate again.",
    //     success: false,
    //   });
    // }

    // ✅ Match check (string safe)
    if (String(savedOtpData.otp) !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    // ✅ Verified (delete otp)
    await Otp.deleteOne({ email: email.toLowerCase() });

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .lean(); // ✅ important

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ---------------- Hosted Trips ---------------- */

    const hostedTrips = await Trip.find({ driver: req.userId })
      .select("from to tripDate tripTime basePrice status availableSeats")
      .sort({ tripDate: -1 })
      .lean();

    /* ---------------- Joined Trips ---------------- */

    const joinedTrips = await Trip.find({
      "joinedPassengers.user": req.userId,
    })
      .select("from to tripDate tripTime basePrice status")
      .sort({ tripDate: -1 })
      .lean();

    /* ---------------- Attach To User ---------------- */

    user.hostedTrips = hostedTrips;
    user.joinedTrips = joinedTrips;

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  login,
  register,
  genarateOTP,
  verifyOTP,
  getProfile
};
