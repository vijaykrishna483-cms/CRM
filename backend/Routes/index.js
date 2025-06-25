import express from 'express'
import authRoutes from './authRoutes.js';
import collegeRoutes from './collegeRoutes.js'
import employeeRoutes from './employeeRoutes.js'
import trainerRoutes from './trainerRoutes.js'
import examRoutes from './exmRoutes.js'
const router =express.Router();
router.use('/auth',authRoutes)
router.use('/college',collegeRoutes)

router.use('/employee',employeeRoutes)

router.use('/trainer',trainerRoutes)

router.use('/exam',examRoutes)
export default router;