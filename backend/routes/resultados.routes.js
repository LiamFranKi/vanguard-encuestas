const express = require('express');
const router = express.Router();
const pool = require('../utils/database');
const authMiddleware = require('../middleware/auth');

// Obtener resultados de una encuesta (ADMIN)
router.get('/encuesta/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener información de la encuesta
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

    const encuesta = encuestaResult.rows[0];

    // Total de respuestas
    const totalResult = await pool.query(
      'SELECT COUNT(*) as total FROM respuestas WHERE encuesta_id = $1',
      [id]
    );

    const totalRespuestas = parseInt(totalResult.rows[0].total);

    // Respuestas por grado
    const gradosResult = await pool.query(
      `SELECT grado_seleccionado, COUNT(*) as cantidad 
       FROM respuestas 
       WHERE encuesta_id = $1 AND grado_seleccionado IS NOT NULL
       GROUP BY grado_seleccionado
       ORDER BY cantidad DESC`,
      [id]
    );

    // Obtener preguntas
    const preguntasResult = await pool.query(
      'SELECT * FROM preguntas WHERE encuesta_id = $1 ORDER BY orden',
      [id]
    );

    const preguntas = preguntasResult.rows;

    // Procesar resultados por pregunta
    const resultadosPreguntas = [];

    for (const pregunta of preguntas) {
      const resultado = {
        pregunta_id: pregunta.id,
        orden: pregunta.orden,
        texto_pregunta: pregunta.texto_pregunta,
        tipo_respuesta: pregunta.tipo_respuesta,
        opciones: pregunta.opciones,
        datos: {}
      };

      if (pregunta.tipo_respuesta === 'marcar' || pregunta.tipo_respuesta === 'lista') {
        // Contar respuestas por opción
        const opcionesResult = await pool.query(
          `SELECT opciones_seleccionadas 
           FROM respuestas_detalle 
           WHERE pregunta_id = $1 AND opciones_seleccionadas IS NOT NULL`,
          [pregunta.id]
        );

        const conteo = {};
        opcionesResult.rows.forEach(row => {
          const opciones = row.opciones_seleccionadas;
          if (Array.isArray(opciones)) {
            opciones.forEach(opcion => {
              conteo[opcion] = (conteo[opcion] || 0) + 1;
            });
          }
        });

        resultado.datos = conteo;

      } else if (pregunta.tipo_respuesta === 'escala') {
        // Calcular promedio y distribución
        const escalaResult = await pool.query(
          `SELECT valor_numerico, COUNT(*) as cantidad 
           FROM respuestas_detalle 
           WHERE pregunta_id = $1 AND valor_numerico IS NOT NULL
           GROUP BY valor_numerico
           ORDER BY valor_numerico`,
          [pregunta.id]
        );

        const distribucion = {};
        let suma = 0;
        let total = 0;

        escalaResult.rows.forEach(row => {
          distribucion[row.valor_numerico] = parseInt(row.cantidad);
          suma += row.valor_numerico * row.cantidad;
          total += parseInt(row.cantidad);
        });

        resultado.datos = {
          distribucion,
          promedio: total > 0 ? (suma / total).toFixed(2) : 0,
          total
        };

      } else if (pregunta.tipo_respuesta === 'texto_corto' || pregunta.tipo_respuesta === 'texto_largo') {
        // Obtener todas las respuestas de texto
        const textoResult = await pool.query(
          `SELECT texto_respuesta, r.fecha_respuesta 
           FROM respuestas_detalle rd
           JOIN respuestas r ON rd.respuesta_id = r.id
           WHERE rd.pregunta_id = $1 AND rd.texto_respuesta IS NOT NULL
           ORDER BY r.fecha_respuesta DESC`,
          [pregunta.id]
        );

        resultado.datos = {
          respuestas: textoResult.rows
        };
      }

      resultadosPreguntas.push(resultado);
    }

    res.json({
      success: true,
      encuesta,
      totalRespuestas,
      respuestasPorGrado: gradosResult.rows,
      resultadosPreguntas
    });
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener resultados' 
    });
  }
});

module.exports = router;

