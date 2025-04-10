const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
  const avatar = await cloudinary.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 120,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(500).json({
      message: "Bu emaili ait kullanıcı zaten var",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (password.length < 6) {
    return res.status(500).json({
      message: "Şifreniz 6 karakterden büyük olmalı",
    });
  }

  const newUser = await User.create({
    email,
    name,
    password: passwordHash,
    avatar: {
      public_id: avatar.public_id,
      url: avatar.secure_url,
    },
  });

  const token = jwt.sign({ id: newUser._id }, "secret-token", {
    expiresIn: "1h",
  });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  };

  res.status(201).cookie("token", token, cookieOptions).json({
    newUser,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(500).json({
      message: "Bu emaile kayıtlı bir kullanucı bulunamadı",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return res.status(500).json({
      message: "Şifre yanlış girildis",
    });
  }

  const token = jwt.sign({ id: user._id }, "secret-token", {
    expiresIn: "1h",
  });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  };

  res.status(200).cookie("token", token, cookieOptions).json({
    user,
    token,
  });
};

const logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now()),
  };
  res.status(200).cookie("token", null, cookieOptions).json({
    message: "Çıkış işlemi başarılı",
  });
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(500).json({
      message: "Bu emaile kayıtlı bir kullanucı bulunamadı",
    });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPassWordExpire = Date.now() + 5 * 10 * 1000;

  await user.save({ validateBeforeSave: false });

  const passwordUrl = ` ${req.protocol}://${register.get(
    "host"
  )}/reset/${resetToken}
  `;

  const message = `Şifreni sıfırlamak için bağlantıyı kullanınız`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      service: "gmail",
      secure: false,
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
      to: req.body.email, // list of receivers
      subject: "Şifre sıfırlama", // Subject line
      text: message, // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    res.status(200).json({
      message: "Şifre sıfırlama maili gönderildi",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPassWordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = User.findOne({
    resetPasswordToken,
    resetPassWordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(500).json({
      message: "Token geçersiz",
    });
  }

  user.password = req.body.password;
  user.exresetPasswordToken = undefined;
  user.resetPassWordExpire = undefined;

  await user.save();

  const token = jwt.sign({ id: user._id }, "secret-token", { expiresIn: "1h" });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  };

  res.status(201).cookie("token", token, cookieOptions).json({
    newUser,
    token,
  });
};

const userDetail = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(500).json({
      message: "Böyle bir kullanıcı bulunamadı",
    });
  }

  res.status(200).json({
    user,
  });
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  userDetail,
};
