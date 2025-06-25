import { pool } from "../../libs/database.js";

// Controller: Add a new reimbursement
export async function addReimbursement(req, res) {
  const { date, employee_id, reimbursement_id, duration, from_date, to_date, location, program } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reimbursements 
      (date, employee_id, reimbursement_id, duration, from_date, to_date, location, program)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [date, employee_id, reimbursement_id, duration, from_date, to_date, location, program]
    );
    res.status(201).json({ message: 'Reimbursement added successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error adding reimbursement:', err);
    res.status(500).json({ error: 'Failed to add reimbursement' });
  }
}

// Controller: Get all reimbursements
export async function getReimbursements(req, res) {
  try {
    const result = await pool.query('SELECT * FROM reimbursements');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching reimbursements:', err);
    res.status(500).json({ error: 'Failed to retrieve reimbursements' });
  }
}




// 1. Add Expenditure
export async function addExpenditure(req, res) {
  const { reimbursement_id, expense_category, expense_amount, additional_cost, total_cost, invoice } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO expenditures 
      (reimbursement_id, expense_category, expense_amount, additional_cost, total_cost, invoice)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [reimbursement_id, expense_category, expense_amount, additional_cost, total_cost, invoice]
    );
    res.status(201).json({ message: 'Expenditure added successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error adding expenditure:', err);
    res.status(500).json({ error: 'Failed to add expenditure' });
  }
}

// 2. Get All Expenditures
export async function getAllExpenditures(req, res) {
  try {
    const result = await pool.query('SELECT * FROM expenditures');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching expenditures:', err);
    res.status(500).json({ error: 'Failed to retrieve expenditures' });
  }
}

// 3. Get Expenditures By reimbursement_id
export async function getExpendituresByReimbursementId(req, res) {
  const { reimbursement_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM expenditures WHERE reimbursement_id = $1',
      [reimbursement_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No expenditures found for this reimbursement_id' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching expenditures by reimbursement_id:', err);
    res.status(500).json({ error: 'Failed to retrieve expenditures' });
  }
}



// 1. Add Reimbursement Review
export async function addReimbursementReview(req, res) {
  const { reimbursement_id, review_comment, reimbursement_amount, approved_by } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reimbursement_reviews 
      (reimbursement_id, review_comment, reimbursement_amount, approved_by)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [reimbursement_id, review_comment, reimbursement_amount, approved_by]
    );

    res.status(201).json({ message: 'Review added successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error adding reimbursement review:', err);
    res.status(500).json({ error: 'Failed to add reimbursement review' });
  }
}

// 2. Get All Reimbursement Reviews
export async function getAllReimbursementReviews(req, res) {
  try {
    const result = await pool.query('SELECT * FROM reimbursement_reviews');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching reimbursement reviews:', err);
    res.status(500).json({ error: 'Failed to retrieve reimbursement reviews' });
  }
}

