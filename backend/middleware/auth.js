const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const authenticationMid = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    res.status(500).json({
      message: "Erişim için lütfen giriş yapınız",
    });
  }

  const decodedData = jwt.verify(token, "secret-token");

  if (!decodedData) {
    res.status(500).json({
      message: "Erişim tokeniniz geçersiz",
    });
  }

  req.user = await User.findById(decodedData.id);

  next();
};

const roleChecked = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(500).json({
        message: "Bu işlem için yetkiniz yok",
      });
    }
    next();
  };
};

module.exports = {
  authenticationMid,
  roleChecked,
};
