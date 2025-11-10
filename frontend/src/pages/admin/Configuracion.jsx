import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getConfiguracion, actualizarConfiguracion } from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';
import Swal from 'sweetalert2';
import './Configuracion.css';

const Configuracion = () => {
  const [formData, setFormData] = useState({
    nombre_sistema: '',
    descripcion_sistema: '',
    color_primario: '#1976d2',
    color_secundario: '#7c3aed',
    email_sistema: '',
    telefono_sistema: '',
    direccion_sistema: '',
    logo: '',
    restringir_respuesta_por_ip: false
  });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    cargarConfiguracion();
  }, [isAuthenticated, navigate]);

  const cargarConfiguracion = async () => {
    try {
      const data = await getConfiguracion();
      if (data.configuracion) {
        setFormData({
          nombre_sistema: data.configuracion.nombre_sistema || '',
          descripcion_sistema: data.configuracion.descripcion_sistema || '',
          color_primario: data.configuracion.color_primario || '#1976d2',
          color_secundario: data.configuracion.color_secundario || '#7c3aed',
          email_sistema: data.configuracion.email_sistema || '',
          telefono_sistema: data.configuracion.telefono_sistema || '',
          direccion_sistema: data.configuracion.direccion_sistema || '',
          logo: data.configuracion.logo || '',
          restringir_respuesta_por_ip: data.configuracion.restringir_respuesta_por_ip || false
        });
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la configuración', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre_sistema.trim()) {
      Swal.fire('Atención', 'El nombre del sistema es obligatorio', 'warning');
      return;
    }

    setGuardando(true);

    try {
      await actualizarConfiguracion(formData);
      Swal.fire('Éxito', 'Configuración guardada correctamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la configuración', 'error');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="configuracion-page">
      <AdminNavbar />

      {/* Content */}
      <div className="container py-4">

        <form onSubmit={handleSubmit}>
          {/* Información General */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>📋 Información General</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Nombre del Sistema *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre_sistema}
                  onChange={(e) => setFormData({ ...formData, nombre_sistema: e.target.value })}
                  placeholder="Ej: Vanguard Encuestas"
                  required
                />
                <small className="form-help">Aparece en el título de la página</small>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={formData.descripcion_sistema}
                  onChange={(e) => setFormData({ ...formData, descripcion_sistema: e.target.value })}
                  placeholder="Ej: Tu opinión nos ayuda a mejorar la educación"
                  rows="2"
                />
                <small className="form-help">Aparece en el subtítulo del landing page</small>
              </div>
            </div>
          </div>

          {/* Apariencia */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>🎨 Apariencia y Colores</h3>
            </div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Color Primario</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      className="color-picker"
                      value={formData.color_primario}
                      onChange={(e) => setFormData({ ...formData, color_primario: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={formData.color_primario}
                      onChange={(e) => setFormData({ ...formData, color_primario: e.target.value })}
                      placeholder="#1976d2"
                    />
                  </div>
                  <small className="form-help">Azul - Usado en botones y títulos</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Color Secundario</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      className="color-picker"
                      value={formData.color_secundario}
                      onChange={(e) => setFormData({ ...formData, color_secundario: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={formData.color_secundario}
                      onChange={(e) => setFormData({ ...formData, color_secundario: e.target.value })}
                      placeholder="#7c3aed"
                    />
                  </div>
                  <small className="form-help">Púrpura - Usado en gradientes</small>
                </div>
              </div>

              <div className="color-preview">
                <div className="preview-box">
                  <div 
                    className="preview-gradient" 
                    style={{
                      background: `linear-gradient(135deg, ${formData.color_primario} 0%, ${formData.color_secundario} 100%)`
                    }}
                  >
                    <span>Vista Previa del Gradiente</span>
                  </div>
                  <div className="preview-buttons">
                    <button
                      type="button"
                      className="preview-btn"
                      style={{ backgroundColor: formData.color_primario }}
                    >
                      Botón Primario
                    </button>
                    <button
                      type="button"
                      className="preview-btn"
                      style={{ backgroundColor: formData.color_secundario }}
                    >
                      Botón Secundario
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Datos de Contacto */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>📞 Datos de Contacto</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email_sistema}
                  onChange={(e) => setFormData({ ...formData, email_sistema: e.target.value })}
                  placeholder="contacto@vanguard.edu.pe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.telefono_sistema}
                  onChange={(e) => setFormData({ ...formData, telefono_sistema: e.target.value })}
                  placeholder="Ej: (01) 234-5678"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dirección</label>
                <textarea
                  className="form-control"
                  value={formData.direccion_sistema}
                  onChange={(e) => setFormData({ ...formData, direccion_sistema: e.target.value })}
                  placeholder="Dirección del colegio"
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Configuración de Seguridad */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>🔒 Seguridad y Restricciones</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.restringir_respuesta_por_ip}
                    onChange={(e) => setFormData({ ...formData, restringir_respuesta_por_ip: e.target.checked })}
                  />
                  <span>Restringir una respuesta por IP</span>
                </label>
                <small className="form-help">
                  Si está activado, cada dirección IP solo podrá responder una vez por encuesta. 
                  Desactívalo si quieres permitir múltiples respuestas desde el mismo dispositivo/red.
                </small>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="config-actions">
            <button
              type="submit"
              className="btn btn-success"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : '✓ Guardar Configuración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Configuracion;

