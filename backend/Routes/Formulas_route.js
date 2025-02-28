const express = require("express");

const { getTimeOnSwitch } = require("../Controllers/FormulasController.js");
const router = express.Router();

router.get("/getTimeOnSwitch", getTimeOnSwitch);

module.exports = router;
