import { Router } from 'express';
import db from '../controller/UserController';
import sess from '../controller/UserController';
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

//Get all mentors
router.get('/GET/mentors/:mentorId', token, db.getMentor);

//create session
router.post('/POST/sessions', token, sess.createMentoshipReq);

//create session
router.patch('/PATCH/sessions/:sessionId/accept', token, sess.mentorAccept);

export default router;