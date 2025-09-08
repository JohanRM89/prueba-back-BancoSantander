import mongoose from "mongoose";
const cardSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: String,
      required: [true, "El número de tarjeta es obligatorio"],
      unique: true,
      match: [
        /^\d{16}$/,
        "El número de tarjeta debe tener 16 dígitos numéricos",
      ],
      immutable: true,
    },
    productId: {
      type: String,
      required: [true, "El id de producto es obligatorio"],
      match: [/^\d{6}$/, "El productId debe tener 6 dígitos numéricos"],
      immutable: true,
    },
    cardHolder: {
      type: String,
      required: [true, "El nombre del titular es obligatorio"],
      trim: true,
      validate: {
        validator: function (value) {
          return value.split(" ").length >= 2;
        },
        message: "Debe incluir al menos primer nombre y apellido",
      },
    },
    expirationDate: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0.0,
      min: [0, "El saldo no puede ser negativo"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: "USD",
      enum: {
        values: ["USD"],
        message: "Solo se permiten dólares",
      },
      immutable: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario titular es obligatorio"],
    },
  },
  { timestamps: true }
);
cardSchema.methods.activate = function() {
  this.isActive = true;
  return this.save();
};
cardSchema.methods.block = function() {
  this.isBlocked = true;
  this.isActive = false; 
  return this.save();
};

cardSchema.statics.generateCardNumber = function(productId) {
  if (!/^\d{6}$/.test(productId)) {
    throw new Error('ProductId debe tener 6 dígitos');
  }
    const randomDigits = Math.random().toString().substring(2, 12);
  return productId + randomDigits;
};

cardSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    const expiration = new Date();
    expiration.setFullYear(now.getFullYear() + 3);
    
    const month = (expiration.getMonth() + 1).toString().padStart(2, '0');
    const year = expiration.getFullYear().toString();
    
    this.expirationDate = `${month}/${year}`;
  }
  next();
});
export default mongoose.model('cards', cardSchema);
