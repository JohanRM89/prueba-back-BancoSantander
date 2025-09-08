import { CardFactory } from "../factories/cardFactory.js";
import {
  ValidationStrategy,
  CardNumberValidator,
  CardHolderValidator,
} from "../strategies/validationStrategy.js";
import { withLogging } from "../decorators/logginDecorator.js";

export class CardService {
  constructor(cardRepository, productRepository, userRepository) {
    this.cardRepository = cardRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
    this.cardFactory = new CardFactory(
      productRepository,
      userRepository
    );
    this.validationStrategy = new ValidationStrategy([
      new CardNumberValidator(),
      new CardHolderValidator(),
    ]);
  }

  async generateCardNumber(productId) {
    const product = await this.productRepository.findByProductId(productId);
    if (!product) {
      throw new Error(`Producto con ID ${productId} no encontrado`);
    }
    const randomDigits = Math.random().toString().substring(2, 12);
    const cardNumber = productId + randomDigits;
    return cardNumber;
  }

  async createCard(cardData) {
    try {
      const userExists = await this.userRepository.userExists(cardData.userId);
      if (!userExists) {
        throw new Error("Usuario no encontrado");
      }
      await this.validationStrategy.validate(cardData);
      return await this.cardFactory.createCard(cardData);
    } catch (error) {
      throw new Error(`Error al crear la tarjeta ${error.message}`);
    }
  }

  async activateCard(cardId) {
    const card = await this.cardRepository.findById(cardId);
    if (!card) throw new Error("Tarjeta no encontrada");
    if (card.isBlocked)
      throw new Error("No se puede activar una tarjeta bloqueda");

    const activatedCard = await this.cardRepository.activateCard(cardId);
    return activatedCard;
  }

  async blockCard(cardId, isAdmin = false) {
    const card = await this.cardRepository.findById(cardId);
    if (!card) throw new Error("Tarjeta no encontrada");
    if (!isAdmin && card.userId.toString() !== userId.toString()) {
      throw new Error("No tienes permisos para bloquear la tarjeta");
    }

    const blockedCard = await this.cardRepository.blockCard(cardId);
    return blockedCard;
  }
  async getCardDetails(cardId) {
    const card = await this.cardRepository.findById(cardId);

    if (!card) {
      throw new Error("Tarjeta no encontrada");
    }
    return card;
  }
  async getCardsByUser(userId) {
    const userExists = await this.userRepository.userExists(userId);
    if (!userExists) {
      throw new Error("Usuario no encontrado");
    }
    return await this.cardRepository.findByUserId(userId);
  }

  async getAllCards() {
    return await this.cardRepository.findAll();
  }
}

export const CardServiceWithLogging = withLogging(CardService);
