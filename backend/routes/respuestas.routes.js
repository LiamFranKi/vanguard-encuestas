const express = require('express');
const router = express.Router();
const pool = require('../utils/database');
const authMiddleware = require('../middleware/auth');

// Guardar respuesta de encuesta (PÚBLICO)
router.post('/guardar', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { encuesta_id, grado_seleccionado, respuestas, ip_address, user_agent } = req.body;

    // Obtener IP real del usuario (considerando proxy de Nginx)
    const userIp = ip_address || req.headers['x-forwarded-for']?.split(',')[0] || req.ip;

    // Verificar si esta IP ya respondió esta encuesta
    const checkDuplicate = await client.query(
      'SELECT id FROM respuestas WHERE encuesta_id = $1 AND ip_address = $2',
      [encuesta_id, userIp]
    );

    if (checkDuplicate.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Ya has respondido esta encuesta anteriormente. Solo se permite una respuesta por persona.'
      });
    }

    // Insertar respuesta principal
    const respuestaResult = await client.query(
      `INSERT INTO respuestas (encuesta_id, grado_seleccionado, ip_address, user_agent)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [encuesta_id, grado_seleccionado, userIp, user_agent]
    );

    const respuestaId = respuestaResult.rows[0].id;

    // Insertar respuestas de cada pregunta
    for (const r of respuestas) {
      await client.query(
        `INSERT INTO respuestas_detalle (respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          respuestaId,
          r.pregunta_id,
          r.texto_respuesta || null,
          r.valor_numerico || null,
          r.opciones_seleccionadas ? JSON.stringify(r.opciones_seleccionadas) : null
        ]
      );
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Respuesta guardada exitosamente',
      respuesta_id: respuestaId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al guardar respuesta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar respuesta' 
    });
  } finally {
    client.release();
  }
});

// Borrar todas las respuestas de una encuesta (ADMIN)
router.delete('/encuesta/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM respuestas WHERE encuesta_id = $1',
      [id]
    );

    res.json({
      success: true,
      message: `${result.rowCount} respuestas eliminadas correctamente`
    });
  } catch (error) {
    console.error('Error al eliminar respuestas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar respuestas' 
    });
  }
});

module.exports = router;

