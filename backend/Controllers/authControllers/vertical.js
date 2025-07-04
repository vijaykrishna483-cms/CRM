// controllers/verticalsController.js
import { pool } from "../../libs/database.js";

// Add vertical
export const addVertical = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO verticals (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};

// Delete vertical
export const deleteVertical = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM verticals WHERE id = $1', [id]);
    res.status(200).json({ status: "success", message: "Vertical deleted" });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};

// View all verticals
export const getAllVerticals = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM verticals');
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};
