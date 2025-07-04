// routes/uploadRoute.js
import express from 'express';
import unzipper from 'unzipper';
import upload from './upload.js';
import { Readable } from 'stream';
import { pool } from '../../libs/database.js';

const router = express.Router();
const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;

router.post('/upload', upload.single('zipFile'), async (req, res) => {
  const zipBuffer = req.file.buffer;
  const fileMap = [];

  const stream = Readable.from(zipBuffer);
  const zipEntries = [];

  stream
    .pipe(unzipper.Parse())
    .on('entry', async (entry) => {
      const fileName = entry.path;
      const panMatch = fileName.match(panRegex);
      let email = 'Email Not Found';
      let pan = panMatch ? panMatch[0] : 'Not Found';

      if (panMatch) {
        try {
          const result = await pool.query(
            `SELECT email FROM (
               SELECT pan_number, email FROM employees
               UNION
               SELECT pan_number, email FROM trainers
             ) AS combined
             WHERE pan_number = $1 LIMIT 1`,
            [pan]
          );

          if (result.rows.length > 0) {
            email = result.rows[0].email;
          }
        } catch (error) {
          console.error('DB Error:', error);
        }
      }

      fileMap.push({ fileName, pan, email });
      entry.autodrain();
    })
    .on('close', () => {
      res.json(fileMap);
    });
});

export default router;
