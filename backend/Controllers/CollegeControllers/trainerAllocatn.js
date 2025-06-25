import { pool } from "../../libs/database.js";


export const addTrainerToProposal = async (req, res) => {
  const { proposal_id, trainer_id } = req.body;

  if (!proposal_id || !trainer_id) {
    return res.status(400).json({
      status: 'failed',
      message: 'Proposal ID and Trainer ID are required',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO proposal_trainer_map (proposal_id, trainer_id)
       VALUES ($1, $2)
       ON CONFLICT (proposal_id, trainer_id) DO NOTHING
       RETURNING *`,
      [proposal_id, trainer_id]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({
        status: 'failed',
        message: 'Trainer already mapped to this proposal',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Trainer added to proposal',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding trainer to proposal:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Server error',
    });
  }
};

export const getAllTrainerAllocations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ptm.proposal_id,
        p.proposal_code,
        ptm.trainer_id,
        t.trainer_name,
        t.aadhar_id,
        t.pan_id,
        t.contact_number,
        t.email,
        t.status,
        t.location,
        t.charge
      FROM proposal_trainer_map ptm
      JOIN proposals p
        ON ptm.proposal_id = p.proposal_id
      JOIN trainers t
        ON ptm.trainer_id = t.trainer_id
      ORDER BY ptm.proposal_id, t.trainer_name
    `);

    return res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching all trainer allocations:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Could not fetch trainer allocations',
    });
  }
};
