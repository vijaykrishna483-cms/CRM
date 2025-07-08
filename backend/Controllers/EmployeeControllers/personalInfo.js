import { pool } from "../../libs/database.js";


// controllers/employeeController.js


// controllers/employeeController.js
export async function addEmployee(req, res) {
  try {
    const {
      employee_id,
      employee_name,
      designation,
      position,
      aadhar_number,
      pan_id,
      personal_contact,
      address_line1,
      address_line2,
      address_line3,
      office_contact,
      personal_email,
      office_email,
      location,
      salary
    } = req.body;

const query = `
  INSERT INTO employees (
    employee_id, employee_name, designation,
    aadhar_number, pan_id, personal_contact, address_line1,
    address_line2, address_line3, office_contact, personal_email, office_email, salary, position,location
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
  RETURNING id
`;


    const result = await pool.query(query, [
      employee_id, employee_name, designation,
      aadhar_number, pan_id, personal_contact, address_line1,
      address_line2, address_line3, office_contact, personal_email, office_email, salary, position,location
    ]);

    res.status(201).json({
      message: 'Employee added successfully',
      id: result.rows[0].id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const fields = req.body;

    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(fields);

    const query = `UPDATE employees SET ${setClause} WHERE id = $${values.length + 1}`;

    await pool.query(query, [...values, id]);

    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// controllers/employeeController.js (continue in the same file)

export async function getAllEmployees(req, res) {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

