import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import bcrypt from "bcrypt";

export const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("El usuario admin ya existe en la BD");
      return;
    }
    const adminUser = new User({
      username: "admin",
      password: "admin123",
      name:"super admin",
      role: "admin",
      isActive: true,
    });
    await adminUser.save();
    console.log("Se creo el usuario correctamente");
  } catch (error) {
    console.log("Error al crear el suario admin ", error.message);
  }
};

export const seedProducts = async () => {
  try {
    const products = [
      {
        productId: "123456",
        name: "Tarjeta Débito Oro",
        type: "debit",
        description: "Tarjeta de débito premium",
      },
      {
        productId: "654321",
        name: "Tarjeta Crédito Platinum",
        type: "credit",
        description: "Tarjeta de crédito alta gama",
      },
    ];

    for (const productData of products) {
      const existingProduct = await Product.findOne({
        productId: productData.productId,
      });
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        console.log(`Producto creado: ${productData.name}`);
      }
    }
  } catch (error) {
    console.error(" Error al crear los productos", error.message);
  }
};
