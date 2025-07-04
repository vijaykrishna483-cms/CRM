import { pool } from "../../libs/database.js";

export const addCollege = async (req, res) => {
  try {
    const { collegeName, location, state, collegeCode } = req.body;

    if (!collegeName || !location || !state || !collegeCode) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    // Check if college already exists by code or name
    const collegeExist = await pool.query({
      text: "SELECT EXISTS (SELECT 1 FROM colleges WHERE college_name = $1 OR college_code = $2)",
      values: [collegeName, collegeCode],
    });

    if (collegeExist.rows[0].exists) {
      return res.status(400).json({
        status: "failed",
        message: "College with this name or code already exists",
      });
    }

    // Insert new college
    const college = await pool.query({
      text: "INSERT INTO colleges (college_name, college_code, location, state) VALUES ($1, $2, $3, $4) RETURNING *",
      values: [collegeName, collegeCode, location, state],
    });

    return res.status(200).json({
      status: "success",
      message: "College inserted",
      data: college.rows[0],
    });
  } catch (error) {
    console.error("Error inserting college:", error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

export const getAllColleges = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colleges ORDER BY college_id ASC');

    return res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Could not retrieve colleges',
    });
  }
};

export const deleteCollege = async (req, res) => {
  const { collegeId } = req.params;

  try {
    await pool.query('BEGIN');

    // Get college_code for use in deleting proposals
    const collegeCodeResult = await pool.query(
      'SELECT college_code FROM colleges WHERE college_id = $1',
      [collegeId]
    );

    if (collegeCodeResult.rowCount === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({
        status: 'failed',
        message: 'College not found',
      });
    }

    const collegeCode = collegeCodeResult.rows[0].college_code;

    // Delete related proposals
    await pool.query('DELETE FROM proposals WHERE college_code = $1', [collegeCode]);

    // Delete related POCs
    await pool.query('DELETE FROM college_pocs WHERE college_id = $1', [collegeId]);

    // Delete the college
    await pool.query('DELETE FROM colleges WHERE college_id = $1', [collegeId]);

    await pool.query('COMMIT');

    return res.status(200).json({
      status: 'success',
      message: 'College and related records deleted',
    });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error deleting college:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Server error while deleting college',
    });
  }
};


export const addPoc = async (req, res) => {
  try {
    const { collegeId, pocName, pocDesignation, pocEmail, pocContact, pocRedEmail } = req.body;

    if (!collegeId || !pocName || !pocDesignation || !pocEmail || !pocContact || !pocRedEmail) {
      return res.status(400).json({
        status: 'failed',
        message: 'All fields are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO college_pocs (college_id, poc_name, poc_designation, poc_email, poc_contact, poc_red_email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [collegeId, pocName, pocDesignation, pocEmail, pocContact, pocRedEmail]
    );

    return res.status(200).json({
      status: 'success',
      message: 'POC added successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error adding POC:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error'
    });
  }
};


export const getAllPocs = async (req, res) => {
  try {
    // Optional filter by pocRedEmail


     const result = await pool.query('SELECT * FROM college_pocs ORDER BY poc_id ASC');

    return res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching POCs:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error'
    });
  }
};


export const getPocs = async (req, res) => {
  const { collegeId } = req.params;

  if (!collegeId) {
    return res.status(400).json({
      status: 'failed',
      message: 'College ID is required'
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM college_pocs WHERE college_id = $1 ORDER BY poc_id ASC',
      [collegeId]
    );

    return res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching POCs:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error'
    });
  }
};


export const deletePoc = async (req, res) => {
  const { pocId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM college_pocs WHERE poc_id = $1 RETURNING *',
      [pocId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'POC not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'POC deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting POC:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error'
    });
  }
};


export const updatePoc = async (req, res) => {
  const { pocId } = req.params;
  const { pocName, pocDesignation, pocEmail, pocContact } = req.body;

  try {
    const result = await pool.query(
      `UPDATE college_pocs
       SET poc_name = $1,
           poc_designation = $2,
           poc_email = $3,
           poc_contact = $4
       WHERE poc_id = $5
       RETURNING *`,
      [pocName, pocDesignation, pocEmail, pocContact, pocId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'POC not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'POC updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating POC:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error'
    });
  }
};



export const addService = async (req, res) => {
  try {
    const { serviceName, serviceCode } = req.body;

    if (!serviceName || !serviceCode) {
      return res.status(400).json({
        status: "failed",
        message: "Service name and code are required",
      });
    }

    // Check for existing code
    const exists = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM services WHERE service_code = $1)",
      [serviceCode]
    );

    if (exists.rows[0].exists) {
      return res.status(400).json({
        status: "failed",
        message: "Service code already exists",
      });
    }

    const result = await pool.query(
      `INSERT INTO services (service_name, service_code)
       VALUES ($1, $2)
       RETURNING *`,
      [serviceName, serviceCode]
    );

    return res.status(200).json({
      status: "success",
      message: "Service added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services ORDER BY service_id ASC");

    return res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({
      status: "failed",
      message: "Could not retrieve services",
    });
  }
};

export const updateProposalServiceName = async (req, res) => {
  const { proposalId } = req.params;
  const { oldServiceName, newServiceName } = req.body;

  if (!oldServiceName || !newServiceName) {
    return res.status(400).json({
      status: 'failed',
      message: 'Both old and new service names are required',
    });
  }

  try {
    // Check if the entry exists
    const exists = await pool.query(
      `SELECT * FROM proposal_service_details
       WHERE proposal_id = $1 AND service_name = $2`,
      [proposalId, oldServiceName]
    );

    if (exists.rows.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'Service name not found for the given proposal ID',
      });
    }

    // Update the service name
    const result = await pool.query(
      `UPDATE proposal_service_details
       SET service_name = $1
       WHERE proposal_id = $2 AND service_name = $3
       RETURNING *`,
      [newServiceName, proposalId, oldServiceName]
    );

    return res.status(200).json({
      status: 'success',
      message: 'Service name updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating service name:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Server error',
    });
  }
};

