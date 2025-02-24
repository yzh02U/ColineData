const express = require("express");

const {
  login,
  createUser,
  deleteUser,
} = require("../Controllers/LoginController.js");
const router = express.Router();

router.post("/login", login);
router.post("/createUser", createUser);
router.delete("/deleteUser", deleteUser);

module.exports = router;
