// routes/employeeRoutes.js
import express from 'express';
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees
} from '../Controllers/EmployeeControllers/personalInfo.js';
import { addBankDetails, deleteBankDetails, getAllBankDetails, updateBankDetails } from '../Controllers/EmployeeControllers/BankDetails.js';
import {  addReimbursement, addReimbursementReview, getAllReimbursementReviews, getReimbursements, updateReimbursementStatus } from '../Controllers/EmployeeControllers/Reimbursement.js';


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
router.patch('/reimbursements/:reimbursement_id/status', updateReimbursementStatus);





router.post('/addreview', addReimbursementReview);
router.get('/getallreviews', getAllReimbursementReviews);


// router.post("/review-note", addReviewNote);
// router.get("/review-notes", getAllReviewNotes);

export default router;
