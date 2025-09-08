import mongoose from 'mongoose';
import { seedAdminUser, seedProducts } from './seed.js';

const connectionOptions = {
  maxPoolSize: 10, 
  serverSelectionTimeoutMS: 5000, 
  socketTimeoutMS: 45000, 
};

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB ya está conectado');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
    
    await seedProducts();
    await seedAdminUser();

  } catch (error) {
    console.error(' Error al conectar MongoDB:', error.message);
    process.exit(1); 
  }
};

// Manejo de cierre graceful
export const disconnectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log(' MongoDB conexión cerrada');
  }
};

// Event listeners para manejo de errores de conexión
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error en la conexión:', error);
});