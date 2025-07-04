// controllers/positionsController.js
import { pool } from "../../libs/database.js";

// Add position
export const addPosition = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO positions (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};

// Delete position
export const deletePosition = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM positions WHERE id = $1', [id]);
    res.status(200).json({ status: "success", message: "Position deleted" });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};

// View all positions
export const getAllPositions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM positions');
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};
