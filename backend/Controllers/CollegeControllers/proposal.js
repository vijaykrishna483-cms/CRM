import { pool } from "../../libs/database.js";
import { v4 as uuidv4 } from 'uuid'; 
import jwt from 'jsonwebtoken'
export const addProposal = async (req, res) => {
  try {
      const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employee_id = decoded.employee_id;
    const {
      collegeCode,
      proposalCode,
      issueDate,
      lastUpdated,
      quotedPrice,
      duration,
      fromDate,
      toDate,
      status, // new field
    } = req.body;

    // Validate required fields (excluding fromDate, toDate)
    if (!collegeCode || !proposalCode || !issueDate || !quotedPrice || !duration ) {
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
        duration, from_date, to_date, status ,employee_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)
      RETURNING *`,
      [
        proposalId,
        collegeCode,
        proposalCode,
        issueDate,
        lastUpdated || issueDate,
        quotedPrice,
        duration,
        fromDate || null,
        toDate || null,
        status || 'pending',
        employee_id
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

export const deleteProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    if (!proposalId) {
      return res.status(400).json({
        status: 'failed',
        message: 'Missing proposalId parameter',
      });
    }

    const result = await pool.query(
      'DELETE FROM proposals WHERE proposal_id = $1 RETURNING *',
      [proposalId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'Proposal not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Proposal deleted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error',
    });
  }
};

// utils/toSnakeCase.js
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export const updateProposal = async (req, res) => {
  const { proposalId } = req.params;
  const updates = req.body;

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

    // Only allow these fields to be updated
const allowedFields = [
  'collegeCode', 'proposalCode', 'issueDate',
  'quotedPrice', 'duration', 'fromDate', 'toDate',
  'status' ,'employee_id' // ← add this
];

    const fields = [];
    const values = [];
    let idx = 1;

    for (const key in updates) {
      if (!allowedFields.includes(key)) continue;
      const dbKey = toSnakeCase(key);
      fields.push(`${dbKey} = $${idx}`);
      values.push(updates[key]);
      idx++;
    }

    // Add last_updated
    fields.push(`last_updated = $${idx}`);
    values.push(new Date());

    // Add proposalId for WHERE clause
    const query = `
      UPDATE proposals
      SET ${fields.join(', ')}
      WHERE proposal_id = $${idx + 1}
      RETURNING *;
    `;
    values.push(proposalId);

    const updated = await pool.query(query, values);

    return res.status(200).json({
      status: 'success',
      message: 'Proposal updated successfully',
      data: updated.rows[0],
    });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Could not update proposal',
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

export const getAllProposalPlans = async (req, res) => {
  try {
    // Fetch all plans
    const plansResult = await pool.query(
      'SELECT * FROM proposal_plans ORDER BY plan_id ASC'
    );
    
    const plans = plansResult.rows;
    const planIds = plans.map(plan => plan.plan_id);

    // Initialize services map
    let servicesMap = {};
    
    // Fetch services if plans exist
    if (planIds.length > 0) {
      const servicesResult = await pool.query(
        `SELECT ps.plan_id, s.service_id, s.service_name, s.service_code
         FROM plan_services ps
         JOIN services s ON ps.service_id = s.service_id
         WHERE ps.plan_id = ANY($1)`,
        [planIds]
      );
      
      // Map services to plan IDs
      servicesResult.rows.forEach(row => {
        if (!servicesMap[row.plan_id]) {
          servicesMap[row.plan_id] = [];
        }
        servicesMap[row.plan_id].push({
          service_id: row.service_id,
          service_name: row.service_name,
          service_code: row.service_code
        });
      });
    }

    // Combine plans with their services
    const plansWithServices = plans.map(plan => ({
      ...plan,
      services: servicesMap[plan.plan_id] || []  // Default to empty array
    }));

    return res.status(200).json({
      status: 'success',
      data: plansWithServices,
    });
  } catch (error) {
    console.error('Error fetching proposal plans:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Server error',
    });
  }
};




export const addProposalPlan = async (req, res) => {
  const client = await pool.connect();
  try {
    const { plan_name, plan_code, duration, zipfile_link, services } = req.body;

    // Validate required fields
    if (!plan_name || !plan_code || duration === undefined) {
      return res.status(400).json({
        status: 'failed',
        message: 'Plan name, code, and duration are required',
      });
    }

    await client.query('BEGIN');

    // 1. Check for duplicate plan_code
    const exists = await client.query(
      'SELECT 1 FROM proposal_plans WHERE plan_code = $1',
      [plan_code]
    );

    if (exists.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 'failed',
        message: 'Plan code already exists',
      });
    }

    // 2. Insert new plan
    const planResult = await client.query(
      `INSERT INTO proposal_plans 
       (plan_name, plan_code, duration, zipfile_link) 
       VALUES ($1, $2, $3, $4) 
       RETURNING plan_id`,
      [plan_name, plan_code, duration, zipfile_link || null]
    );
    
    const planId = planResult.rows[0].plan_id;

    // 3. Link services if provided
    if (services && services.length > 0) {
      // Validate service IDs
      const serviceCheck = await client.query(
        'SELECT service_id FROM services WHERE service_id = ANY($1::int[])',
        [services]
      );
      
      if (serviceCheck.rowCount !== services.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          status: 'failed',
          message: 'One or more service IDs are invalid',
        });
      }

      // Insert service relationships
      for (const serviceId of services) {
        await client.query(
          'INSERT INTO plan_services (plan_id, service_id) VALUES ($1, $2)',
          [planId, serviceId]
        );
      }
    }

    await client.query('COMMIT');
    
    return res.status(201).json({
      status: 'success',
      message: 'Plan added successfully',
      data: { plan_id: planId }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding proposal plan:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Server error',
    });
  } finally {
    client.release();
  }
};




// Controller for adding service to proposal
export const addProposalService = async (req, res) => {
  try {
    const { proposalId, planId } = req.body;

    if (!proposalId || !planId) {
      return res.status(400).json({
        status: 'failed',
        message: 'Proposal ID and Plan  ID are required',
      });
    }

    // Check if service exists
    const serviceCheck = await pool.query(
      'SELECT EXISTS (SELECT 1 FROM proposal_plans WHERE plan_id = $1)',
      [planId]
    );

    if (!serviceCheck.rows[0].exists) {
      return res.status(400).json({
        status: 'failed',
        message: 'Service does not exist',
      });
    }

    // Insert into proposal_services table
    const result = await pool.query(
      `INSERT INTO proposal_plan_details (proposal_id, plan_id)
       VALUES ($1, $2)
       RETURNING *`,
      [proposalId, planId]
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
      `SELECT p.* 
       FROM proposal_plans p
       JOIN proposal_plan_details ps ON p.plan_id = ps.plan_id
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
  const { proposalId, planId } = req.params;

  if (!proposalId || !planId) {
    return res.status(400).json({
      status: 'failed',
      message: 'Proposal ID and plan ID are required',
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM proposal_plan_details 
       WHERE proposal_id = $1 AND plan_id = $2
       RETURNING *`,
      [proposalId, planId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'No such mapping found between proposal and plan',
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




