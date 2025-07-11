import express from 'express';
import { deleteUser, getAllUsers, signinUser, signupUser } from '../Controllers/authControllers/authControllers.js';
import { addVertical, deleteVertical, getAllVerticals } from '../Controllers/authControllers/vertical.js';
import { addPosition, deletePosition, getAllPositions } from '../Controllers/authControllers/position.js';
import { addPage, deletePage, getAllPages } from '../Controllers/authControllers/pages.js';
import { addRoleAccess, deleteRoleAccess, getAllRoleAccess } from '../Controllers/authControllers/roleAccess.js';
import { authenticateToken, checkPageAccess } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post("/access/add", addRoleAccess);
router.get("/access/getall", getAllRoleAccess);
router.delete("/access/delete/:id", deleteRoleAccess); // 👈 Delete rou



router.post("/check", authenticateToken, checkPageAccess);


router.post('/signup',signupUser)
router.post('/signin',signinUser)
router.delete("/delete", deleteUser);
router.get("/users", getAllUsers);



router.post('/vertical/add', addVertical);
router.delete('/vertical/:id', deleteVertical);
router.get('/vertical/getall', getAllVerticals);


router.post('/position/add', addPosition);
router.delete('/position/:id', deletePosition);
router.get('/position/getall', getAllPositions);



router.post('/page/add', addPage);
router.delete('/page/:id', deletePage);
router.get('/page/getall', getAllPages);


export default router;