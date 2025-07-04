
import express from 'express';
import { deleteAttendance, getAllAttendance, getEmployeeAttendance, recordAttendance, updateAttendance } from '../Controllers/attendanceController/controller.js';

const router = express.Router();

router.post('/record', recordAttendance);
router.get('/employee/:employee_id', getEmployeeAttendance);
router.get('/all', getAllAttendance);
router.put('/:record_id', updateAttendance);
router.delete('/:record_id', deleteAttendance);



export default router;
