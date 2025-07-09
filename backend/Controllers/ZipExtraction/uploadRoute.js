import express from "express";
import unzipper from "unzipper";
import upload from "./upload.js";
import { Readable } from "stream";
import { pool } from "../../libs/database.js";

const router = express.Router();

router.post("/upload", upload.single("zipFile"), async (req, res) => {
  const zipBuffer = req.file.buffer;
  const stream = Readable.from(zipBuffer);
  const fileMap = [];
  const tasks = [];

  stream
    .pipe(unzipper.Parse())
    .on("entry", (entry) => {
      const fileName = entry.path;
      const justFileName = fileName.split("/").pop();
      const panCandidate = justFileName.split("_")[0];
      const isValidPan = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panCandidate);

      const task = (async () => {
        let email = "Email Not Found";
        let pan = "Not Found";

        if (isValidPan) {
          pan = panCandidate;
          try {
            const result = await pool.query(
              `SELECT email FROM (
     SELECT pan_id, personal_email AS email FROM employees
     UNION
     SELECT pan_id, email FROM trainers
   ) AS combined
   WHERE pan_id = $1 LIMIT 1`,
              [pan]
            );

            if (result.rows.length > 0) {
              email = result.rows[0].email;
            }
          } catch (error) {
            console.error("DB Error:", error);
          }
        }

        fileMap.push({ fileName, pan, email });
      })();

      tasks.push(task);
      entry.autodrain();
    })
    .on("close", async () => {
      await Promise.all(tasks); // ⏳ wait for all DB queries
      res.json(fileMap); // ✅ send after all done
    })
    .on("error", (err) => {
      console.error("ZIP processing failed:", err);
      res.status(500).json({ error: "Failed to process ZIP" });
    });
});

export default router;
