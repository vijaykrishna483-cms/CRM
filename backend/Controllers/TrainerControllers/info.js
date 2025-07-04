import { pool } from "../../libs/database.js";

const ALLOWED_EMPLOYMENT_TYPES = ['Freelancer', 'Full Time'];

export async function addTrainerWithServices(req, res) {
  const { 
    trainer_id,
    trainer_name,
    aadhar_id,
    pan_id,
    contact_number,
    email,
    status,
    location,
    charge,
    employment_type,
    service_ids = []
  } = req.body;

  // Validate employment type
  if (!ALLOWED_EMPLOYMENT_TYPES.includes(employment_type)) {
    return res.status(400).json({
      error: `Invalid employment type. Allowed values: ${ALLOWED_EMPLOYMENT_TYPES.join(', ')}`
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert trainer
    await client.query(
      `INSERT INTO trainers 
      (trainer_id, trainer_name, aadhar_id, pan_id, contact_number, email, status, location, charge, employment_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [trainer_id, trainer_name, aadhar_id, pan_id, contact_number, email, status, location, charge, employment_type]
    );

    // Validate service IDs
    if (service_ids.length > 0) {
      const serviceCheck = await client.query(
        'SELECT service_id FROM services WHERE service_id = ANY($1)',
        [service_ids]
      );
      
      if (serviceCheck.rows.length !== service_ids.length) {
        throw new Error('One or more invalid service IDs');
      }

      // Insert services
      const insertPromises = service_ids.map(service_id => 
        client.query(
          `INSERT INTO trainer_services_map (trainer_id, service_id)
          VALUES ($1, $2)`,
          [trainer_id, service_id]
        )
      );
      await Promise.all(insertPromises);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Trainer added successfully' });

  } catch (error) {
    await client.query('ROLLBACK').catch(console.error);
    
    const statusCode = error.message.includes('invalid') ? 400 : 500;
    res.status(statusCode).json({
      error: error.message || 'Database operation failed'
    });
  } finally {
    client.release();
  }
}

export async function getTrainerWithServices(req, res) {
  const { trainer_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
          t.trainer_id,
          t.trainer_name,
          t.aadhar_id,
          t.pan_id,
          t.contact_number,
          t.email,
          t.status,
          t.location,
          t.charge,
          t.employment_type,
          ARRAY_AGG(s.service_name) AS services
       FROM trainers t
       LEFT JOIN trainer_services_map ts ON t.trainer_id = ts.trainer_id
       LEFT JOIN services s ON ts.service_id = s.service_id
       WHERE t.trainer_id = $1
       GROUP BY t.trainer_id`,
      [trainer_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching trainer with services:', error);
    res.status(500).json({ error: 'Failed to fetch trainer data' });
  }
}

export async function updateTrainerWithServices(req, res) {
  const { trainer_id } = req.params;
  const {
    trainer_name,
    aadhar_id,
    pan_id,
    contact_number,
    email,
    status,
    location,
    charge,
    employment_type,
    service_ids
  } = req.body;

  // Validate employment type
  if (employment_type && !ALLOWED_EMPLOYMENT_TYPES.includes(employment_type)) {
    return res.status(400).json({
      error: `Invalid employment type. Allowed values: ${ALLOWED_EMPLOYMENT_TYPES.join(', ')}`
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Build dynamic update query
    const fields = [];
    const values = [];
    let idx = 1;

    const fieldMappings = {
      trainer_name, aadhar_id, pan_id, contact_number, email, 
      status, location, charge, employment_type
    };

    Object.entries(fieldMappings).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
      }
    });

    // Only perform update if fields exist
    if (fields.length > 0) {
      const query = `
        UPDATE trainers SET ${fields.join(', ')}
        WHERE trainer_id = $${idx}
      `;
      values.push(trainer_id);
      await client.query(query, values);
    }

    // Update services if provided
    if (service_ids !== undefined) {
      // Delete old mappings
      await client.query(
        `DELETE FROM trainer_services_map WHERE trainer_id = $1`,
        [trainer_id]
      );

      // Insert new mappings if provided
      if (Array.isArray(service_ids) && service_ids.length > 0) {
        // Validate service IDs
        const serviceCheck = await client.query(
          'SELECT service_id FROM services WHERE service_id = ANY($1)',
          [service_ids]
        );
        
        if (serviceCheck.rows.length !== service_ids.length) {
          throw new Error('One or more invalid service IDs');
        }

        const insertPromises = service_ids.map(service_id => 
          client.query(
            `INSERT INTO trainer_services_map (trainer_id, service_id)
            VALUES ($1, $2)`,
            [trainer_id, service_id]
          )
        );
        await Promise.all(insertPromises);
      }
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Trainer updated successfully' });

  } catch (error) {
    await client.query('ROLLBACK').catch(console.error);
    console.error('Error updating trainer:', error);
    
    const statusCode = error.message.includes('invalid') ? 400 : 500;
    res.status(statusCode).json({
      error: error.message || 'Failed to update trainer'
    });
  } finally {
    client.release();
  }
}

export async function getAllTrainers(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
          t.id,
          t.trainer_id,
          t.trainer_name,
          t.aadhar_id,
          t.pan_id,
          t.contact_number,
          t.email,
          t.status,
          t.location,
          t.charge,
          t.employment_type,
          COALESCE(
            JSON_AGG(
              DISTINCT JSONB_BUILD_OBJECT(
                'service_id', s.service_id,
                'service_name', s.service_name,
                'service_code', s.service_code
              )
            ) FILTER (WHERE s.service_id IS NOT NULL), '[]'
          ) AS services
        FROM trainers t
        LEFT JOIN trainer_services_map ts ON t.trainer_id = ts.trainer_id
        LEFT JOIN services s ON ts.service_id = s.service_id
        GROUP BY 
          t.id, t.trainer_id, t.trainer_name, t.aadhar_id, t.pan_id, 
          t.contact_number, t.email, t.status, t.location, t.charge, t.employment_type
        ORDER BY t.trainer_id`
    );

    res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve trainer list',
    });
  }
}
