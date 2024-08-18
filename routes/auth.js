const express = require("express");
const { protect, admin } = require("../middlewares/auth");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getusers,
  verifyuser,
  getUserByToken,
} = require("../controllers/auth");
const multer = require("multer");
const uploadFilesFunction = require("../controllers/fileUpload");
const router = express.Router();
const storageVerify = multer.memoryStorage();
const uploadVerify = multer({ storage: storageVerify });
const frontDetect = require("../controllers/front");
const leftDetect = require("../controllers/left");
const rightDetect = require("../controllers/right");
const { upload_video, videoFunction } = require("../controllers/videoUpload");
const support = require("../controllers/support");
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:resetToken").put(resetPassword);
router.route("/users").get(protect, admin, getusers);
router.route("/users/:id/verify").put(protect, admin, verifyuser);
router.route("/user").get(getUserByToken);
router.route("/upload/:id").post(uploadFilesFunction);
router.route("/support").post(support)
router.post("/save-video", upload_video.single("video"), videoFunction);
router.post("/detect-faces/0", uploadVerify.single("image"), frontDetect);
router.post("/detect-faces/1", uploadVerify.single("image"), rightDetect);
router.post("/detect-faces/2", uploadVerify.single("image"), leftDetect);

module.exports = router;
