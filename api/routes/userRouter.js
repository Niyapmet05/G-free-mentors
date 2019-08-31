import { Router } from 'express';
import db from '../controller/UserController';
import token from '../middleware/token';

const router = Router();

//sign up
router.post('/POST/auth/signup', db.signUp);

//sign in
router.post('/POST/auth/signin', db.login);

//change a user to amentor
router.patch('/PATCH/user/:userId', token, db.changeToMentor);

//Get all mentors
router.get('/GET/mentors', token, db.getAllMentors);

//Get all users
router.get('/GET/users', token, db.getAllUsers);

export default router;