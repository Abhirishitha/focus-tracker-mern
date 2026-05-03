require("dotenv").config();
console.log("🔥 Backend running");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Session = require("./models/Session");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
mongoose.connect(
  "mongodb+srv://admin:Abhi1289@cluster0.xwdizz.mongodb.net/focus-tracker?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/* ================= EMAIL ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ================= OTP STORE ================= */
let otpStore = {}; // simple memory store

/* ================= SEND OTP ================= */
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = otp;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`
    });

    console.log("OTP SENT:", otp);

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================= VERIFY OTP ================= */
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email].toString() === otp.toString()) {
    delete otpStore[email];
    return res.json({ message: "OTP verified" });
  }

  res.status(400).json({ message: "Invalid OTP" });
});
/* ================= TRACK ================= */
app.post("/track", async (req, res) => {
  try {
    const { url, timeSpent, userId } = req.body;

    console.log("Saving:", url);

    await new Session({ url, timeSpent, userId }).save();

    res.send("Saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

/* ================= DATA ================= */
app.get("/data", async (req, res) => {
  const data = await Session.find({ userId: req.query.userId });
  res.json(data);
});

/* ================= SIGNUP ================= */
app.post("/signup", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    password: hashed
  });

  await user.save();

  res.json({ message: "User created" });
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) return res.status(400).send("Wrong password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, userId: user._id });
});

/* ================= USER ================= */
app.get("/user", async (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.json(user);
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
});


/* ================= SETUP ================= */
app.post("/setup", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { purpose, distracting, productive } = req.body;

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.preferences = {
      purpose,
      distracting,
      productive
    };

    user.setupDone = true;

    await user.save();

    res.json({ message: "Setup saved" });

  } catch (err) {
    console.error("SETUP ERROR:", err);
    res.status(500).json({ message: "Setup failed" });
  }
});
/* ================= SERVER ================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});