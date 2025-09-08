import { BaseRepository } from './baseRepository.js';
import Product from '../models/Product.model.js';

export class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async findByProductId(productId) {
    try {
      return await this.model.findOne({ productId, isActive: true });
    } catch (error) {
      throw new Error(`Error al encontrar el producto ${error.message}`);
    }
  }

  async findActiveProducts() {
    try {
      return await this.model.find({ isActive: true });
    } catch (error) {
      throw new Error(`Error al activar el producto: ${error.message}`);
    }
  }
}