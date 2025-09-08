import { BaseRepository } from "./baseRepository.js";
import User from "../models/User.model.js";

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findById(userId) {
    try {
      return await this.model.findById(userId).select("-password");
    } catch (error) {
      throw new Error(`Error al encontrar al usuario  ${error.message}`);
    }
  }

  async findByUsername(username) {
    try {
      return await this.model.findOne({ username });
    } catch (error) {
      throw new Error(
        `Error al encontrar al usuario por el nombre  ${error.message}`
      );
    }
  }

  async userExists(userId) {
    try {
      const user = await this.model.findById(userId);
      return !!user;
    } catch (error) {
      throw new Error(
        `Error error al validar si el usuario existe ${error.message}`
      );
    }
  }

  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error al crear el usuario ${error.message}`);
    }
  }
  async findByRole(role) {
    try {
      return await this.model
        .find({ role, isActive: true })
        .select("-password");
    } catch (error) {
      throw new Error(`Error al encontrar por rol ${error.message}`);
    }
  }
}
