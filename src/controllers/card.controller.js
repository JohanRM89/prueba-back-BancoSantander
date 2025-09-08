export class CardController {
  constructor(cardService) {
    this.cardService = cardService;
  }

  generateNumber = async (req, res) => {
    try {
      const { productId } = req.params;
      const cardNumber = await this.cardService.generateCardNumber(productId);
      res.status(200).json({
        status: 200,
        message: "Número creado",
        data: cardNumber,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  };

  createCard = async (req, res) => {
    try {
      const cardData = req.body;
      const newCard = await this.cardService.createCard(cardData);
      res.status(200).json({
        status: 200,
        message: "Tarjeta creada exitosamente",
        card: newCard,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  };

  activateCard = async (req, res) => {
    try {
      const { cardId } = req.body;
      const activatedCard = await this.cardService.activateCard(cardId);
      const message = activatedCard.isActive
        ? " Tarjeta activda exitosamente"
        : " Tarjeta inactiva exitosamente";
      res.status(200).json({
        status: 200,
        message,
        data: activatedCard,
      });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };

  blockCard = async (req, res) => {
    try {
      const { cardId } = req.params;
      const isAdmin = req.user.role === "admin";

      const blockedCard = await this.cardService.blockCard(cardId, isAdmin);
      const message = blockedCard.isBlocked
        ? " Tarjeta bloqueada exitosamente"
        : " Tarjeta desbloqueada exitosamente";
      res.status(200).json({
        status: 200,
        message,
        data: blockedCard,
      });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };

  getMyCards = async (req, res) => {
    try {
      const userId = req.user.id;
      const cards = await this.cardService.getCardsByUser(userId);
      res.status(200).json({
        status: 200,
        message: "Datos encontrados",
        data: cards,
      });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };

  getCardsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const cards = await this.cardService.getCardsByUser(userId);
      res
        .status(200)
        .json({ status: 200, message: "Dato encontrado", data: cards });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };

  getAllCards = async (req, res) => {
    try {
      const cards = await this.cardService.getAllCards();
      res
        .status(200)
        .json({ status: 200, message: "Datos encontrados", data: cards });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };

  getCardDetails = async (req, res) => {
    try {
      const { cardId } = req.params;
      const card = await this.cardService.getCardDetails(cardId);
      res
        .status(200)
        .json({ status: 200, message: "Dato encontado", data: card });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };
}
