import express from 'express';
import { addCollege, addPoc, addService, deletePoc, getAllColleges, getPocs, getServices, updatePoc, updateProposalServiceName } from '../Controllers/CollegeControllers/collegeData.js';
import { addProposal, addProposalService, deleteProposalService, getAllProposals, getAllServices, getProposalServices, updateProposal } from '../Controllers/CollegeControllers/proposal.js';
import { addTrainerToProposal, getAllTrainerAllocations } from '../Controllers/CollegeControllers/trainerAllocatn.js';

const router = express.Router();

router.post('/addCollege',addCollege)
router.get('/getall',getAllColleges)
router.post('/addpoc', addPoc);              // Add a POC
router.get('/:collegeId/getpocs', getPocs);  // Get POCs by college ID
router.delete('/delete/:pocId', deletePoc);   // DELETE a POC
router.put('/update/:pocId', updatePoc);      // UPDATE a POC

router.post('/addservice', addService);       // Add new service
router.get('/getservices', getServices);      // Get all services

router.post('/addproposal', addProposal);           // Add a proposal
router.get('/getproposals', getAllProposals);  
router.put('/proposal/:proposalId', updateProposal);


// router.post('/proposal/addservice', addProposalServiceDetail);
// router.get('/proposal/:proposalId/services', getAllServices);
// router.put('/proposal/:proposalId/service', updateProposalServiceName);

router.post('/service', addProposalService); // Add service to proposal
router.get('/services/:proposalId', getProposalServices); // Get services 
router.delete('/proposal/:proposalId/service/:serviceId', deleteProposalService);



// POST
router.post('/addTrainer', addTrainerToProposal);

// GET
router.get('/alloted', getAllTrainerAllocations);


export default router;