import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getEncuesta, crearEncuesta, actualizarEncuesta } from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';
import Swal from 'sweetalert2';
import './EncuestaEditor.css';

const EncuestaEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [solicitarGrado, setSolicitarGrado] = useState(true);
  const [mensajeAgradecimiento, setMensajeAgradecimiento] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    if (id) {
      cargarEncuesta();
    }
  }, [id, isAuthenticated, navigate]);

  const cargarEncuesta = async () => {
    try {
      const data = await getEncuesta(id);
      setTitulo(data.encuesta.titulo);
      setDescripcion(data.encuesta.descripcion);
      setFechaInicio(data.encuesta.fecha_inicio || '');
      setFechaFin(data.encuesta.fecha_fin || '');
      setSolicitarGrado(data.encuesta.solicitar_grado);
      setMensajeAgradecimiento(data.encuesta.mensaje_agradecimiento || '');
      setPreguntas(data.preguntas.map(p => ({
        ...p,
        opciones: typeof p.opciones === 'string' ? JSON.parse(p.opciones) : p.opciones
      })));
    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la encuesta', 'error');
      navigate('/admin/dashboard');
    }
  };

  const agregarPregunta = () => {
    const nuevaPregunta = {
      orden: preguntas.length + 1,
      texto_pregunta: '',
      subtitulo: '',
      tipo_respuesta: 'marcar',
      obligatoria: true,
      opciones: { opciones: ['Opción 1', 'Opción 2'], multiple: false }
    };
    setPreguntas([...preguntas, nuevaPregunta]);
  };

  const eliminarPregunta = (index) => {
    const nuevasPreguntas = preguntas.filter((_, i) => i !== index);
    // Reordenar
    nuevasPreguntas.forEach((p, i) => p.orden = i + 1);
    setPreguntas(nuevasPreguntas);
  };

  const actualizarPregunta = (index, campo, valor) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  const actualizarOpciones = (index, nuevasOpciones) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].opciones = nuevasOpciones;
    setPreguntas(nuevasPreguntas);
  };

  const moverPregunta = (index, direccion) => {
    if (
      (direccion === 'up' && index === 0) ||
      (direccion === 'down' && index === preguntas.length - 1)
    ) {
      return;
    }

    const nuevasPreguntas = [...preguntas];
    const newIndex = direccion === 'up' ? index - 1 : index + 1;
    
    [nuevasPreguntas[index], nuevasPreguntas[newIndex]] = 
    [nuevasPreguntas[newIndex], nuevasPreguntas[index]];
    
    // Reordenar
    nuevasPreguntas.forEach((p, i) => p.orden = i + 1);
    setPreguntas(nuevasPreguntas);
  };

  const validarFormulario = () => {
    if (!titulo.trim()) {
      Swal.fire('Atención', 'El título es obligatorio', 'warning');
      return false;
    }
    if (preguntas.length === 0) {
      Swal.fire('Atención', 'Debes agregar al menos una pregunta', 'warning');
      return false;
    }
    for (let i = 0; i < preguntas.length; i++) {
      if (!preguntas[i].texto_pregunta.trim()) {
        Swal.fire('Atención', `La pregunta ${i + 1} no tiene texto`, 'warning');
        return false;
      }
    }
    return true;
  };

  const handleGuardar = async (estado = 'borrador') => {
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const data = {
        titulo,
        descripcion,
        fecha_inicio: fechaInicio || null,
        fecha_fin: fechaFin || null,
        solicitar_grado: solicitarGrado,
        mensaje_agradecimiento: mensajeAgradecimiento || '¡Gracias por tu participación!',
        preguntas: preguntas.map(p => ({
          ...p,
          opciones: p.opciones
        }))
      };

      if (id) {
        // Actualizar encuesta existente
        await actualizarEncuesta(id, data);
        Swal.fire('Éxito', 'Encuesta actualizada correctamente', 'success');
      } else {
        // Crear nueva encuesta
        await crearEncuesta(data);
        Swal.fire('Éxito', 'Encuesta creada correctamente', 'success');
      }

      navigate('/admin/dashboard');
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la encuesta', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="encuesta-editor-page">
      <AdminNavbar />
      
      <div className="container py-4">
        <div className="editor-header">
          <h1>{id ? 'Editar Encuesta' : 'Nueva Encuesta'}</h1>
        </div>

        <div className="editor-content">
          {/* Información General */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>📋 Información General</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Título de la Encuesta *</label>
                <input
                  type="text"
                  className="form-control"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Encuesta de Satisfacción 2025"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Breve descripción de la encuesta"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={solicitarGrado}
                    onChange={(e) => setSolicitarGrado(e.target.checked)}
                  />
                  <span>Solicitar grado del estudiante</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Mensaje de Agradecimiento</label>
                <textarea
                  className="form-control"
                  value={mensajeAgradecimiento}
                  onChange={(e) => setMensajeAgradecimiento(e.target.value)}
                  placeholder="Mensaje que se mostrará al completar la encuesta"
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Constructor de Preguntas */}
          <div className="card">
            <div className="card-header">
              <h3>❓ Preguntas</h3>
              <button className="btn btn-primary" onClick={agregarPregunta}>
                + Agregar Pregunta
              </button>
            </div>
            <div className="card-body">
              {preguntas.length === 0 ? (
                <div className="empty-state">
                  <p>No hay preguntas. Click en "+ Agregar Pregunta" para comenzar.</p>
                </div>
              ) : (
                <div className="preguntas-list">
                  {preguntas.map((pregunta, index) => (
                    <PreguntaItem
                      key={index}
                      pregunta={pregunta}
                      index={index}
                      total={preguntas.length}
                      onUpdate={actualizarPregunta}
                      onUpdateOpciones={actualizarOpciones}
                      onDelete={eliminarPregunta}
                      onMove={moverPregunta}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="editor-actions">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/admin/dashboard')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className="btn btn-success"
              onClick={() => handleGuardar('activa')}
              disabled={loading}
            >
              {loading ? 'Guardando...' : '✓ Guardar y Activar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para cada pregunta
const PreguntaItem = ({ pregunta, index, total, onUpdate, onUpdateOpciones, onDelete, onMove }) => {
  const [expanded, setExpanded] = useState(true);

  const agregarOpcion = () => {
    const nuevasOpciones = { ...pregunta.opciones };
    if (nuevasOpciones.opciones) {
      nuevasOpciones.opciones.push(`Opción ${nuevasOpciones.opciones.length + 1}`);
    }
    onUpdateOpciones(index, nuevasOpciones);
  };

  const eliminarOpcion = (opcionIndex) => {
    const nuevasOpciones = { ...pregunta.opciones };
    if (nuevasOpciones.opciones) {
      nuevasOpciones.opciones.splice(opcionIndex, 1);
    }
    onUpdateOpciones(index, nuevasOpciones);
  };

  const actualizarOpcion = (opcionIndex, valor) => {
    const nuevasOpciones = { ...pregunta.opciones };
    if (nuevasOpciones.opciones) {
      nuevasOpciones.opciones[opcionIndex] = valor;
    }
    onUpdateOpciones(index, nuevasOpciones);
  };

  return (
    <div className="pregunta-item">
      <div className="pregunta-item-header">
        <div className="pregunta-info">
          <span className="pregunta-numero">Pregunta {index + 1}</span>
          <button className="btn-toggle" onClick={() => setExpanded(!expanded)}>
            {expanded ? '▼' : '▶'}
          </button>
        </div>
        <div className="pregunta-actions">
          <button
            className="btn-icon"
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
            title="Subir"
          >
            ↑
          </button>
          <button
            className="btn-icon"
            onClick={() => onMove(index, 'down')}
            disabled={index === total - 1}
            title="Bajar"
          >
            ↓
          </button>
          <button
            className="btn-icon btn-danger"
            onClick={() => onDelete(index)}
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pregunta-item-body">
          <div className="form-group">
            <label className="form-label">Texto de la Pregunta *</label>
            <input
              type="text"
              className="form-control"
              value={pregunta.texto_pregunta}
              onChange={(e) => onUpdate(index, 'texto_pregunta', e.target.value)}
              placeholder="Escribe tu pregunta aquí"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subtítulo (opcional)</label>
            <input
              type="text"
              className="form-control"
              value={pregunta.subtitulo || ''}
              onChange={(e) => onUpdate(index, 'subtitulo', e.target.value)}
              placeholder="Texto adicional o aclaración"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de Respuesta</label>
              <select
                className="form-control"
                value={pregunta.tipo_respuesta}
                onChange={(e) => onUpdate(index, 'tipo_respuesta', e.target.value)}
              >
                <option value="marcar">Marcar (Radio/Checkbox)</option>
                <option value="lista">Lista (Dropdown)</option>
                <option value="texto_corto">Texto Corto</option>
                <option value="texto_largo">Texto Largo</option>
                <option value="escala">Escala (1-5)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={pregunta.obligatoria}
                  onChange={(e) => onUpdate(index, 'obligatoria', e.target.checked)}
                />
                <span>Obligatoria</span>
              </label>
            </div>
          </div>

          {/* Opciones según tipo */}
          {(pregunta.tipo_respuesta === 'marcar' || pregunta.tipo_respuesta === 'lista') && (
            <div className="opciones-config">
              <label className="form-label">Opciones:</label>
              {pregunta.opciones?.opciones?.map((opcion, opcionIndex) => (
                <div key={opcionIndex} className="opcion-item">
                  <input
                    type="text"
                    className="form-control"
                    value={opcion}
                    onChange={(e) => actualizarOpcion(opcionIndex, e.target.value)}
                  />
                  <button
                    className="btn-icon btn-danger-small"
                    onClick={() => eliminarOpcion(opcionIndex)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button className="btn btn-small" onClick={agregarOpcion}>
                + Agregar Opción
              </button>
              {pregunta.tipo_respuesta === 'marcar' && (
                <label className="checkbox-label mt-2">
                  <input
                    type="checkbox"
                    checked={pregunta.opciones?.multiple || false}
                    onChange={(e) => onUpdateOpciones(index, {
                      ...pregunta.opciones,
                      multiple: e.target.checked
                    })}
                  />
                  <span>Permitir selección múltiple</span>
                </label>
              )}
            </div>
          )}

          {pregunta.tipo_respuesta === 'escala' && (
            <div className="escala-config">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Mínimo</label>
                  <input
                    type="number"
                    className="form-control"
                    value={pregunta.opciones?.min || 1}
                    onChange={(e) => onUpdateOpciones(index, {
                      ...pregunta.opciones,
                      min: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Máximo</label>
                  <input
                    type="number"
                    className="form-control"
                    value={pregunta.opciones?.max || 5}
                    onChange={(e) => onUpdateOpciones(index, {
                      ...pregunta.opciones,
                      max: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Etiqueta Mínimo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pregunta.opciones?.etiqueta_min || ''}
                    onChange={(e) => onUpdateOpciones(index, {
                      ...pregunta.opciones,
                      etiqueta_min: e.target.value
                    })}
                    placeholder="Ej: Muy malo"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Etiqueta Máximo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={pregunta.opciones?.etiqueta_max || ''}
                    onChange={(e) => onUpdateOpciones(index, {
                      ...pregunta.opciones,
                      etiqueta_max: e.target.value
                    })}
                    placeholder="Ej: Excelente"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EncuestaEditor;

