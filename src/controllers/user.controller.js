export class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getAllClients = async (req, res) => {
    try {
      const clients = await this.userRepository.findByRole("client");
      res.status(200).json({ status:200,message:'Dato obtenido', data:clients });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };

  getClientById = async (req, res) => {
    try {
      const { userId } = req.params;
      const client = await this.userRepository.findById(userId);

      if (!client || client.role !== "client") {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }

      res.status(200).json({ status:200,message:'Dato obtenido', data:client });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };

  getClientDetails = async (req, res) => {
    try {
      const { userId } = req.params;
      const client = await this.userRepository.findById(userId);

      if (!client || client.role !== "client") {
        return res
          .status(404)
          .json({ status: 400, message: "Cliente no encontrado" });
      }

      const clientDetails = {
        id: client._id,
        username: client.username,
        role: client.role,
        isActive: client.isActive,
        createdAt: client.createdAt,
      };

      res.status(200).json({
        status: 200,
        message: "Cliente encontrado",
        data: clientDetails,
      });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };
}
