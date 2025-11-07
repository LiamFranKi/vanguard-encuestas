import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEncuestasPublicas } from '../services/api';
import './Landing.css';

const Landing = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEncuestas();
  }, []);

  const cargarEncuestas = async () => {
    try {
      const data = await getEncuestasPublicas();
      setEncuestas(data.encuestas);
    } catch (error) {
      console.error('Error al cargar encuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-icon">📋</div>
            <h1 className="hero-title">Encuestas Vanguard Schools</h1>
            <p className="hero-subtitle">
              Tu opinión nos ayuda a mejorar la educación
            </p>
          </div>
        </div>
      </section>

      {/* Encuestas Activas */}
      <section className="encuestas-section">
        <div className="container">
          <h2 className="section-title">Encuestas Disponibles</h2>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner"></div>
              <p className="mt-2">Cargando encuestas...</p>
            </div>
          ) : encuestas.length === 0 ? (
            <div className="no-encuestas">
              <p>No hay encuestas disponibles en este momento.</p>
            </div>
          ) : (
            <div className="encuestas-grid">
              {encuestas.map((encuesta) => (
                <div key={encuesta.id} className="encuesta-card">
                  <div className="encuesta-icon">📝</div>
                  <h3 className="encuesta-titulo">{encuesta.titulo}</h3>
                  <p className="encuesta-descripcion">
                    {encuesta.descripcion}
                  </p>
                  <div className="encuesta-meta">
                    <span>Encuesta anónima</span>
                  </div>
                  <Link 
                    to={`/encuesta/${encuesta.id}`} 
                    className="btn btn-primary btn-block"
                  >
                    Responder Encuesta →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2025 Vanguard Schools. Todos los derechos reservados.</p>
            <Link to="/admin/login" className="footer-link">
              Administrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

