import { pool } from "../../libs/database.js";

// 1. Add Trainer Bank Details
export async function addTrainerBankDetails(req, res) {
  const {
    trainer_id,
    bank_account_number,
    bank_name,
    branch_name,
    branch_ifsc,
    mmid,
    vpa
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO trainer_bank_details 
        (trainer_id, bank_account_number, bank_name, branch_name, branch_ifsc, mmid, vpa)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [trainer_id, bank_account_number, bank_name, branch_name, branch_ifsc, mmid, vpa]
    );

    res.status(201).json({ message: 'Trainer bank details added successfully' });

  } catch (error) {
    console.error('Error adding trainer bank details:', error);
    res.status(500).json({ error: 'Failed to add trainer bank details' });
  }
}

// 2. Get All Trainer Bank Details
export async function getAllTrainerBankDetails(req, res) {
  try {
    const result = await pool.query(`SELECT * FROM trainer_bank_details`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching trainer bank details:', error);
    res.status(500).json({ error: 'Failed to fetch trainer bank details' });
  }
}



export async function updateTrainerBankDetails(req, res) {
  const { trainer_id } = req.params;
  const {
    bank_account_number,
    bank_name,
    branch_name,
    branch_ifsc,
    mmid,
    vpa
  } = req.body;

  try {
    // Build dynamic SET clause
    const fields = [];
    const values = [];
    let idx = 1;

    if (bank_account_number !== undefined) {
      fields.push(`bank_account_number = $${idx++}`);
      values.push(bank_account_number);
    }
    if (bank_name !== undefined) {
      fields.push(`bank_name = $${idx++}`);
      values.push(bank_name);
    }
    if (branch_name !== undefined) {
      fields.push(`branch_name = $${idx++}`);
      values.push(branch_name);
    }
    if (branch_ifsc !== undefined) {
      fields.push(`branch_ifsc = $${idx++}`);
      values.push(branch_ifsc);
    }
    if (mmid !== undefined) {
      fields.push(`mmid = $${idx++}`);
      values.push(mmid);
    }
    if (vpa !== undefined) {
      fields.push(`vpa = $${idx++}`);
      values.push(vpa);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Final Update Query
    const query = `
      UPDATE trainer_bank_details SET ${fields.join(', ')}
      WHERE trainer_id = $${idx}
    `;
    values.push(trainer_id);

    await pool.query(query, values);

    res.status(200).json({ message: 'Trainer bank details updated successfully' });

  } catch (error) {
    console.error('Error updating trainer bank details:', error);
    res.status(500).json({ error: 'Failed to update trainer bank details' });
  }
}


