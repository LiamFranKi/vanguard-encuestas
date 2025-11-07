import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getGradosAdmin, crearGrado, actualizarGrado, eliminarGrado } from '../../services/api';
import Swal from 'sweetalert2';
import './Grados.css';

const Grados = () => {
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [gradoEdit, setGradoEdit] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    nivel: 'Primaria',
    orden: 0,
    activo: true
  });

  const { usuario, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    cargarGrados();
  }, [isAuthenticated, navigate]);

  const cargarGrados = async () => {
    try {
      const data = await getGradosAdmin();
      setGrados(data.grados);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los grados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (grado = null) => {
    if (grado) {
      setGradoEdit(grado);
      setFormData({
        nombre: grado.nombre,
        nivel: grado.nivel,
        orden: grado.orden,
        activo: grado.activo
      });
    } else {
      setGradoEdit(null);
      setFormData({
        nombre: '',
        nivel: 'Primaria',
        orden: grados.length + 1,
        activo: true
      });
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setGradoEdit(null);
    setFormData({ nombre: '', nivel: 'Primaria', orden: 0, activo: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      Swal.fire('Atención', 'El nombre del grado es obligatorio', 'warning');
      return;
    }

    try {
      if (gradoEdit) {
        await actualizarGrado(gradoEdit.id, formData);
        Swal.fire('Éxito', 'Grado actualizado correctamente', 'success');
      } else {
        await crearGrado(formData);
        Swal.fire('Éxito', 'Grado creado correctamente', 'success');
      }
      cerrarModal();
      cargarGrados();
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el grado', 'error');
    }
  };

  const handleEliminar = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Eliminar grado?',
      text: `¿Estás seguro de eliminar "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        await eliminarGrado(id);
        Swal.fire('Eliminado', 'Grado eliminado correctamente', 'success');
        cargarGrados();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el grado', 'error');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
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
    <div className="grados-page">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="container">
          <div className="navbar-content">
            <h2 className="navbar-title">📚 Gestión de Grados</h2>
            <div className="navbar-user">
              <span>👤 {usuario?.nombres} {usuario?.apellidos}</span>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container py-4">
        <div className="grados-header">
          <Link to="/admin/dashboard" className="btn-back">
            ← Volver al Dashboard
          </Link>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Lista de Grados</h3>
            <button className="btn btn-primary" onClick={() => abrirModal()}>
              + Nuevo Grado
            </button>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Nivel</th>
                  <th>Orden</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {grados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay grados creados
                    </td>
                  </tr>
                ) : (
                  grados.map((grado) => (
                    <tr key={grado.id}>
                      <td><strong>{grado.nombre}</strong></td>
                      <td>{grado.nivel}</td>
                      <td>{grado.orden}</td>
                      <td>
                        <span className={`badge ${grado.activo ? 'badge-success' : 'badge-danger'}`}>
                          {grado.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => abrirModal(grado)}
                            className="btn-action btn-secondary"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleEliminar(grado.id, grado.nombre)}
                            className="btn-action btn-danger"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{gradoEdit ? 'Editar Grado' : 'Nuevo Grado'}</h3>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre del Grado *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Primaria - 3º A"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nivel</label>
                  <select
                    className="form-control"
                    value={formData.nivel}
                    onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                  >
                    <option value="Inicial">Inicial</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Orden</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.orden}
                    onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                    min="1"
                  />
                  <small className="form-help">Orden en el que aparecerá en las listas</small>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    />
                    <span>Grado activo (visible para los usuarios)</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {gradoEdit ? 'Actualizar' : 'Crear'} Grado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grados;

