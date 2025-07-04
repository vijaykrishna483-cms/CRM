// Your database connection module
import dayjs from 'dayjs';
import { pool } from '../../libs/database.js';

// Record attendance (clock in/out)
export const recordAttendance = async (req, res) => {
  try {
    const { employee_id, type } = req.body;
    if (!employee_id || !['in', 'out'].includes(type)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const today = dayjs().format('YYYY-MM-DD');
    // Check if record exists for today
    const [rows] = await pool.query(
      'SELECT * FROM attendance_records WHERE employee_id = ? AND date = ?',
      [employee_id, today]
    );
    if (type === 'in') {
      if (rows.length === 0) {
        await pool.query(
          'INSERT INTO attendance_records (employee_id, date, in_time) VALUES (?, ?, ?)',
          [employee_id, today, dayjs().format('YYYY-MM-DD HH:mm:ss')]
        );
        return res.json({ message: 'Clock-in recorded' });
      } else {
        return res.status(400).json({ error: 'Already clocked in today' });
      }
    } else if (type === 'out') {
      if (rows.length === 0) {
        return res.status(400).json({ error: 'No clock-in found for today' });
      }
      await pool.query(
        'UPDATE attendance_records SET out_time = ? WHERE id = ?',
        [dayjs().format('YYYY-MM-DD HH:mm:ss'), rows[0].id]
      );
      return res.json({ message: 'Clock-out recorded' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get attendance for one employee (by month)
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { month } = req.query; // format: YYYY-MM
    if (!employee_id || !month) {
      return res.status(400).json({ error: 'Missing employee_id or month' });
    }
    const [rows] = await pool.query(
      `SELECT * FROM attendance_records WHERE employee_id = ? AND DATE_FORMAT(date, '%Y-%m') = ? ORDER BY date ASC`,
      [employee_id, month]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all employees' attendance (by month)
export const getAllAttendance = async (req, res) => {
  try {
    const { month } = req.query; // format: YYYY-MM
    if (!month) {
      return res.status(400).json({ error: 'Missing month' });
    }
    const [rows] = await pool.query(
      `SELECT ar.*, e.employee_name FROM attendance_records ar
       JOIN employees e ON ar.employee_id = e.employee_id
       WHERE DATE_FORMAT(ar.date, '%Y-%m') = ?
       ORDER BY ar.date ASC, ar.employee_id ASC`,
      [month]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an attendance record (HR only)
export const updateAttendance = async (req, res) => {
  try {
    const { record_id } = req.params;
    const { in_time, out_time } = req.body;
    if (!in_time && !out_time) {
      return res.status(400).json({ error: 'Nothing to update' });
    }
    const fields = [];
    const values = [];
    if (in_time) {
      fields.push('in_time = ?');
      values.push(in_time);
    }
    if (out_time) {
      fields.push('out_time = ?');
      values.push(out_time);
    }
    values.push(record_id);
    await pool.query(
      `UPDATE attendance_records SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
    res.json({ message: 'Attendance record updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete an attendance record (HR only)
export const deleteAttendance = async (req, res) => {
  try {
    const { record_id } = req.params;
    await pool.query('DELETE FROM attendance_records WHERE id = ?', [record_id]);
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
