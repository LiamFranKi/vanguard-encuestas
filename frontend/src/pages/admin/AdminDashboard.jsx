import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getEncuestasAdmin, cambiarEstadoEncuesta, eliminarEncuesta } from '../../services/api';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  const { usuario, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    cargarEncuestas();
  }, [isAuthenticated, navigate]);

  const cargarEncuestas = async () => {
    try {
      const data = await getEncuestasAdmin();
      setEncuestas(data.encuestas);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar las encuestas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (id, estadoActual) => {
    const estados = {
      'borrador': 'activa',
      'activa': 'cerrada',
      'cerrada': 'activa'
    };

    const nuevoEstado = estados[estadoActual];

    const result = await Swal.fire({
      title: '¿Confirmar cambio?',
      text: `¿Cambiar estado a "${nuevoEstado}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await cambiarEstadoEncuesta(id, nuevoEstado);
        Swal.fire('Éxito', 'Estado actualizado', 'success');
        cargarEncuestas();
      } catch (error) {
        Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
      }
    }
  };

  const handleEliminar = async (id, titulo) => {
    const result = await Swal.fire({
      title: '¿Eliminar encuesta?',
      text: `¿Estás seguro de eliminar "${titulo}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        await eliminarEncuesta(id);
        Swal.fire('Eliminado', 'Encuesta eliminada correctamente', 'success');
        cargarEncuestas();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la encuesta', 'error');
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'borrador': 'badge-warning',
      'activa': 'badge-success',
      'cerrada': 'badge-danger'
    };
    return badges[estado] || 'badge-info';
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
    <div className="admin-dashboard">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="container">
          <div className="navbar-content">
            <h2 className="navbar-title">📊 Vanguard Encuestas - Admin</h2>
            <div className="navbar-user">
              <Link to="/admin/grados" className="btn-link-navbar">
                📚 Grados
              </Link>
              <span>👤 {usuario?.nombres} {usuario?.apellidos}</span>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container py-4">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Total Encuestas</h3>
              <p className="stat-number">{encuestas.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Encuestas Activas</h3>
              <p className="stat-number">
                {encuestas.filter(e => e.estado === 'activa').length}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>Total Respuestas</h3>
              <p className="stat-number">
                {encuestas.reduce((sum, e) => sum + parseInt(e.total_respuestas || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Encuestas Table */}
        <div className="card mt-4">
          <div className="card-header">
            <h3>Lista de Encuestas</h3>
            <Link to="/admin/encuesta/nueva" className="btn btn-primary">
              + Nueva Encuesta
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Respuestas</th>
                  <th>Fecha Inicio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {encuestas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay encuestas creadas
                    </td>
                  </tr>
                ) : (
                  encuestas.map((encuesta) => (
                    <tr key={encuesta.id}>
                      <td>
                        <strong>{encuesta.titulo}</strong>
                      </td>
                      <td>
                        <span className={`badge ${getEstadoBadge(encuesta.estado)}`}>
                          {encuesta.estado}
                        </span>
                      </td>
                      <td>{encuesta.total_respuestas || 0}</td>
                      <td>
                        {encuesta.fecha_inicio 
                          ? new Date(encuesta.fecha_inicio).toLocaleDateString() 
                          : 'N/A'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/encuesta/editar/${encuesta.id}`}
                            className="btn-action btn-secondary"
                            title="Editar"
                          >
                            ✏️
                          </Link>
                          <Link
                            to={`/admin/resultados/${encuesta.id}`}
                            className="btn-action btn-info"
                            title="Ver resultados"
                          >
                            📊
                          </Link>
                          <button
                            onClick={() => handleCambiarEstado(encuesta.id, encuesta.estado)}
                            className="btn-action btn-warning"
                            title="Cambiar estado"
                          >
                            🔄
                          </button>
                          <button
                            onClick={() => handleEliminar(encuesta.id, encuesta.titulo)}
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
    </div>
  );
};

export default AdminDashboard;

