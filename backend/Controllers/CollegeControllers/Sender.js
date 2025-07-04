import { pool } from "../../libs/database.js";

/**
 * Add a new proposal file and return the inserted row
 * POST /api/proposal-files
 */
export const addProposalUpload = async (req, res) => {
  try {
    const { proposal_id, zip_file_link, poc_red_email } = req.body;

    // Validate input
    if (![proposal_id, zip_file_link, poc_red_email].every(val => val && val.trim())) {
      return res.status(400).json({ error: "All fields are required and must not be empty." });
    }

    // Insert into DB and return the row
    const result = await pool.query(
      `INSERT INTO proposal_files (proposal_id, zip_file_link, poc_red_email)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [proposal_id, zip_file_link, poc_red_email]
    );
    // Log and return the inserted row
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/**
 * Get all proposal files
 * GET /api/proposal-files
 */
export const getAllProposalUploads = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM proposal_files ORDER BY uploaded_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
