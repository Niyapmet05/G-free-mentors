import { Router } from 'express';
import db from '../controller/UserController';
import checkToken from '../middleware/token';

const router = Router();

router.post('/POST/auth/signup', db.signUp);
export default router;