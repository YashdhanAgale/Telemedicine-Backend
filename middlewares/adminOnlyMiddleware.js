const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor"); // you can rename this to Admin if you create a separate model

const adminOnlyMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Doctor.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.email !== "admin@example.com") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    // Passed all checks
    next();
  } catch (err) {
    console.error("Admin auth failed:", err.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = adminOnlyMiddleware;
