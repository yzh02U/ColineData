const express = require("express");

const { getToken, login } = require("../Controllers/EwelinkController.js");
const router = express.Router();

router.post("/getToken", getToken);
router.get("/getCode", login);
module.exports = router;
