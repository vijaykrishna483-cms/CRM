
import { pool } from "../../libs/database.js";

export async function addExamWithCategories(req, res) {
  const { exam_id, exam_duration, number_of_questions, exam_file, categories } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert into exams table
    await client.query(
      `INSERT INTO exams (exam_id, exam_duration, number_of_questions, exam_file)
       VALUES ($1, $2, $3, $4)`,
      [exam_id, exam_duration, number_of_questions, exam_file]
    );

    // Insert categories into exam_categories_map
    const categoryPromises = categories.map(category_name => {
      return client.query(
        `INSERT INTO exam_categories_map (exam_id, category_name) VALUES ($1, $2)`,
        [exam_id, category_name]
      );
    });

    await Promise.all(categoryPromises);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Exam and categories added successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding exam with categories:', error);
    res.status(500).json({ error: 'Failed to add exam with categories' });
  } finally {
    client.release();
  }
}

// 2. Get All Exams with Categories
export async function getAllExamsWithCategories(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        e.exam_id,
        e.exam_duration,
        e.number_of_questions,
        e.exam_file,
        ARRAY_AGG(ec.category_name) AS categories
      FROM exams e
      LEFT JOIN exam_categories_map ec ON e.exam_id = ec.exam_id
      GROUP BY e.id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching exams with categories:', error);
    res.status(500).json({ error: 'Failed to fetch exam data' });
  }
}

export async function deleteExam(req, res) {
  const { exam_id } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // First delete from exam_categories_map (if ON DELETE CASCADE is not set)
    await client.query(
      `DELETE FROM exam_categories_map WHERE exam_id = $1`,
      [exam_id]
    );

    // Then delete from exams
    const result = await client.query(
      `DELETE FROM exams WHERE exam_id = $1 RETURNING *`,
      [exam_id]
    );

    await client.query('COMMIT');

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json({ message: 'Exam deleted successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting exam:', error);
    res.status(500).json({ error: 'Failed to delete exam' });
  } finally {
    client.release();
  }
}





