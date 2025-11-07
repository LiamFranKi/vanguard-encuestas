import { useLocation, Link } from 'react-router-dom';
import './Agradecimiento.css';

const Agradecimiento = () => {
  const location = useLocation();
  const mensaje = location.state?.mensaje || '¡Gracias por tu participación! Tu opinión es muy importante para nosotros.';

  return (
    <div className="agradecimiento-page">
      <div className="container">
        <div className="agradecimiento-card">
          <div className="success-icon">✅</div>
          <h1 className="agradecimiento-titulo">¡Respuesta Enviada!</h1>
          <p className="agradecimiento-mensaje">{mensaje}</p>
          <div className="agradecimiento-actions">
            <Link to="/" className="btn btn-primary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agradecimiento;

