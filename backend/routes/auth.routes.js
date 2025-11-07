const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../utils/database');

// Login
router.post('/login', async (req, res) => {
  try {
    const { dni, clave } = req.body;

    if (!dni || !clave) {
      return res.status(400).json({ 
        success: false, 
        message: 'DNI y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const userResult = await pool.query(
      'SELECT * FROM usuarios WHERE dni = $1 AND activo = true',
      [dni]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const usuario = userResult.rows[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(clave, usuario.clave);

    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: usuario.id, 
        dni: usuario.dni, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        dni: usuario.dni,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor' 
    });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token no proporcionado' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Obtener datos actualizados del usuario
    const userResult = await pool.query(
      'SELECT id, dni, nombres, apellidos, email, rol FROM usuarios WHERE id = $1 AND activo = true',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      usuario: userResult.rows[0]
    });
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
});

module.exports = router;

