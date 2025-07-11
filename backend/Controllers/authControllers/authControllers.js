import { pool } from "../../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../../libs/index.js";

import { sendMail } from "../../Controllers/Gmail/sendMail.js"; // adjust path if different


export const signupUser = async (req, res) => {
  try {
    const { name, email, password, vertical_id, position_id, employee_id } = req.body;

    if (!(name && email && password && vertical_id && position_id && employee_id)) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    const userExist = await pool.query({
      text: "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)",
      values: [email],
    });

    if (userExist.rows[0].exists) {
      return res.status(409).json({ status: "failed", message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const userResult = await pool.query({
      text: "INSERT INTO users (name, email, password, vertical_id, position_id, employee_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      values: [name, email, hashedPassword, vertical_id, position_id, employee_id],
    });

    const user = userResult.rows[0];
    delete user.password;

    // Send welcome email
    // await sendMail({
    //   to: email,
    //   subject: "Welcome to Smart CRM - Your Account is Activated",
    //   html: `
    //     <h2>Hi ${name},</h2>
    //     <p>Your Smart CRM account has been successfully created.</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Temporary Password:</strong> ${password}</p>
    //     <p><strong>Employee ID:</strong> ${employee_id}</p>
    //     <p><strong>Vertical ID:</strong> ${vertical_id}</p>
    //     <p><strong>Position ID:</strong> ${position_id}</p>
    //     <br/>
    //     <p>You can now log in and start using Smart CRM.</p>
    //     <p>Click <a href="https://yourdomain.com/login">here</a> to login.</p>
    //     <br/>
    //     <p>Regards,</p>
    //     <p>Smart CRM Team</p>
    //   `
    // });

    res.status(201).json({
      status: "success",
      message: "Account created successfully. Email sent.",
      data: user
    });
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
      position_id: user.position_id,
      employee_id:user.employee_id
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



export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        status: "failed",
        message: "Email is required to delete a user"
      });
    }

    // Check if user exists
    const userCheck = await pool.query({
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email]
    });

    if (userCheck.rowCount === 0) {
      return res.status(404).json({
        status: "failed",
        message: "User not found"
      });
    }

    // Delete the user
    await pool.query({
      text: 'DELETE FROM users WHERE email = $1',
      values: [email]
    });

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding the password field for security
    const result = await pool.query(
      "SELECT id, name, email, vertical_id, position_id, employee_id FROM users"
    );

    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: result.rows
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      status: "failed",
      message: error.message
    });
  }
};





