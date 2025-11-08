import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getConfiguracion } from '../../services/api';
import Swal from 'sweetalert2';
import './AdminLogin.css';

const AdminLogin = () => {
  const [dni, setDni] = useState('');
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    nombre_sistema: 'Vanguard Encuestas',
    color_primario: '#1976d2',
    color_secundario: '#7c3aed'
  });

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      const data = await getConfiguracion();
      if (data.configuracion) {
        setConfig(data.configuracion);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Actualizar título de la página
    document.title = `Admin - ${config.nombre_sistema}`;
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dni || !clave) {
      Swal.fire('Atención', 'Por favor completa todos los campos', 'warning');
      return;
    }

    setLoading(true);

    const result = await login(dni, clave);

    if (result.success) {
      Swal.fire('Éxito', 'Bienvenido', 'success');
      navigate('/admin/dashboard');
    } else {
      Swal.fire('Error', result.message, 'error');
    }

    setLoading(false);
  };

  return (
    <div 
      className="admin-login-page"
      style={{
        background: `linear-gradient(135deg, ${config.color_primario} 0%, ${config.color_secundario} 100%)`
      }}
    >
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h1>Administración</h1>
            <p>{config.nombre_sistema}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">DNI</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingresa tu DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                maxLength="9"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Ingresa tu contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <Link to="/" className="back-link">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

