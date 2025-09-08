import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'El id del producto es obligatorio'],
    unique: true,
    match: [/^\d{6}$/, 'El id del producto debe tener 6 dígitos numéricos']
  },
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ['debit', 'credit'],
      message: 'El tipo debe ser debito o credito'
    }
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('products', productSchema);