import express from 'express';
import { addCollege, addPoc, addService, deleteCollege, deletePoc, deleteService, getAllColleges, getAllPocs, getPocs, getServices, updatePoc } from '../Controllers/CollegeControllers/collegeData.js';
import { addProposal, addProposalPlan, addProposalService, deleteProposal, deleteProposalService, getAllProposalPlans, getAllProposals, getProposalServices, updateProposal } from '../Controllers/CollegeControllers/proposal.js';
import { addTrainerToProposal, getAllTrainerAllocations } from '../Controllers/CollegeControllers/trainerAllocatn.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { addProposalUpload, getAllProposalUploads } from '../Controllers/CollegeControllers/Sender.js';

const router = express.Router();
router.delete('/delete/:collegeId', deleteCollege);
router.post('/addCollege',addCollege)
router.get('/getall',getAllColleges)


router.post('/addpoc', addPoc);              // Add a POC
router.get('/:collegeId/getpocs', getPocs);  // Get POCs by college ID
router.delete('/poc/delete/:pocId', deletePoc);   // DELETE a POC
router.put('/update/:pocId', updatePoc);      // UPDATE a POC
router.get('/getpocs', getAllPocs);  // Get all POCs



router.post('/addservice', addService);       // Add new service
router.get('/getservices', getServices);      // Get all services

router.post('/addproposal', addProposal);           // Add a proposal
router.get('/getproposals', getAllProposals);  
router.put('/proposal/:proposalId', updateProposal);
// DELETE route for deleting a proposal by ID
router.delete('/proposal/:proposalId', deleteProposal);


router.post('/plans', addProposalPlan);
router.get('/plans', getAllProposalPlans);

// router.post('/proposal/addservice', addProposalServiceDetail);
// router.get('/proposal/:proposalId/services', getAllServices);
// router.put('/proposal/:proposalId/service', updateProposalServiceName);

router.post('/service', addProposalService); // Add service to proposal
router.get('/services/:proposalId', getProposalServices); // Get services 
router.delete("/services/:id", deleteService);
router.delete('/proposal/:proposalId/service/:planId', deleteProposalService);



// POST
router.post('/addTrainer', addTrainerToProposal);

// GET
router.get('/alloted', getAllTrainerAllocations);



router.post('/upload/add', addProposalUpload);


router.get('/upload/get', getAllProposalUploads);


export default router;