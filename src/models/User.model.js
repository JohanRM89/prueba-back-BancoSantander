import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "El usuario  es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "El usuario debe tener al menos 3 caracteres"],
    },
    name: {
      type: String,
      required: [true, "El nombre  es obligatorio"],
      trim: true,
      lowercase: true,
      minlength: [5, "El nombre debe tener al menos 5 caracteres"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["admin", "client"],
        message: "El rol {VALUE} no es válido. Use: admin o client",
      },
      default: "client",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
export default mongoose.model("users", userSchema);
