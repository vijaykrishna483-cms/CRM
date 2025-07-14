import { pool } from "../../libs/database.js";
import jwt from 'jsonwebtoken'
// ✅ 1. Check-in (with location)
export const checkIn = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employeeId = decoded.employee_id;

    const { latitude, longitude } = req.body;

    const existing = await pool.query(
      "SELECT * FROM attendance WHERE employee_id = $1 AND attendance_date = CURRENT_DATE",
      [employeeId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "You have already checked in today." });
    }

    await pool.query(
      `INSERT INTO attendance (employee_id, latitude, longitude)
       VALUES ($1, $2, $3)`,
      [employeeId, latitude, longitude]
    );

    res.status(201).json({ message: "Check-in successful." });
  } catch (error) {
    res.status(500).json({ message: "Check-in failed.", error: error.message });
  }
};

// ✅ 2. Check-out
export const checkOut = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employeeId = decoded.employee_id;

    const today = await pool.query(
      "SELECT * FROM attendance WHERE employee_id = $1 AND attendance_date = CURRENT_DATE",
      [employeeId]
    );

    if (today.rows.length === 0) {
      return res.status(404).json({ message: "No check-in found for today" });
    }

    if (today.rows[0].check_out) {
      return res.status(400).json({ message: "Already checked out" });
    }

    await pool.query(
      "UPDATE attendance SET check_out = CURRENT_TIMESTAMP WHERE id = $1",
      [today.rows[0].id]
    );

    res.status(200).json({ message: "Checked out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Check-out failed", error: error.message });
  }
};

export const launchIn = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employeeId = decoded.employee_id;

    const today = await pool.query(
      "SELECT * FROM attendance WHERE employee_id = $1 AND attendance_date = CURRENT_DATE",
      [employeeId]
    );

    if (today.rows.length === 0) {
      return res.status(404).json({ message: "No check-in found for today. Please check-in first." });
    }

    if (today.rows[0].lunch_in) {
      return res.status(400).json({ message: "Already marked lunch-in today." });
    }

    await pool.query(
      "UPDATE attendance SET lunch_in = CURRENT_TIMESTAMP WHERE id = $1",
      [today.rows[0].id]
    );

    res.status(200).json({ message: "Lunch-in marked successfully." });
  } catch (error) {
    res.status(500).json({ message: "Lunch-in failed", error: error.message });
  }
};

export const launchOut = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employeeId = decoded.employee_id;

    const today = await pool.query(
      "SELECT * FROM attendance WHERE employee_id = $1 AND attendance_date = CURRENT_DATE",
      [employeeId]
    );

    if (today.rows.length === 0) {
      return res.status(404).json({ message: "No check-in found for today. Please check-in first." });
    }

    if (!today.rows[0].lunch_in) {
      return res.status(400).json({ message: "You need to mark lunch-in before lunch-out." });
    }

    if (today.rows[0].lunch_out) {
      return res.status(400).json({ message: "Already marked lunch-out today." });
    }

    await pool.query(
      "UPDATE attendance SET lunch_out = CURRENT_TIMESTAMP WHERE id = $1",
      [today.rows[0].id]
    );

    res.status(200).json({ message: "Lunch-out marked successfully." });
  } catch (error) {
    res.status(500).json({ message: "Lunch-out failed", error: error.message });
  }
};

// ✅ 3. HR: Update validity of a record
export const updateAttendanceValidity = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_valid, remarks } = req.body;

    await pool.query(
      "UPDATE attendance SET is_valid = $1, remarks = $2 WHERE id = $3",
      [is_valid, remarks, id]
    );

    res.status(200).json({ message: "Attendance record updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update record", error: error.message });
  }
};



// ✅ 4. Get all records for a specific date (HR View)
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const result = await pool.query(
      `SELECT a.*, u.name FROM attendance a
       JOIN users u ON u.employee_id = a.employee_id
       WHERE a.attendance_date = $1
       ORDER BY a.check_in ASC`,
      [date]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records", error: error.message });
  }
};


export const getMonthlyDailyRecords = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee_id = decoded.employee_id;

    const { month } = req.query; // Expected format: 'YYYY-MM'

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    // Construct the first day of the month for comparison
    const monthStart = `${month}-01`;

    const result = await pool.query(
      `
      SELECT 
        id,
        attendance_date,
        TO_CHAR(check_in, 'HH24:MI') AS check_in,
        TO_CHAR(lunch_in, 'HH24:MI') AS lunch_in,
        TO_CHAR(lunch_out, 'HH24:MI') AS lunch_out,
        TO_CHAR(check_out, 'HH24:MI') AS check_out,
        is_valid,
        remarks
      FROM attendance
      WHERE employee_id = $1
        AND DATE_TRUNC('month', attendance_date) = DATE_TRUNC('month', TO_DATE($2, 'YYYY-MM-DD'))
      ORDER BY attendance_date
      `,
      [employee_id, monthStart]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch records", error: error.message });
  }
};



// ✅ 5. HR: Get all employees' attendance for a given month
export const getAllEmployeesMonthlyAttendance = async (req, res) => {
  try {
    const { month } = req.query; // Expected format: 'YYYY-MM'
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }
    // Construct the first day of the month for comparison
    const monthStart = `${month}-01`;

    const result = await pool.query(
      `
      SELECT 
        a.id,
        a.employee_id,
        u.name,
        a.attendance_date,
        TO_CHAR(a.check_in, 'HH24:MI') AS check_in,
        TO_CHAR(a.lunch_in, 'HH24:MI') AS lunch_in,
        TO_CHAR(a.lunch_out, 'HH24:MI') AS lunch_out,
        TO_CHAR(a.check_out, 'HH24:MI') AS check_out,
        a.is_valid,
        a.remarks
      FROM attendance a
      JOIN users u ON u.employee_id = a.employee_id
      WHERE DATE_TRUNC('month', a.attendance_date) = DATE_TRUNC('month', TO_DATE($1, 'YYYY-MM-DD'))
      ORDER BY a.attendance_date, u.name
      `,
      [monthStart]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch monthly attendance", error: error.message });
  }
};
