const jwt = require("jsonwebtoken");
const Sheikh = require("../models/Sheikh");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.shikh = await Sheikh.findById(decoded.id);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};
const admin = async (req, res, next) => {
  try {
    // Find the user by ID from the database
    const sheikh = await Sheikh.findById(req.Sheikh.id);

    // Check if the user exists and if the role is admin
    if (sheikh && sheikh.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Not authorized as admin" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, could not verify admin status" });
  }
};
module.exports = { protect, admin };
