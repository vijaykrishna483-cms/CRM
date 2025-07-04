// controllers/pagesController.js
import { pool } from "../../libs/database.js";

// Add page (route or component)
export const addPage = async (req, res) => {
  const { name, route, component } = req.body;

  // Validate input: name is required, and either route or component must be provided
  if (!name || (!route && !component)) {
    return res.status(400).json({
      status: "failed",
      message: "Name and at least one of route or component is required"
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO pages (name, route, component) VALUES ($1, $2, $3) RETURNING *',
      [name, route || null, component || null]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};

// Delete page by ID
export const deletePage = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT * FROM pages WHERE id = $1', [id]);
    if (check.rowCount === 0) {
      return res.status(404).json({ status: "failed", message: "Page not found" });
    }

    // Delete all role_access records referencing this page
    await pool.query('DELETE FROM role_access WHERE page_id = $1', [id]);

    // Now delete the page
    await pool.query('DELETE FROM pages WHERE id = $1', [id]);

    res.status(200).json({ status: "success", message: "Page deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};


// Get all pages
export const getAllPages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pages ORDER BY id');
    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "failed", message: err.message });
  }
};
