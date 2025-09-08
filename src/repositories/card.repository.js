import { BaseRepository } from "./baseRepository.js";
import Card from "../models/Card.model.js";

export class CardRepository extends BaseRepository {
  constructor() {
    super(Card);
  }

  async findByCardNumber(cardNumber) {
    try {
      return await this.model.findOne({ cardNumber });
    } catch (error) {
      throw new Error(`Error al buscar la tarjeta: ${error.message}`);
    }
  }

  async findByUserId(userId) {
    try {
      return await this.model.find({ userId, isBlocked: false });
    } catch (error) {
      throw new Error(
        `Error al buscar por el id del usuario: ${error.message}`
      );
    }
  }

  async findActiveCards() {
    try {
      return await this.model.find({ isActive: true, isBlocked: false });
    } catch (error) {
      throw new Error(`Error al buscar las tarjetas activas: ${error.message}`);
    }
  }
  async findById(cardId) {
    try {
      return await this.model.find({
        _id: cardId,
        isActive: true,
        isBlocked: false,
      });
    } catch (error) {
      throw new Error(`Error al buscar el detalle ${error.message}`);
    }
  }

  async blockCard(cardId) {
    try {
      const card = await this.model.findById(cardId);

      if (!card) {
        throw new Error("Tarjeta no encontrada");
      }

      const updatedCard = await this.model.findByIdAndUpdate(
        cardId,
        {
          isBlocked: !card.isBlocked,
          isActive: card.isBlocked ? true : false,
        },
        { new: true }
      );

      return updatedCard;
    } catch (error) {
      throw new Error(
        `Error al bloquear/desbloquear la tarjeta: ${error.message}`
      );
    }
  }

  async activateCard(cardId) {
    try {
      const card = await this.model.findById(cardId);

      if (!card) {
        throw new Error("Tarjeta no encontrada");
      }
      const activateCard = await this.model.findByIdAndUpdate(
        cardId,
        {
          isActive: !card.isActive,
        },
        { new: true }
      );

      return activateCard
    } catch (error) {
      throw new Error(`Error al activar la tarjeta :  ${error.message}`);
    }
  }
}
