const express = require('express');
const router = express.Router();
const pool = require('../utils/database');
const authMiddleware = require('../middleware/auth');

// Obtener todas las encuestas (PÚBLICO - solo activas)
router.get('/publicas', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, titulo, descripcion, fecha_inicio, fecha_fin, solicitar_grado 
       FROM encuestas 
       WHERE estado = 'activa' 
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      encuestas: result.rows
    });
  } catch (error) {
    console.error('Error al obtener encuestas públicas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener encuestas' 
    });
  }
});

// Obtener todas las encuestas (ADMIN)
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, u.nombres, u.apellidos,
       (SELECT COUNT(*) FROM respuestas WHERE encuesta_id = e.id) as total_respuestas
       FROM encuestas e
       LEFT JOIN usuarios u ON e.created_by = u.id
       ORDER BY e.created_at DESC`
    );

    res.json({
      success: true,
      encuestas: result.rows
    });
  } catch (error) {
    console.error('Error al obtener encuestas admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener encuestas' 
    });
  }
});

// Obtener una encuesta por ID (PÚBLICO)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const encuestaResult = await pool.query(
      'SELECT * FROM encuestas WHERE id = $1',
      [id]
    );

    if (encuestaResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Encuesta no encontrada' 
      });
    }

    const preguntasResult = await pool.query(
      'SELECT * FROM preguntas WHERE encuesta_id = $1 ORDER BY orden',
      [id]
    );

    res.json({
      success: true,
      encuesta: encuestaResult.rows[0],
      preguntas: preguntasResult.rows
    });
  } catch (error) {
    console.error('Error al obtener encuesta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener encuesta' 
    });
  }
});

// Crear encuesta (ADMIN)
router.post('/', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { 
      titulo, 
      descripcion, 
      fecha_inicio, 
      fecha_fin, 
      solicitar_grado, 
      mensaje_agradecimiento, 
      preguntas 
    } = req.body;

    // Insertar encuesta
    const encuestaResult = await client.query(
      `INSERT INTO encuestas (titulo, descripcion, fecha_inicio, fecha_fin, solicitar_grado, mensaje_agradecimiento, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [titulo, descripcion, fecha_inicio, fecha_fin, solicitar_grado, mensaje_agradecimiento, req.usuario.id]
    );

    const encuesta = encuestaResult.rows[0];

    // Insertar preguntas
    if (preguntas && preguntas.length > 0) {
      for (let i = 0; i < preguntas.length; i++) {
        const p = preguntas[i];
        await client.query(
          `INSERT INTO preguntas (encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [encuesta.id, i + 1, p.texto_pregunta, p.subtitulo, p.tipo_respuesta, p.obligatoria, JSON.stringify(p.opciones)]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Encuesta creada exitosamente',
      encuesta
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear encuesta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear encuesta' 
    });
  } finally {
    client.release();
  }
});

// Cambiar estado de encuesta (ADMIN)
router.patch('/:id/estado', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['borrador', 'activa', 'cerrada'].includes(estado)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estado inválido' 
      });
    }

    const result = await pool.query(
      'UPDATE encuestas SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Encuesta no encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Estado actualizado',
      encuesta: result.rows[0]
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cambiar estado' 
    });
  }
});

// Actualizar encuesta (ADMIN)
router.put('/:id', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { 
      titulo, 
      descripcion, 
      fecha_inicio, 
      fecha_fin, 
      solicitar_grado, 
      mensaje_agradecimiento, 
      preguntas 
    } = req.body;

    // Actualizar encuesta
    const encuestaResult = await client.query(
      `UPDATE encuestas 
       SET titulo = $1, descripcion = $2, fecha_inicio = $3, fecha_fin = $4, 
           solicitar_grado = $5, mensaje_agradecimiento = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [titulo, descripcion, fecha_inicio, fecha_fin, solicitar_grado, mensaje_agradecimiento, id]
    );

    if (encuestaResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        success: false, 
        message: 'Encuesta no encontrada' 
      });
    }

    // Eliminar preguntas existentes
    await client.query('DELETE FROM preguntas WHERE encuesta_id = $1', [id]);

    // Insertar preguntas nuevas
    if (preguntas && preguntas.length > 0) {
      for (let i = 0; i < preguntas.length; i++) {
        const p = preguntas[i];
        await client.query(
          `INSERT INTO preguntas (encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [id, i + 1, p.texto_pregunta, p.subtitulo, p.tipo_respuesta, p.obligatoria, JSON.stringify(p.opciones)]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Encuesta actualizada exitosamente',
      encuesta: encuestaResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar encuesta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar encuesta' 
    });
  } finally {
    client.release();
  }
});

// Eliminar encuesta (ADMIN)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM encuestas WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Encuesta no encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Encuesta eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar encuesta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar encuesta' 
    });
  }
});

module.exports = router;

