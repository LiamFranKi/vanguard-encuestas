import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';
import Swal from 'sweetalert2';
import './Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    clave: '',
    activo: true
  });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    cargarUsuarios();
  }, [isAuthenticated, navigate]);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data.usuarios);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setUsuarioEdit(usuario);
      setFormData({
        dni: usuario.dni,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email || '',
        clave: '', // No mostrar contraseña actual
        activo: usuario.activo
      });
    } else {
      setUsuarioEdit(null);
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        email: '',
        clave: '',
        activo: true
      });
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioEdit(null);
    setFormData({ dni: '', nombres: '', apellidos: '', email: '', clave: '', activo: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.dni.trim() || !formData.nombres.trim() || !formData.apellidos.trim()) {
      Swal.fire('Atención', 'DNI, Nombres y Apellidos son obligatorios', 'warning');
      return;
    }

    if (!usuarioEdit && !formData.clave.trim()) {
      Swal.fire('Atención', 'La contraseña es obligatoria para nuevos usuarios', 'warning');
      return;
    }

    if (formData.dni.length < 8 || formData.dni.length > 9) {
      Swal.fire('Atención', 'El DNI debe tener 8 o 9 caracteres', 'warning');
      return;
    }

    try {
      if (usuarioEdit) {
        await actualizarUsuario(usuarioEdit.id, formData);
        Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
      } else {
        await crearUsuario(formData);
        Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
      }
      cerrarModal();
      cargarUsuarios();
    } catch (error) {
      const mensaje = error.response?.data?.message || 'No se pudo guardar el usuario';
      Swal.fire('Error', mensaje, 'error');
    }
  };

  const handleEliminar = async (id, nombres, apellidos) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `¿Estás seguro de eliminar a ${nombres} ${apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        await eliminarUsuario(id);
        Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
        cargarUsuarios();
      } catch (error) {
        const mensaje = error.response?.data?.message || 'No se pudo eliminar el usuario';
        Swal.fire('Error', mensaje, 'error');
      }
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
    <div className="usuarios-page">
      <AdminNavbar />

      {/* Content */}
      <div className="container py-4">

        <div className="card">
          <div className="card-header">
            <h3>Lista de Usuarios Administradores</h3>
            <button className="btn btn-primary" onClick={() => abrirModal()}>
              + Nuevo Usuario
            </button>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay usuarios creados
                    </td>
                  </tr>
                ) : (
                  usuarios.map((user) => (
                    <tr key={user.id}>
                      <td><strong>{user.dni}</strong></td>
                      <td>{user.nombres}</td>
                      <td>{user.apellidos}</td>
                      <td>{user.email || 'N/A'}</td>
                      <td>
                        <span className={`badge ${user.activo ? 'badge-success' : 'badge-danger'}`}>
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => abrirModal(user)}
                            className="btn-action btn-secondary"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleEliminar(user.id, user.nombres, user.apellidos)}
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
              <h3>{usuarioEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">DNI *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    placeholder="Ej: 12345678"
                    maxLength="9"
                    required
                  />
                  <small className="form-help">8 o 9 caracteres</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Nombres *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nombres}
                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    placeholder="Ej: Juan Carlos"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Apellidos *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    placeholder="Ej: Pérez García"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ej: usuario@vanguard.edu.pe"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Contraseña {usuarioEdit && '(dejar vacío para no cambiar)'}
                    {!usuarioEdit && ' *'}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.clave}
                    onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                    placeholder={usuarioEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                    required={!usuarioEdit}
                  />
                  <small className="form-help">Mínimo 6 caracteres</small>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    />
                    <span>Usuario activo (puede iniciar sesión)</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {usuarioEdit ? 'Actualizar' : 'Crear'} Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;

