const express = require("express");
const {
  register,
  login,
  verifyuser,
  getUserByToken,
} = require("../controllers/sheikh");
const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user").get(getUserByToken);
module.exports = router;
