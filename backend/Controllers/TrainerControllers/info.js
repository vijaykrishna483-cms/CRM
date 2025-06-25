import { pool } from "../../libs/database.js";

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
    service_ids  // expecting an array like [1,3,5]
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert into trainers
    await client.query(
      `INSERT INTO trainers 
      (trainer_id, trainer_name, aadhar_id, pan_id, contact_number, email, status, location, charge)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [trainer_id, trainer_name, aadhar_id, pan_id, contact_number, email, status, location, charge]
    );

    // 2. Insert multiple services into trainer_services_map
    const insertServicePromises = service_ids.map(service_id => {
      return client.query(
        `INSERT INTO trainer_services_map (trainer_id, service_id)
         VALUES ($1, $2)`,
        [trainer_id, service_id]
      );
    });

    await Promise.all(insertServicePromises);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Trainer and services added successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding trainer with services:', error);
    res.status(500).json({ error: 'Failed to add trainer with services' });
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
          ARRAY_AGG(s.service_name) AS services
       FROM trainers t
       JOIN trainer_services_map ts ON t.trainer_id = ts.trainer_id
       JOIN services s ON ts.service_id = s.service_id
       WHERE t.trainer_id = $1
       GROUP BY t.id`,
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
    service_ids // optional
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Build dynamic update query based on fields present
    const fields = [];
    const values = [];
    let idx = 1;

    if (trainer_name !== undefined) {
      fields.push(`trainer_name = $${idx++}`);
      values.push(trainer_name);
    }
    if (aadhar_id !== undefined) {
      fields.push(`aadhar_id = $${idx++}`);
      values.push(aadhar_id);
    }
    if (pan_id !== undefined) {
      fields.push(`pan_id = $${idx++}`);
      values.push(pan_id);
    }
    if (contact_number !== undefined) {
      fields.push(`contact_number = $${idx++}`);
      values.push(contact_number);
    }
    if (email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (location !== undefined) {
      fields.push(`location = $${idx++}`);
      values.push(location);
    }
    if (charge !== undefined) {
      fields.push(`charge = $${idx++}`);
      values.push(charge);
    }

    // Only perform update if fields exist
    if (fields.length > 0) {
      const query = `
        UPDATE trainers SET ${fields.join(', ')}
        WHERE trainer_id = $${idx}
      `;
      values.push(trainer_id);
      await client.query(query, values);
    }

    // 2. If service_ids is provided, update services mapping
    if (service_ids !== undefined && Array.isArray(service_ids)) {
      // Delete old mappings
      await client.query(
        `DELETE FROM trainer_services_map WHERE trainer_id = $1`,
        [trainer_id]
      );

      // Insert new mappings
      const insertServicePromises = service_ids.map(service_id => {
        return client.query(
          `INSERT INTO trainer_services_map (trainer_id, service_id)
           VALUES ($1, $2)`,
          [trainer_id, service_id]
        );
      });

      await Promise.all(insertServicePromises);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Trainer and services updated successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating trainer with services:', error);
    res.status(500).json({ error: 'Failed to update trainer with services' });
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
          t.contact_number, t.email, t.status, t.location, t.charge
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
