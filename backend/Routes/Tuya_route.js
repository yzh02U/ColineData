const express = require("express");

const { getDeviceInfo } = require("../Controllers/TuyaController.js");
const router = express.Router();

router.get("/getDeviceInfo", getDeviceInfo);

module.exports = router;
