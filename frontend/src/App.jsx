import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Páginas Públicas
import Landing from './pages/Landing';
import EncuestaForm from './pages/EncuestaForm';
import Agradecimiento from './pages/Agradecimiento';

// Páginas Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import EncuestaResultados from './pages/admin/EncuestaResultados';
import EncuestaEditor from './pages/admin/EncuestaEditor';
import Grados from './pages/admin/Grados';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/encuesta/:id" element={<EncuestaForm />} />
          <Route path="/gracias" element={<Agradecimiento />} />

          {/* Rutas Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/encuesta/nueva" element={<EncuestaEditor />} />
          <Route path="/admin/encuesta/editar/:id" element={<EncuestaEditor />} />
          <Route path="/admin/resultados/:id" element={<EncuestaResultados />} />
          <Route path="/admin/grados" element={<Grados />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

