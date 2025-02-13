const express = require("express");

const { getToken } = require("../Controllers/TuyaController.js");
const router = express.Router();

router.post("/getToken", getToken);

module.exports = router;
