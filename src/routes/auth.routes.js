import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { TokenService } from '../services/token.service.js';
import { UserRepository } from '../repositories/user.repository.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const userRepository = new UserRepository();
const tokenService = new TokenService();
const authService = new AuthService(userRepository, tokenService);
const authController = new AuthController(authService);

const router = express.Router();

// Rutas públicas
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refresh(req, res));

// Rutas protegidas
router.post('/logout', authenticateToken, (req, res) => authController.logout(req, res));
router.post('/create-client', authenticateToken, authorizeRoles('admin'), 
  (req, res) => authController.createClient(req, res));

export default router;