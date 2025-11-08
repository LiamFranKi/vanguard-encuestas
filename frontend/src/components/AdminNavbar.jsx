import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getConfiguracion } from '../services/api';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [config, setConfig] = useState({
    nombre_sistema: 'Vanguard Encuestas',
    color_primario: '#1976d2',
    color_secundario: '#7c3aed'
  });

  const { usuario, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav 
      className="admin-navbar"
      style={{
        background: `linear-gradient(135deg, ${config.color_primario} 0%, ${config.color_secundario} 100%)`
      }}
    >
      <div className="container">
        <div className="navbar-content">
          <Link to="/admin/dashboard" className="navbar-title">
            📊 {config.nombre_sistema}
          </Link>

          {/* Botón hamburguesa (móvil) */}
          <button 
            className="menu-toggle"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? '✕' : '☰'}
          </button>

          {/* Menú */}
          <div className={`navbar-menu ${menuAbierto ? 'menu-abierto' : ''}`}>
            <Link 
              to="/admin/dashboard" 
              className="nav-link"
              onClick={() => setMenuAbierto(false)}
            >
              🏠 Dashboard
            </Link>
            <Link 
              to="/admin/grados" 
              className="nav-link"
              onClick={() => setMenuAbierto(false)}
            >
              📚 Grados
            </Link>
            <Link 
              to="/admin/usuarios" 
              className="nav-link"
              onClick={() => setMenuAbierto(false)}
            >
              👥 Usuarios
            </Link>
            <Link 
              to="/admin/configuracion" 
              className="nav-link"
              onClick={() => setMenuAbierto(false)}
            >
              ⚙️ Configuración
            </Link>
            <div className="navbar-user">
              <button onClick={handleLogout} className="btn-logout">
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

