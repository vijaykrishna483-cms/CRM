import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { addLeaveRequest, deleteLeaveRequest, editLeaveRequest, getAllLeaveRequests, getLeaveRequestsByEmployee } from "../Controllers/attendanceController/LeaveController.js";

const router = express.Router();

// Employee routes
router.post("/request", authenticateToken, addLeaveRequest);


router.delete("/delete/:id", authenticateToken,deleteLeaveRequest);

router.patch("/update/:id", authenticateToken,editLeaveRequest);


router.get("/byId", authenticateToken,getLeaveRequestsByEmployee);


router.get("/all", authenticateToken,getAllLeaveRequests);



export default router;
