const mongoose = require("mongoose");

/* ---------------- Address Subschema ---------------- */

const addressSchema = new mongoose.Schema(
  {
    houseNumber: {
      type: String,
      trim: true,
      default: "",
    },
    street: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    postalCode: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

/* ---------------- User Schema ---------------- */

const userSchema = new mongoose.Schema(
  {
    /* -------- Basic Info -------- */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    address: {
      type: addressSchema,
      default: () => ({}), // ensures object is created
    },

    /* -------- Account Status -------- */

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    /* -------- Reputation -------- */

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);