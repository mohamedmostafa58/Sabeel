const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
// Fetch all users (admin only)
const getusers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
//verify users
const verifyuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the user
    user.verified = "verified";
    await user.save();

    // Check if the user was referred by someone
    if (user.referredBy) {
      const referringUser = await User.findById(user.referredBy);
      if (referringUser) {
        referringUser.wallet += 1; // Increase the referring user's wallet by 1 dollar
        await referringUser.save();
      }
    }

    res.status(200).json({
      _id: user._id,
      verified: user.verified,
      message: "User verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify user" });
  }
};

const register = async (req, res, next) => {
  const { username, email, password, referralCode } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    return next(new Error("Please provide username, email and password"));
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    return next(new Error("User already exists"));
  }

  try {
    const referralLink = crypto.randomBytes(8).toString("hex");
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralLink: referralCode });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    const user = await User.create({
      username,
      email,
      password,
      referralLink,
      referredBy,
    });

    generateToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error("Please provide email and password"));
  }

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(400);
    return next(new Error("User does not exists"));
  }

  try {
    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      res.status(400);
      return next(new Error("User password does not match"));
    }

    generateToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    return next(new Error("Please provide email"));
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    return next(new Error("User does not exist"));
  }

  try {
    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
    </head>
    <body>
        <h1>You have requested a password reset</h1>
        <p>Please go to this link to reset your password:</p>
        <p>
          <a href="${resetUrl}" style="text-decoration: none; color: blue;">Reset Password</a>
        </p>
    </body>
    </html>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });
      return res.status(200).json({
        success: true,
        message: "Email was sent!",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      res.status(500);
      return next(new Error("Email could not be sent"));
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    res.status(400);
    return next(new Error("Please provide new password"));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      return next(new Error("Invalid Reset Token"));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      message: "Password Reset Success",
    });
  } catch (error) {
    next(error);
  }
};
const getUserByToken = async (req, res, next) => {
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
      const user = await User.findById(decoded.id);
      generateToken(user, 200, res);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
const generateToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  return res.status(statusCode).json({
    success: true,
    token,
    user: {
      username: user.username,
      email: user.email,
      referralLink: user.referralLink,
      wallet: user.wallet,
      verified: user.verified,
      role: user.role,
    },
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getusers,
  verifyuser,
  getUserByToken,
};
