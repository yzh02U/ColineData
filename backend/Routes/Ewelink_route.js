const express = require("express");

const {
  getCode,
  updateStatusofDevice,
} = require("../Controllers/EwelinkController.js");
const router = express.Router();

router.get("/getCode", getCode);
router.post("/updateStatusofDevice", updateStatusofDevice);
module.exports = router;
