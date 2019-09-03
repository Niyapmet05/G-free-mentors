import { Router } from 'express';
import db from '../controller/UserController';
import sess from '../controller/UserController';
import token from '../middleware/token';

const router = Router();

//sign up
router.post('/auth/signup', db.signUp);

//sign in
router.post('/auth/signin', db.login);

//change a user to amentor
router.patch('/user/:userId', token, db.changeToMentor);

//Get all mentors
router.get('/mentors', token, db.getAllMentors);

//Get users only
router.get('/users', token, db.getUsersOnly);

//Get all users
router.get('/all', token, db.getAllUsers);

//Get a specific mentor
router.get('/mentors/:mentorId', token, db.getMentor);

//create  mentorship session request
router.post('/sessions', token, sess.createMentoshipReq);

//accept mentorship session request
router.patch('/sessions/:sessionId/accept', token, sess.mentorAccept);

//reject mentorship session request
router.patch('/sessions/:sessionId/reject', token, sess.mentorReject);

//Get user sessions
router.get('/sessions', token, sess.getUserSessions);

//Get mentor sessions
router.get('/sessions', token, sess.getMentorSessions);

//accept mentorship session request
router.post('/sessions/:sessionId/review', token, sess.SessionReview);

//delete session
router.delete('/sessions/:sessionId/review', token, sess.deleteSes);

export default router;