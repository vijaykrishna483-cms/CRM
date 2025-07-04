import { pool } from "../../libs/database.js";


export const addRoleAccess = async (req, res) => {
  const { vertical_id, position_id, page_id } = req.body;

  if (!vertical_id || !position_id || !page_id) {
    return res.status(400).json({
      status: "failed",
      message: "All fields (vertical_id, position_id, page_id) are required"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO role_access (vertical_id, position_id, page_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (vertical_id, position_id, page_id) DO NOTHING
       RETURNING *`,
      [vertical_id, position_id, page_id]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({
        status: "failed",
        message: "This role access already exists"
      });
    }

    res.status(201).json({
      status: "success",
      message: "Access granted",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Add role access error:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// ✅ Get all role access entries (with join info)
export const getAllRoleAccess = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ra.id,
        v.name AS vertical_name,
        p.name AS position_name,
        pg.name AS page_name,
        pg.route,
        pg.component
      FROM role_access ra
      JOIN verticals v ON ra.vertical_id = v.id
      JOIN positions p ON ra.position_id = p.id
      JOIN pages pg ON ra.page_id = pg.id
      ORDER BY ra.id ASC
    `);

    res.status(200).json({
      status: "success",
      data: result.rows
    });

  } catch (error) {
    console.error("Get all role access error:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};


// ✅ Delete role access by ID
export const deleteRoleAccess = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: "failed",
      message: "A valid role access ID is required"
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM role_access WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No role access entry found with the given ID"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Role access entry deleted successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Delete role access error:", error);
    res.status(500).json({
      status: "failed",
      message: "Internal server error"
    });
  }
};
