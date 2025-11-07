import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEncuesta, getGrados, guardarRespuesta } from '../services/api';
import Swal from 'sweetalert2';
import './EncuestaForm.css';

const EncuestaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [encuesta, setEncuesta] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [paso, setPaso] = useState(1); // 1: Grado, 2: Preguntas
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarEncuesta();
  }, [id]);

  const cargarEncuesta = async () => {
    try {
      const [encuestaData, gradosData] = await Promise.all([
        getEncuesta(id),
        getGrados()
      ]);

      setEncuesta(encuestaData.encuesta);
      setPreguntas(encuestaData.preguntas);
      setGrados(gradosData.grados);

      // Si no solicita grado, ir directo a preguntas
      if (!encuestaData.encuesta.solicitar_grado) {
        setPaso(2);
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la encuesta', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleContinuar = () => {
    if (encuesta.solicitar_grado && !gradoSeleccionado) {
      Swal.fire('Atención', 'Por favor selecciona un grado', 'warning');
      return;
    }
    setPaso(2);
  };

  const handleRespuestaChange = (preguntaId, valor, tipo) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: { tipo, valor }
    }));
  };

  const handleCheckboxChange = (preguntaId, opcion) => {
    const actual = respuestas[preguntaId]?.valor || [];
    let nuevo;
    
    if (actual.includes(opcion)) {
      nuevo = actual.filter(o => o !== opcion);
    } else {
      nuevo = [...actual, opcion];
    }
    
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: { tipo: 'marcar', valor: nuevo }
    }));
  };

  const validarRespuestas = () => {
    for (const pregunta of preguntas) {
      if (pregunta.obligatoria) {
        const respuesta = respuestas[pregunta.id];
        if (!respuesta || !respuesta.valor || 
            (Array.isArray(respuesta.valor) && respuesta.valor.length === 0)) {
          return { valido: false, mensaje: `La pregunta "${pregunta.texto_pregunta}" es obligatoria` };
        }
      }
    }
    return { valido: true };
  };

  const handleEnviar = async () => {
    const validacion = validarRespuestas();
    if (!validacion.valido) {
      Swal.fire('Atención', validacion.mensaje, 'warning');
      return;
    }

    setEnviando(true);

    try {
      const respuestasFormateadas = preguntas.map(pregunta => {
        const respuesta = respuestas[pregunta.id];
        
        return {
          pregunta_id: pregunta.id,
          texto_respuesta: pregunta.tipo_respuesta.includes('texto') ? respuesta?.valor : null,
          valor_numerico: pregunta.tipo_respuesta === 'escala' ? respuesta?.valor : null,
          opciones_seleccionadas: (pregunta.tipo_respuesta === 'marcar' || pregunta.tipo_respuesta === 'lista') 
            ? (Array.isArray(respuesta?.valor) ? respuesta.valor : [respuesta?.valor]) 
            : null
        };
      });

      await guardarRespuesta({
        encuesta_id: parseInt(id),
        grado_seleccionado: gradoSeleccionado || null,
        respuestas: respuestasFormateadas,
        ip_address: null,
        user_agent: navigator.userAgent
      });

      navigate('/gracias', { state: { mensaje: encuesta.mensaje_agradecimiento } });
    } catch (error) {
      const mensaje = error.response?.data?.message || 'No se pudo guardar la respuesta';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonText: 'Entendido'
      });
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando encuesta...</p>
      </div>
    );
  }

  return (
    <div className="encuesta-form-page">
      <div className="container">
        {paso === 1 && encuesta.solicitar_grado && (
          <div className="grado-selector">
            <h2>Selecciona el grado de tu hijo(a)</h2>
            <div className="form-group">
              <select
                className="form-control"
                value={gradoSeleccionado}
                onChange={(e) => setGradoSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar grado...</option>
                {grados.map(grado => (
                  <option key={grado.id} value={grado.nombre}>
                    {grado.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary btn-block" onClick={handleContinuar}>
              Continuar →
            </button>
          </div>
        )}

        {paso === 2 && (
          <div className="preguntas-container">
            <h1 className="encuesta-titulo-main">{encuesta.titulo}</h1>
            <p className="encuesta-descripcion-main">{encuesta.descripcion}</p>

            {preguntas.map((pregunta, index) => (
              <div key={pregunta.id} className="pregunta-card">
                <div className="pregunta-header">
                  <span className="pregunta-numero">Pregunta {index + 1} de {preguntas.length}</span>
                  {pregunta.obligatoria && <span className="obligatoria">*</span>}
                </div>
                <h3 className="pregunta-texto">{pregunta.texto_pregunta}</h3>
                {pregunta.subtitulo && (
                  <p className="pregunta-subtitulo">{pregunta.subtitulo}</p>
                )}

                <div className="pregunta-respuesta">
                  {pregunta.tipo_respuesta === 'marcar' && (
                    <div className="opciones-marcar">
                      {pregunta.opciones.opciones.map((opcion, i) => (
                        <label key={i} className="opcion-item">
                          {pregunta.opciones.multiple ? (
                            <input
                              type="checkbox"
                              checked={(respuestas[pregunta.id]?.valor || []).includes(opcion)}
                              onChange={() => handleCheckboxChange(pregunta.id, opcion)}
                            />
                          ) : (
                            <input
                              type="radio"
                              name={`pregunta_${pregunta.id}`}
                              checked={respuestas[pregunta.id]?.valor === opcion}
                              onChange={() => handleRespuestaChange(pregunta.id, opcion, 'marcar')}
                            />
                          )}
                          <span>{opcion}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {pregunta.tipo_respuesta === 'lista' && (
                    <select
                      className="form-control"
                      value={respuestas[pregunta.id]?.valor || ''}
                      onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value, 'lista')}
                    >
                      <option value="">Seleccionar...</option>
                      {pregunta.opciones.opciones.map((opcion, i) => (
                        <option key={i} value={opcion}>{opcion}</option>
                      ))}
                    </select>
                  )}

                  {pregunta.tipo_respuesta === 'texto_corto' && (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={pregunta.opciones?.placeholder || 'Tu respuesta...'}
                      value={respuestas[pregunta.id]?.valor || ''}
                      onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value, 'texto_corto')}
                      maxLength={pregunta.opciones?.max_length || 200}
                    />
                  )}

                  {pregunta.tipo_respuesta === 'texto_largo' && (
                    <textarea
                      className="form-control"
                      placeholder={pregunta.opciones?.placeholder || 'Tu respuesta...'}
                      value={respuestas[pregunta.id]?.valor || ''}
                      onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value, 'texto_largo')}
                      maxLength={pregunta.opciones?.max_length || 1000}
                      rows="4"
                    />
                  )}

                  {pregunta.tipo_respuesta === 'escala' && pregunta.opciones && (
                    <div className="escala-container">
                      <div className="escala-botones">
                        {(() => {
                          const min = parseInt(pregunta.opciones.min) || 1;
                          const max = parseInt(pregunta.opciones.max) || 5;
                          const botones = [];
                          for (let num = min; num <= max; num++) {
                            botones.push(
                              <button
                                key={`${pregunta.id}-escala-${num}`}
                                type="button"
                                className={`escala-btn ${respuestas[pregunta.id]?.valor === num ? 'activo' : ''}`}
                                onClick={() => handleRespuestaChange(pregunta.id, num, 'escala')}
                              >
                                {num}
                              </button>
                            );
                          }
                          return botones;
                        })()}
                      </div>
                      <div className="escala-etiquetas">
                        <span>{pregunta.opciones.etiqueta_min || ''}</span>
                        <span>{pregunta.opciones.etiqueta_max || ''}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="form-actions">
              <button 
                className="btn btn-success btn-block"
                onClick={handleEnviar}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Enviar Respuestas ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncuestaForm;

