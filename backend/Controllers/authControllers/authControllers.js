import { pool } from "../../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../../libs/index.js";



export const signupUser = async (req, res) => {
    try {
        const { name, email, password, vertical_id, position_id } = req.body;
        if (!(name && email && password && vertical_id && position_id)) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const userExist = await pool.query({
            text: 'SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)',
            values: [email]
        });

        if (userExist.rows[0].exists) {
            return res.status(409).json({ status: "failed", message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);
        const userResult = await pool.query({
            text: 'INSERT INTO users (name, email, password, vertical_id, position_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            values: [name, email, hashedPassword, vertical_id, position_id]
        });

        const user = userResult.rows[0];
        delete user.password; // remove password from response
        res.status(201).json({ status: "success", message: "Account created successfully", data: user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};



export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Email and password are required"
      });
    }

    const result = await pool.query({
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email]
    });

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "failed",
        message: "User not found"
      });
    }

    // ✅ Declare user only after the null check
    const user = result.rows[0];

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid credentials"
      });
    }

    const token = createJWT({
      id: user.id,
      vertical_id: user.vertical_id,
      position_id: user.position_id
    });

    delete user.password;

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};







