import express from 'express';
import { CardController } from '../controllers/card.controller.js';
import { CardService } from '../services/card.service.js';
import { CardRepository } from '../repositories/card.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const cardRepository = new CardRepository();
const productRepository = new ProductRepository();
const userRepository = new UserRepository();

const cardService = new CardService(
  cardRepository,      
  productRepository,   
  userRepository       
);
const cardController = new CardController(cardService);



const router = express.Router();
// TODAS las rutas requieren ser ADMIN
router.use(authenticateToken, authorizeRoles('admin'));

// Rutas de administración
router.get('/:productId/number', (req, res) => cardController.generateNumber(req, res));
router.post('/create', (req, res) => cardController.createCard(req, res));
router.post('/enroll', (req, res) => cardController.activateCard(req, res));
router.delete('/:cardId', (req, res) => cardController.blockCard(req, res));
router.get('/user/:userId', (req, res) => cardController.getCardsByUser(req, res));
router.get('/all', (req, res) => cardController.getAllCards(req, res));
router.get('/details/:cardId', (req, res) => cardController.getCardDetails(req, res));


export default router;