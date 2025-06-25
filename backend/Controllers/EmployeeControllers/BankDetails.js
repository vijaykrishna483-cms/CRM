// controllers/bankController.js
import { pool } from "../../libs/database.js";


export async function addBankDetails(req, res) {
  try {
    const {
      employee_id,
      bank_account_number,
      bank_name,
      branch_name,
      branch_ifsc,
      mmid,
      vpa
    } = req.body;

    // 1. Fetch employee_name from employees table
    const employeeResult = await pool.query(
      'SELECT employee_name FROM employees WHERE employee_id = $1',
      [employee_id]
    );

    if (employeeResult.rowCount === 0) {
      return res.status(404).json({ error: 'Employee ID not found' });
    }

    const employee_name = employeeResult.rows[0].employee_name;

    // 2. Insert into employee_bank_details
    const insertQuery = `
      INSERT INTO employee_bank_details (
        employee_id, employee_name, bank_account_number,
        bank_name, branch_name, branch_ifsc, mmid, vpa
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
    `;

    const result = await pool.query(insertQuery, [
      employee_id,
      employee_name,
      bank_account_number,
      bank_name,
      branch_name,
      branch_ifsc,
      mmid,
      vpa
    ]);

    res.status(201).json({
      message: 'Bank details added successfully',
      id: result.rows[0].id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updateBankDetails(req, res) {
  try {
    const { id } = req.params;
    const fields = req.body;

    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(fields);
    const query = `UPDATE employee_bank_details SET ${setClause} WHERE id = $${values.length + 1}`;

    await pool.query(query, [...values, id]);
    res.json({ message: 'Bank details updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteBankDetails(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employee_bank_details WHERE id = $1', [id]);
    res.json({ message: 'Bank details deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllBankDetails(req, res) {
  try {
    const result = await pool.query('SELECT * FROM employee_bank_details ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
