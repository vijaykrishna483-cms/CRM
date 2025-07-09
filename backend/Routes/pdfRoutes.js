import express from 'express';
import { generateDoc } from '../Generators/invoice.js';
import { generateDocTef } from '../Generators/TEF.js';
import { generateDocTof } from '../Generators/TOE.js';

const router = express.Router();

router.post('/payslip', generateDoc);
router.post('/invoice', generateDocTef);
router.post('/toe', generateDocTof);

export default router;
