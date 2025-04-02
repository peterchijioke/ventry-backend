import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginDto } from '../dtos/LoginDto';
import { SignupDto } from '../dtos/SignupDto';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';

const router = Router();

router.post('/signup', validateDto(SignupDto), AuthController.signup);
router.post('/login', validateDto(LoginDto), AuthController.login);
router.get('/me', authenticateJWT, AuthController.getMe);

export default router;