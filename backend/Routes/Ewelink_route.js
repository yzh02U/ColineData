const express = require("express");

const {
  getToken,
  getCode,
  updateStatusofDevice,
} = require("../Controllers/EwelinkController.js");
const router = express.Router();

router.get("/getToken", getToken);
router.get("/getCode", getCode);
router.post("/updateStatusofDevice", updateStatusofDevice);
module.exports = router;
