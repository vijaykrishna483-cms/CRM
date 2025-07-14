import { pool } from "../../libs/database.js";
import jwt from 'jsonwebtoken'
// Add a new leave request
export const addLeaveRequest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employeeId = decoded.employee_id;

    if (!employeeId) {
      return res.status(400).json({ message: "Not Logged in" });
    }

    const { date_of_leave, reason, comment } = req.body;
    if (!date_of_leave || !reason) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const result = await pool.query(
      `INSERT INTO leave_requests (employee_id, date_of_leave, reason, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [employeeId, date_of_leave, reason, comment || null]
    );

    res.status(201).json({ message: "Leave request submitted.", leave_request: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Failed to add leave request.", error: error.message });
  }
};



// Delete a leave request by ID
export const deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM leave_requests WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Leave request not found." });
    }
    res.status(200).json({ message: "Leave request deleted.", deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete leave request.", error: error.message });
  }
};





// Edit/update a leave request by ID
export const editLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_of_leave, reason, comment, status, status_updater } = req.body;

    // Build dynamic update query based on provided fields
    const fields = [];
    const values = [];
    let idx = 1;

    if (date_of_leave) { fields.push(`date_of_leave = $${idx++}`); values.push(date_of_leave); }
    if (reason)        { fields.push(`reason = $${idx++}`); values.push(reason); }
    if (comment !== undefined) { fields.push(`comment = $${idx++}`); values.push(comment); }
    if (status)        { fields.push(`status = $${idx++}`); values.push(status); }
    if (status_updater){ fields.push(`status_updater = $${idx++}`); values.push(status_updater); }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE leave_requests SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Leave request not found." });
    }
    res.status(200).json({ message: "Leave request updated.", leave_request: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Failed to update leave request.", error: error.message });
  }
};

// Get all leave requests for a specific employee
export const getLeaveRequestsByEmployee = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employeeId = decoded.employee_id;
            if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }
    const result = await pool.query(
      `SELECT * FROM leave_requests WHERE employee_id = $1 ORDER BY date_of_leave DESC`,
      [employeeId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave requests.", error: error.message });
  }
};


// Get all leave requests (for admin/HR)
export const getAllLeaveRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM leave_requests ORDER BY submitted_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave requests.", error: error.message });
  }
};
