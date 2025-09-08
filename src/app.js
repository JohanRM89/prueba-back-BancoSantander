import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Importación de rutas 
import authRoutes from './routes/auth.routes.js';
import cardRoutes from './routes/card.routes.js';
import userRoutes from './routes/user.routes.js'; 


const app = express();

// Middlewares globales
app.use(cors()); 
app.use(express.json()); 

// Rutas base
app.use('/auth', authRoutes);
app.use('/card', cardRoutes);
app.use('/users', userRoutes); 
// Ruta de salud básica para probar el servidor 
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'El servidor esta corriendo' });
});

// Middleware para rutas no encontradas (404) 
app.use((req, res, next) => {
  res.status(404).json({ 
    status: 'error',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Middleware centralizado de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Error interno del servidor'
  });
});

export default app;
