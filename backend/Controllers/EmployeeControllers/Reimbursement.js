import { pool } from "../../libs/database.js";

// Controller: Add a new reimbursement
export async function addReimbursement(req, res) {
  const {
    date, employee_id, reimbursement_id, duration,
    from_date, to_date, location, program, word_link, excel_link, status
  } = req.body;

  // Build columns and values arrays
  const columns = [
    'date', 'employee_id', 'reimbursement_id', 'duration',
    'from_date', 'to_date', 'location', 'program', 'word_link', 'excel_link'
  ];
  const values = [
    date, employee_id, reimbursement_id, duration,
    from_date, to_date, location, program, word_link, excel_link
  ];

  // If status is provided, add it to the insert
  if (status) {
    columns.push('status');
    values.push(status);
  }

  // Build placeholders like $1, $2, ...
  const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');

  try {
    const result = await pool.query(
      `INSERT INTO reimbursements (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
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

// Allowed status values
const validStatuses = ['requested', 'pending', 'paid', 'rejected'];

export async function updateReimbursementStatus(req, res) {
  const { reimbursement_id } = req.params; // This is the VARCHAR from route
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    // Correct: Use reimbursement_id column in WHERE clause
    const result = await pool.query(
      'UPDATE reimbursements SET status = $1 WHERE reimbursement_id = $2 RETURNING *',
      [status, reimbursement_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reimbursement not found' });
    }

    res.json({ message: 'Status updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating reimbursement status:', err);
    res.status(500).json({ error: 'Failed to update status' });
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
    const query = `
      SELECT 
        * 
      FROM reimbursement_reviews
    `;

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching reimbursement reviews:', err);
    res.status(500).json({ error: 'Failed to retrieve reimbursement reviews' });
  }
}




// Add a new review note
// export async function addReviewNote(req, res) {
//   const { review_id, note, } = req.body; // Remove reimbursement_id

//   if (!review_id || !note) {
//     return res.status(400).json({ status: "failed", message: "Required fields missing" });
//   }

//   try {
//     const result = await pool.query(
//       `INSERT INTO reimbursement_review_notes (review_id, note, paid_status)
//        VALUES ($1, $2, $3) RETURNING *`, // Remove reimbursement_id
//       [review_id, note, paid_status || 'Pending']
//     );

//     return res.status(200).json({
//       status: "success",
//       message: "Review note added successfully",
//       data: result.rows[0]
//     });
//   } catch (error) {
//     console.error("Error adding review note:", error);
//     return res.status(500).json({
//       status: "failed",
//       message: "Server error while adding review note"
//     });
//   }
// }


// // Get all review notes
// export async function getAllReviewNotes(req, res) {
//   try {
//     const result = await pool.query(
//       `SELECT * FROM reimbursement_review_notes ORDER BY created_at DESC`
//     );

//     return res.status(200).json({
//       status: "success",
//       data: result.rows
//     });
//   } catch (error) {
//     console.error("Error fetching review notes:", error);
//     return res.status(500).json({
//       status: "failed",
//       message: "Server error while fetching review notes"
//     });
//   }
// }

