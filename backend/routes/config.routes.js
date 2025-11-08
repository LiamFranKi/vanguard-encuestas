const express = require('express');
const router = express.Router();
const pool = require('../utils/database');
const authMiddleware = require('../middleware/auth');

// Obtener configuración (PÚBLICO)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM configuracion_sistema LIMIT 1'
    );

    if (result.rows.length === 0) {
      // Si no existe, crear configuración por defecto
      const insertResult = await pool.query(
        `INSERT INTO configuracion_sistema (nombre_sistema, descripcion_sistema, color_primario, color_secundario)
         VALUES ('Vanguard Encuestas', 'Tu opinión nos ayuda a mejorar la educación', '#1976d2', '#7c3aed')
         RETURNING *`
      );
      return res.json({
        success: true,
        configuracion: insertResult.rows[0]
      });
    }

    res.json({
      success: true,
      configuracion: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener configuración' 
    });
  }
});

// Actualizar configuración (ADMIN)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { 
      nombre_sistema, 
      descripcion_sistema, 
      color_primario, 
      color_secundario,
      email_sistema,
      telefono_sistema,
      direccion_sistema,
      logo
    } = req.body;

    // Verificar si existe configuración
    const existing = await pool.query('SELECT id FROM configuracion_sistema LIMIT 1');

    let result;

    if (existing.rows.length === 0) {
      // Crear si no existe
      result = await pool.query(
        `INSERT INTO configuracion_sistema 
         (nombre_sistema, descripcion_sistema, color_primario, color_secundario, email_sistema, telefono_sistema, direccion_sistema, logo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [nombre_sistema, descripcion_sistema, color_primario, color_secundario, email_sistema, telefono_sistema, direccion_sistema, logo]
      );
    } else {
      // Actualizar si existe
      result = await pool.query(
        `UPDATE configuracion_sistema 
         SET nombre_sistema = $1, descripcion_sistema = $2, color_primario = $3, color_secundario = $4,
             email_sistema = $5, telefono_sistema = $6, direccion_sistema = $7, logo = $8, updated_at = NOW()
         WHERE id = $9
         RETURNING *`,
        [nombre_sistema, descripcion_sistema, color_primario, color_secundario, email_sistema, telefono_sistema, direccion_sistema, logo, existing.rows[0].id]
      );
    }

    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      configuracion: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar configuración' 
    });
  }
});

module.exports = router;

