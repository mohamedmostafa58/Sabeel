const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const uploadDir = "./uploads/";
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const storage_video = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body);
    const folderName = req.body.folderName || "default";
    const folderPath = path.join(uploadDir, folderName);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload_video = multer({ storage: storage_video });
const videoFunction =async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded." });
    }
    const authToken = req.headers.authorization?.split(' ')[1]; // Extract token from header
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.verified = "pending";
    await user.save();
    console.log(`${req.file.filename} saved correctly`);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving video:", error);
    res.status(500).json({ error: "Video could not be saved." });
  }
};
module.exports = { upload_video, videoFunction };
