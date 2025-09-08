export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    try {
      const { username, password } = req.body;

      const result = await this.authService.login(username, password);
      res
        .status(200)
        .json({ status: 200, message: "Atenticación correcta", data: result });
    } catch (error) {
      res.status(401).json({ status: 400, message: error.message });
    }
  };

  refresh = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          status: 400,
          message: "Refresh token requerido",
        });
      }

      const tokens = await this.authService.refreshTokens(refreshToken);
      res
        .status(200)
        .json({ status: 200, message: "Refresh realizado", data: tokens });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };

  logout = async (req, res) => {
    try {
      const result = await this.authService.logout(req.user.id);
      res
        .status(200)
        .json({ status: 200, message: "Logaut realizado", data: result });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };

  createClient = async (req, res) => {
    try {
      const userData = req.body;
      const newClient = await this.authService.createClientUser(userData);

      res.status(200).json({
        status: 200,
        message: "Cliente creado exitosamente",
        data: newClient,
      });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  };
}
