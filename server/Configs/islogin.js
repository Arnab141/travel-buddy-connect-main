const jwt = require("jsonwebtoken");
const User = require("../Models/usermodel");

const isLogin = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // ✅ If token comes like: "Bearer xxxxx"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // ✅ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded will contain: { id: "userid", iat, exp }
    req.userId = decoded.id;

    // (optional) full user fetch
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

module.exports = isLogin;
