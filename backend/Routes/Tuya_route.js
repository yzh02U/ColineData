const express = require("express");

const {
  getToken,
  refreshToken,
  getDeviceInfo,
} = require("../Controllers/TuyaController.js");
const router = express.Router();

router.get("/getToken", getToken);
router.get("/refreshToken", refreshToken);
router.get("/getDeviceInfo", getDeviceInfo);

module.exports = router;
