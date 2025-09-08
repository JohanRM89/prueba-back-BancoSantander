import bcrypt from "bcrypt";
import { TokenService } from "./token.service.js";

export class AuthService {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async login(username, password) {
    try {
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        throw new Error("Usuario no registrado en la pagina");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Credenciales inválidas ");
      }

      if (!user.isActive) {
        throw new Error("Usuario desactivado");
      }
      const accessToken = this.tokenService.generateAccessToken(user);
      const refreshToken = this.tokenService.generateRefreshToken(user);
      await this.tokenService.updateUserRefreshToken(user._id, refreshToken);

      return {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error) {
      throw new Error(`Error al iniciar sesión ${error.message}`);
    }
  }

  async refreshTokens(refreshToken) {
    try {
      const decoded = this.tokenService.verifyRefreshToken(refreshToken);

      const user = await this.tokenService.findUserByRefreshToken(refreshToken);
      if (!user || user._id.toString() !== decoded.id) {
        throw new Error("Refresh token inválido");
      }
      const newAccessToken = this.tokenService.generateAccessToken(user);
      const newRefreshToken = this.tokenService.generateRefreshToken(user);
      await this.tokenService.updateUserRefreshToken(user._id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error(`Refresh falla  ${error.message}`);
    }
  }

  async logout(userId) {
    try {
      await this.tokenService.updateUserRefreshToken(userId, null);
      return { message: "Logout exitoso" };
    } catch (error) {
      throw new Error(`Falla en el cierre ${error.message}`);
    }
  }

  async createClientUser(userData) {
    try {
      const existingUser = await this.userRepository.findByUsername(
        userData.username
      );
      if (existingUser) {
        throw new Error("El nombre de usuario ya existe");
      }
      const user = await this.userRepository.createUser({
        ...userData,
        role: "client",
        isActive: true,
      });

      return {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      };
    } catch (error) {
      throw new Error(`Error al crear el cliente ${error.message}`);
    }
  }
}
