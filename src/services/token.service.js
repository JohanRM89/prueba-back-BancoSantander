import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export class TokenService {
  generateAccessToken(user) {
    return jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { 
        id: user._id,
        type: 'refresh' 
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token de acceso inválido');
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Token de refresh inválido');
    }
  }

  async updateUserRefreshToken(userId, refreshToken) {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { refreshToken },
        { new: true }
      );
    } catch (error) {
      throw new Error('Error al actualizar el refresh token');
    }
  }

  async findUserByRefreshToken(refreshToken) {
    try {
      return await User.findOne({ refreshToken }).select('-password');
    } catch (error) {
      throw new Error('Error al encontrar el usuario mediante el refresh token');
    }
  }
}