const express = require('express');
const router = express.Router();
const pool = require('../utils/database');
const authMiddleware = require('../middleware/auth');

// Obtener todos los grados activos (PÚBLICO)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM grados WHERE activo = true ORDER BY orden'
    );

    res.json({
      success: true,
      grados: result.rows
    });
  } catch (error) {
    console.error('Error al obtener grados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener grados' 
    });
  }
});

// Obtener todos los grados (ADMIN)
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM grados ORDER BY orden'
    );

    res.json({
      success: true,
      grados: result.rows
    });
  } catch (error) {
    console.error('Error al obtener grados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener grados' 
    });
  }
});

// Crear grado (ADMIN)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, nivel, orden, activo } = req.body;

    const result = await pool.query(
      `INSERT INTO grados (nombre, nivel, orden, activo)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombre, nivel, orden !== undefined ? orden : 999, activo !== undefined ? activo : true]
    );

    res.json({
      success: true,
      message: 'Grado creado exitosamente',
      grado: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear grado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear grado' 
    });
  }
});

// Actualizar grado (ADMIN)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, nivel, orden, activo } = req.body;

    const result = await pool.query(
      `UPDATE grados 
       SET nombre = $1, nivel = $2, orden = $3, activo = $4
       WHERE id = $5
       RETURNING *`,
      [nombre, nivel, orden, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Grado no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Grado actualizado exitosamente',
      grado: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar grado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar grado' 
    });
  }
});

// Eliminar grado (ADMIN)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM grados WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Grado no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Grado eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar grado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar grado' 
    });
  }
});

module.exports = router;
