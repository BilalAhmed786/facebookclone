const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userverify = require("../middleware/verifyuser");
const sendEmail = require('../utils/sendEmail');
const getResetEmailTemplate = require('../utils/emailTemplate');
const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  const { name, email, password, retypepassword } = req.body;

  if (!name || !email || !password || !retypepassword) {
    return res.status(400).json("All fields requried");
  }

  if (password !== retypepassword) {
    return res.status(400).json("Mismatch passwords");
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json("User already exists");
    }

    user = new User({ name, email, password, retypepassword });

    await user.save();

    const payload = { userId: user.id };

    const token = jwt.sign(payload, process.env.TOKEN_SEC, { expiresIn: "1h" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000,
    });

    return res.json("register successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json("Email is required");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json("If that email exists, a password reset link has been sent.");
    }

    // Generate token & reset link
    const secret = process.env.TOKEN_SEC + user.password;
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      secret,
      { expiresIn: '5m' }
    );
    const resetLink = `${process.env.CLIENT_URL}/resetpassword/${user._id}/${resetToken}`;

    // Send Email using the modular function
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: getResetEmailTemplate(user.name, resetLink),
    });

    return res.status(200).json("Password reset link sent to your email.");
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json("Server error while sending email");
  }
});

// 2. RESET PASSWORD API
router.post('/resetpassword/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json("All fields are required");
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json("Passwords do not match");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json("Invalid link or user does not exist");
    }

    // Verify token with the user-specific secret
    const secret = process.env.TOKEN_SEC + user.password;
    
    try {
      jwt.verify(token, secret);
    } catch (tokenErr) {
      return res.status(400).json("Invalid or expired password reset link");
    }

    // Update password (pre-save middleware will automatically hash it)
    user.password = newPassword;
    await user.save();

    return res.status(200).json("Password reset successfully");
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});
//for procted routes

router.get("/userinfo", userverify, async (req, res) => {
  try {
    const userinfo = await User.findById(req.user.userId, {
      password: 0,
      retypepassword: 0,
    });

    return res.json(userinfo);
  } catch (error) {
    console.log(error);
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("All fileds required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid credentials");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }

    const payload = { userId: user.id };

    const token = jwt.sign(payload, process.env.TOKEN_SEC, { expiresIn: "1h" });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000,
    });

    return res.json("login success");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// logout user
router.post("/logout", (req, res) => {
  try {
    // Clear the auth token cookie
   res.clearCookie('auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
});

 // Respond with a success message
    return res.status(200).json("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ msg: "Server error during logout" });
  }
});

module.exports = router;
