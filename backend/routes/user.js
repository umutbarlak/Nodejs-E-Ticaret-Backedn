const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  userDetail,
  resetPassword,
} = require("../controllers/user");
const { authenticationMid } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/reset/:token", authenticationMid, resetPassword);
router.get("/me", authenticationMid, userDetail);

module.exports = router;
