const express = require("express");
const Attendance = require("../models/Attendance");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Failed to create attendance" });
  }
});

module.exports = router;