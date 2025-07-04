import JWT from "jsonwebtoken";
import { pool } from "../libs/database.js";


export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verification error:', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};




export const checkPageAccess = async (req, res) => {
  const { vertical_id, position_id } = req.user;
  const { component } = req.body;

  try {
    const pageResult = await pool.query(
      "SELECT * FROM pages WHERE component = $1 LIMIT 1",
      [component]
    );

    const page = pageResult.rows[0];

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    const accessResult = await pool.query(
      "SELECT 1 FROM role_access WHERE vertical_id = $1 AND position_id = $2 AND page_id = $3 LIMIT 1",
      [vertical_id, position_id, page.id]
    );

    if (accessResult.rowCount === 0) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.status(200).json({ allowed: true });
  } catch (err) {
    console.error("Access check error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
