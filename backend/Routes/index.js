import express from 'express'
import authRoutes from './authRoutes.js';
import collegeRoutes from './collegeRoutes.js'
import employeeRoutes from './employeeRoutes.js'
import trainerRoutes from './trainerRoutes.js'
import examRoutes from './exmRoutes.js'
import pdfRoutes from './pdfRoutes.js'
import uploadRoute from '../Controllers/ZipExtraction/uploadRoute.js'
import attendanceRoutes from './attendanceRoutes.js'
const router =express.Router();
router.use('/auth',authRoutes)
router.use('/college',collegeRoutes)

router.use('/employee',employeeRoutes)

router.use('/attendance', attendanceRoutes)

router.use('/trainer',trainerRoutes)

router.use('/exam',examRoutes)

router.use('/pdf',pdfRoutes)

router.use('/zip', uploadRoute)

router.use('/attendance',attendanceRoutes)

export default router;