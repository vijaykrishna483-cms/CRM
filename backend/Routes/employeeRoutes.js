// routes/employeeRoutes.js
import express from 'express';
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees
} from '../Controllers/EmployeeControllers/personalInfo.js';
import { addBankDetails, deleteBankDetails, getAllBankDetails, updateBankDetails } from '../Controllers/EmployeeControllers/bankDetails.js';
import { addExpenditure, addReimbursement, addReimbursementReview, getAllExpenditures, getAllReimbursementReviews, getExpendituresByReimbursementId, getReimbursements } from '../Controllers/EmployeeControllers/Reimbursement.js';


const router = express.Router();

router.post('/add', addEmployee);
router.put('/update/:id', updateEmployee);
router.delete('/delete/:id', deleteEmployee);
router.get('/', getAllEmployees);




router.post('/addbank', addBankDetails);
router.get('/bankdetails', getAllBankDetails);
router.put('/bankUpdate/:id', updateBankDetails);
router.delete('/bankDelete/:id', deleteBankDetails);

router.post('/addreimbursment', addReimbursement);
router.get('/getreimbursments', getReimbursements);


router.post('/addexpenditure', addExpenditure);
router.get('/getallexpenditures', getAllExpenditures);
router.get('/getbyreimbursement/:reimbursement_id', getExpendituresByReimbursementId);


router.post('/addreview', addReimbursementReview);
router.get('/getallreviews', getAllReimbursementReviews);


export default router;
