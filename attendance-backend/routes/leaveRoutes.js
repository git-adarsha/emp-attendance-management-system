const express = require("express");
const Leave = require("../models/Leave");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave requests" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Failed to create leave request" });
  }
});

router.put("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: "Failed to approve leave request" });
  }
});

router.put("/:id/reject", protect, adminOnly, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: "Failed to reject leave request" });
  }
});

module.exports = router;