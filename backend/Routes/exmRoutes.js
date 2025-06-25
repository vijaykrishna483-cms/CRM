
import express from 'express';
import { addExamWithCategories, deleteExam, getAllExamsWithCategories } from '../Controllers/ExamControllers/exm.js';
import { addExamCollegeMapping, deleteExamCollegeMapping, getAllExamCollegeMappings } from '../Controllers/ExamControllers/college.js';
const router = express.Router();

router.post('/add', addExamWithCategories);
router.get('/getall', getAllExamsWithCategories);
router.delete('/delete/:exam_id', deleteExam); // <--- delete route added



router.post('/addcollege', addExamCollegeMapping);
router.get('/collegelist', getAllExamCollegeMappings);
router.delete('/deletecollege/:id', deleteExamCollegeMapping);


export default router;
