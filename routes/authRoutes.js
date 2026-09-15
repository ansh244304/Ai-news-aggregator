import router from 'express';
import { register, login, forgotPassword } from '../services/authService.js';
const router = express.Router();

// Register route
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

