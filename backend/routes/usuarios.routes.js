const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../utils/database');
const authMiddleware = require('../middleware/auth');

// Obtener todos los usuarios (ADMIN)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, dni, nombres, apellidos, email, rol, activo, created_at FROM usuarios ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      usuarios: result.rows
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener usuarios' 
    });
  }
});

// Crear usuario (ADMIN)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { dni, nombres, apellidos, email, clave } = req.body;

    // Validar DNI único
    const existente = await pool.query(
      'SELECT id FROM usuarios WHERE dni = $1',
      [dni]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con ese DNI'
      });
    }

    // Generar hash de contraseña
    const hashedPassword = await bcrypt.hash(clave, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (dni, nombres, apellidos, email, clave, rol, activo)
       VALUES ($1, $2, $3, $4, $5, 'Administrador', true)
       RETURNING id, dni, nombres, apellidos, email, rol, activo, created_at`,
      [dni, nombres, apellidos, email, hashedPassword]
    );

    res.json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear usuario' 
    });
  }
});

// Actualizar usuario (ADMIN)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { dni, nombres, apellidos, email, clave, activo } = req.body;

    // Validar DNI único (excepto el mismo usuario)
    const existente = await pool.query(
      'SELECT id FROM usuarios WHERE dni = $1 AND id != $2',
      [dni, id]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro usuario con ese DNI'
      });
    }

    let query, params;

    // Si se proporciona nueva contraseña, actualizarla
    if (clave && clave.trim() !== '') {
      const hashedPassword = await bcrypt.hash(clave, 10);
      query = `UPDATE usuarios 
               SET dni = $1, nombres = $2, apellidos = $3, email = $4, clave = $5, activo = $6, updated_at = NOW()
               WHERE id = $7
               RETURNING id, dni, nombres, apellidos, email, rol, activo, created_at`;
      params = [dni, nombres, apellidos, email, hashedPassword, activo, id];
    } else {
      // No actualizar contraseña
      query = `UPDATE usuarios 
               SET dni = $1, nombres = $2, apellidos = $3, email = $4, activo = $5, updated_at = NOW()
               WHERE id = $6
               RETURNING id, dni, nombres, apellidos, email, rol, activo, created_at`;
      params = [dni, nombres, apellidos, email, activo, id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar usuario' 
    });
  }
});

// Eliminar usuario (ADMIN)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir eliminar el último usuario
    const countResult = await pool.query('SELECT COUNT(*) as total FROM usuarios WHERE activo = true');
    if (parseInt(countResult.rows[0].total) <= 1) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar el último usuario activo del sistema'
      });
    }

    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar usuario' 
    });
  }
});

module.exports = router;

