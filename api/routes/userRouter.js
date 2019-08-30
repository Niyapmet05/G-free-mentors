import { Router } from 'express';
import db from '../controller/UserController';
import checkToken from '../middleware/token';

const router = Router();

//sign up
router.post('/POST/auth/signup', db.signUp);

//sign in
router.post('/POST/auth/signin', db.login);
export default router;