import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { UserRepository } from '../repositories/user.repository.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const router = express.Router();

// Todas las rutas requieren autenticación y ser admin
router.use(authenticateToken, authorizeRoles('admin'));

// Rutas de administración de clientes
router.get('/clients', (req, res) => userController.getAllClients(req, res));
router.get('/clients/:userId', (req, res) => userController.getClientById(req, res));
router.get('/clients/:userId/details', (req, res) => userController.getClientDetails(req, res));

export default router;