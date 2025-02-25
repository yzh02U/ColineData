const express = require("express");

const {
  login,
  createUser,
  deleteUser,
  refreshToken,
} = require("../Controllers/LoginController.js");
const router = express.Router();

router.post("/login", login);
router.post("/createUser", createUser);
router.delete("/deleteUser", deleteUser);
router.get("/refreshToken", refreshToken);

module.exports = router;
