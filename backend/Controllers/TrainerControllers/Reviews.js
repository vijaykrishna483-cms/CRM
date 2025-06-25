import { pool } from "../../libs/database.js";

// 1. Add Trainer Review
export async function addTrainerReview(req, res) {
  const { proposal_code, trainer_id, trainer_name, trainer_comment, trainer_star_rating } = req.body;

  try {
    await pool.query(
      `INSERT INTO trainer_reviews 
        (proposal_code, trainer_id, trainer_name, trainer_comment, trainer_star_rating)
       VALUES ($1, $2, $3, $4, $5)`,
      [proposal_code, trainer_id, trainer_name, trainer_comment, trainer_star_rating]
    );

    res.status(201).json({ message: 'Trainer review added successfully' });

  } catch (error) {
    console.error('Error adding trainer review:', error);
    res.status(500).json({ error: 'Failed to add trainer review' });
  }
}

// 2. Get All Trainer Reviews
export async function getAllTrainerReviews(req, res) {
  try {
    const result = await pool.query(`SELECT * FROM trainer_reviews`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching trainer reviews:', error);
    res.status(500).json({ error: 'Failed to fetch trainer reviews' });
  }
}

export async function updateTrainerReview(req, res) {
  const { id } = req.params;
  const {
    proposal_code,
    trainer_id,
    trainer_name,
    trainer_comment,
    trainer_star_rating
  } = req.body;

  try {
    // Dynamically build SET query
    const fields = [];
    const values = [];
    let idx = 1;

    if (proposal_code !== undefined) {
      fields.push(`proposal_code = $${idx++}`);
      values.push(proposal_code);
    }
    if (trainer_id !== undefined) {
      fields.push(`trainer_id = $${idx++}`);
      values.push(trainer_id);
    }
    if (trainer_name !== undefined) {
      fields.push(`trainer_name = $${idx++}`);
      values.push(trainer_name);
    }
    if (trainer_comment !== undefined) {
      fields.push(`trainer_comment = $${idx++}`);
      values.push(trainer_comment);
    }
    if (trainer_star_rating !== undefined) {
      fields.push(`trainer_star_rating = $${idx++}`);
      values.push(trainer_star_rating);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const query = `
      UPDATE trainer_reviews SET ${fields.join(', ')}
      WHERE id = $${idx}
    `;
    values.push(id);

    await pool.query(query, values);

    res.status(200).json({ message: 'Trainer review updated successfully' });

  } catch (error) {
    console.error('Error updating trainer review:', error);
    res.status(500).json({ error: 'Failed to update trainer review' });
  }
}
