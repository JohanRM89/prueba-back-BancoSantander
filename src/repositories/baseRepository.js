export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const newItem = new this.model(data);
      return await newItem.save();
    } catch (error) {
      throw new Error(`Error al crear: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error al buscar por id: ${error.message}`);
    }
  }

  async findOne(filter) {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      throw new Error(`Error al encontrar el dato: ${error.message}`);
    }
  }

  async findAll(filter = {}) {
    try {
      return await this.model.find(filter);
    } catch (error) {
      throw new Error(`Error al encontrar los datos: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { 
        new: true, 
        runValidators: true 
      });
    } catch (error) {
      throw new Error(`Error al actualziar: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eleiminar el dato: ${error.message}`);
    }
  }
}