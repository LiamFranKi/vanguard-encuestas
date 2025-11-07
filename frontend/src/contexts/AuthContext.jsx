import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

  useEffect(() => {
    verificarToken();
  }, []);

  const verificarToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUsuario(response.data.usuario);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (dni, clave) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { dni, clave });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUsuario(response.data.usuario);
        return { success: true };
      }
      
      return { success: false, message: 'Error en el login' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const value = {
    usuario,
    loading,
    login,
    logout,
    isAuthenticated: !!usuario
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

