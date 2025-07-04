import { pool } from "../../libs/database.js";

// 1. Add Exam-College Mapping
export async function addExamCollegeMapping(req, res) {
  const { exam_id, college_code, college_batch } = req.body;

  try {
    await pool.query(
      `INSERT INTO exam_college_map (exam_id, college_code, college_batch, date_of_issue)
       VALUES ($1, $2, $3, $4)`,
      [exam_id, college_code, college_batch, new Date()]
    );

    res.status(201).json({ message: 'Exam-College mapping added successfully' });

  } catch (error) {
    console.error('Error adding exam-college mapping:', error);
    res.status(500).json({ error: 'Failed to add exam-college mapping' });
  }
}

// 2. Get All Exam-College Mappings (with College Name & Exam Categories)
export async function getAllExamCollegeMappings(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        ecm.id,                       -- include the ID here
        ecm.exam_id,
        ecm.college_code,
        c.college_name,
        ecm.college_batch,
        ecm.date_of_issue,
        ARRAY_AGG(DISTINCT ecat.category_name) AS exam_categories
      FROM exam_college_map ecm
      JOIN colleges c ON ecm.college_code = c.college_code
      JOIN exam_categories_map ecat ON ecm.exam_id = ecat.exam_id
      GROUP BY ecm.id, ecm.exam_id, ecm.college_code, c.college_name, ecm.college_batch, ecm.date_of_issue
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching exam-college mappings:', error);
    res.status(500).json({ error: 'Failed to fetch exam-college mappings' });
  }
}


// 3. Delete Exam-College Mapping by ID
export async function deleteExamCollegeMapping(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM exam_college_map WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Mapping not found' });
    }

    res.status(200).json({ message: 'Mapping deleted successfully' });

  } catch (error) {
    console.error('Error deleting exam-college mapping:', error);
    res.status(500).json({ error: 'Failed to delete exam-college mapping' });
  }
}
