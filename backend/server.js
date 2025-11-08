require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware de seguridad
app.use(helmet());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Límite de requests
  message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde',
  trustProxy: true
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logger
app.use(morgan('combined'));

// Trust proxy
app.set('trust proxy', 1);

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/encuestas', require('./routes/encuestas.routes'));
app.use('/api/respuestas', require('./routes/respuestas.routes'));
app.use('/api/resultados', require('./routes/resultados.routes'));
app.use('/api/grados', require('./routes/grados.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/config', require('./routes/config.routes'));

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor' 
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS habilitado para: ${process.env.CORS_ORIGIN}`);
});

