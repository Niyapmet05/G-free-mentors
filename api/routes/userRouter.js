import { Router } from 'express';
import db from '../controller/UserController';
import checkToken from '../middleware/token';

const router = Router();

//sign up
router.post('/POST/auth/signup', db.signUp);

//sign in
router.post('/POST/auth/signin', db.login);

//change a user to amentor
router.patch('/PATCH/user/:userId', checkToken, db.changeToMentor);


export default router;