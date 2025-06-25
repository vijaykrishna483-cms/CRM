import express from 'express'
import { addTrainerWithServices, getAllTrainers, getTrainerWithServices, updateTrainerWithServices } from '../Controllers/TrainerControllers/info.js';
import { addTrainerBankDetails, getAllTrainerBankDetails, updateTrainerBankDetails } from '../Controllers/TrainerControllers/bankDetails.js';
import { addTrainerReview, getAllTrainerReviews, updateTrainerReview } from '../Controllers/TrainerControllers/Reviews.js';

const router = express.Router();


router.post('/add', addTrainerWithServices);
router.get('/get/:trainer_id', getTrainerWithServices); 
router.put('/update/:trainer_id', updateTrainerWithServices); 
router.get('/getAllTrainers', getAllTrainers); 



router.post('/addBank', addTrainerBankDetails);
router.get('/getallBank', getAllTrainerBankDetails);
router.put('/updateBank/:trainer_id', updateTrainerBankDetails);

router.post('/addreview', addTrainerReview);
router.get('/allreviews', getAllTrainerReviews);
router.put('/updatereview/:id', updateTrainerReview);
export default router;
