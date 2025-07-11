import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { checkIn, checkOut, getAttendanceByDate, getMonthlyDailyRecords, updateAttendanceValidity } from "../Controllers/attendanceController/attendanceController.js";

const router = express.Router();

// Employee routes
router.post("/checkin", authenticateToken, checkIn);
router.post("/checkout", authenticateToken,checkOut);




// HR: mark valid/invalid
router.patch("/:id", authenticateToken, updateAttendanceValidity);

// HR or self: fetch attendance records
router.get("/", authenticateToken, getAttendanceByDate);
router.get("/summary", authenticateToken, getMonthlyDailyRecords);

export default router;
