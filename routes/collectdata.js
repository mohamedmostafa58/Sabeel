const express = require("express");
const {
    saveMemorizationData
} = require("../controllers/collectdata");
const router = express.Router();
router.route("/").post(saveMemorizationData);
module.exports = router;