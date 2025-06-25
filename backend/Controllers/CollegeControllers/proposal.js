import { pool } from "../../libs/database.js";
import { v4 as uuidv4 } from 'uuid'; 

export const addProposal = async (req, res) => {
  try {
    const {
      collegeCode,
      proposalCode,
      issueDate,
      lastUpdated,
      quotedPrice,
      duration,
      fromDate,
      toDate,
    } = req.body;

    if (!collegeCode || !proposalCode || !issueDate || !quotedPrice || !duration || !fromDate || !toDate) {
      return res.status(400).json({
        status: 'failed',
        message: 'Missing required fields',
      });
    }

    // Check if proposalCode already exists
    const check = await pool.query(
      'SELECT EXISTS (SELECT 1 FROM proposals WHERE proposal_code = $1)',
      [proposalCode]
    );

    if (check.rows[0].exists) {
      return res.status(400).json({
        status: 'failed',
        message: 'Proposal code already exists',
      });
    }

    const proposalId = uuidv4(); // Generate a unique proposal_id

    const result = await pool.query(
      `INSERT INTO proposals (
        proposal_id, college_code, proposal_code,
        issue_date, last_updated, quoted_price,
        duration, from_date, to_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        proposalId,
        collegeCode,
        proposalCode,
        issueDate,
        lastUpdated || issueDate, // default to issueDate if not provided
        quotedPrice,
        duration,
        fromDate,
        toDate,
      ]
    );

    return res.status(200).json({
      status: 'success',
      message: 'Proposal added successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding proposal:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error',
    });
  }
};


export const getAllProposals = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proposals ORDER BY issue_date DESC');

    return res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Could not retrieve proposals',
    });
  }
};


export const updateProposal = async (req, res) => {
  const { proposalId } = req.params;
  const {
    collegeCode,
    proposalCode,
    issueDate,
    lastUpdated,
    quotedPrice,
    duration,
    fromDate,
    toDate,
  } = req.body;

  try {
    // Check if proposal exists
    const check = await pool.query(
      'SELECT * FROM proposals WHERE proposal_id = $1',
      [proposalId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'Proposal not found',
      });
    }

    // Update fields if provided, else retain existing values
    const existing = check.rows[0];
    const updatedProposal = await pool.query(
      `UPDATE proposals SET
        college_code = $1,
        proposal_code = $2,
        issue_date = $3,
        last_updated = $4,
        quoted_price = $5,
        duration = $6,
        from_date = $7,
        to_date = $8
      WHERE proposal_id = $9
      RETURNING *`,
      [
        collegeCode || existing.college_code,
        proposalCode || existing.proposal_code,
        issueDate || existing.issue_date,
        lastUpdated || new Date(), // update timestamp
        quotedPrice || existing.quoted_price,
        duration || existing.duration,
        fromDate || existing.from_date,
        toDate || existing.to_date,
        proposalId,
      ]
    );

    return res.status(200).json({
      status: 'success',
      message: 'Proposal updated successfully',
      data: updatedProposal.rows[0],
    });
  } catch (error) {
    console.error('Error updating proposal:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Could not update proposal',
    });
  }
};


export const addProposalServiceDetail = async (req, res) => {
  try {
    const { proposalId, serviceName } = req.body;

    if (!proposalId || !serviceName) {
      return res.status(400).json({
        status: 'failed',
        message: 'Proposal ID and Service Name are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO proposal_service_details (proposal_id, service_name)
       VALUES ($1, $2)
       RETURNING *`,
      [proposalId, serviceName]
    );

    return res.status(200).json({
      status: 'success',
      message: 'Service added to proposal successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding proposal service:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error',
    });
  }
};




export const getAllServices = async (req, res) => {
  const { proposalId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM proposal_service_details WHERE proposal_id = $1 ORDER BY id ASC',
      [proposalId]
    );

    return res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Could not retrieve services for this proposal',
    });
  }
};




// Controller for adding service to proposal
export const addProposalService = async (req, res) => {
  try {
    const { proposalId, serviceId } = req.body;

    if (!proposalId || !serviceId) {
      return res.status(400).json({
        status: 'failed',
        message: 'Proposal ID and Service ID are required',
      });
    }

    // Check if service exists
    const serviceCheck = await pool.query(
      'SELECT EXISTS (SELECT 1 FROM services WHERE service_id = $1)',
      [serviceId]
    );

    if (!serviceCheck.rows[0].exists) {
      return res.status(400).json({
        status: 'failed',
        message: 'Service does not exist',
      });
    }

    // Insert into proposal_services table
    const result = await pool.query(
      `INSERT INTO proposal_services (proposal_id, service_id)
       VALUES ($1, $2)
       RETURNING *`,
      [proposalId, serviceId]
    );

    return res.status(200).json({
      status: 'success',
      message: 'Service added to proposal successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding proposal service:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error',
    });
  }
};

// Controller for fetching services for a proposal
export const getProposalServices = async (req, res) => {
  const { proposalId } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.* 
       FROM services s
       JOIN proposal_services ps ON s.service_id = ps.service_id
       WHERE ps.proposal_id = $1`,
      [proposalId]
    );

    return res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Could not retrieve services for this proposal',
    });
  }
};

export const deleteProposalService = async (req, res) => {
  const { proposalId, serviceId } = req.params;

  if (!proposalId || !serviceId) {
    return res.status(400).json({
      status: 'failed',
      message: 'Proposal ID and Service ID are required',
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM proposal_services 
       WHERE proposal_id = $1 AND service_id = $2
       RETURNING *`,
      [proposalId, serviceId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'No such mapping found between proposal and service',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Service removed from proposal successfully',
    });
  } catch (error) {
    console.error('Error deleting proposal service:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Server error while deleting service from proposal',
    });
  }
};
