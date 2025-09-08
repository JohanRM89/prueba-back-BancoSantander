import Card from "../models/Card.model.js";

export class CardFactory {
  constructor(productRepository, userRepository) {
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async createCard(cardData) {
    try {

      if (!cardData.userId) {
        throw new Error("El id del usuario es requerido");
      }
      const userExists = await this.userRepository.userExists(cardData.userId);

      if (!userExists) {
        throw new Error("Usuario no encontrado");
      }

      if (!cardData.cardHolder || cardData.cardHolder.split(" ").length < 2) {
        throw new Error("Debe incluir nombre y apellido del titular");
      }

      const product = await this.productRepository.findByProductId(
        cardData.productId
      );

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      const randomDigits = Math.floor(
        1000000000000000 + Math.random() * 9000000000000000
      );
      const cardNumber = randomDigits.toString();
      const balance =
        product.type === "debit" ? 0.0 : cardData.balance || 0.0;

      const card = new Card({
        ...cardData,
        cardNumber,
        balance,
        productType: product.type,
        isActive: false,
        isBlocked: false,
        currency: "USD",
      });

      return await card.save();
    } catch (error) {
      throw new Error(`Error al crear la tarjeta ${error.message}`);
    }
  }
}
