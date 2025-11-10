import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Encuestas Públicas
export const getEncuestasPublicas = async () => {
  const response = await api.get('/encuestas/publicas');
  return response.data;
};

export const getEncuesta = async (id) => {
  const response = await api.get(`/encuestas/${id}`);
  return response.data;
};

export const guardarRespuesta = async (data) => {
  const response = await api.post('/respuestas/guardar', data);
  return response.data;
};

// Grados
export const getGrados = async () => {
  const response = await api.get('/grados');
  return response.data;
};

export const getGradosAdmin = async () => {
  const response = await api.get('/grados/admin');
  return response.data;
};

export const crearGrado = async (data) => {
  const response = await api.post('/grados', data);
  return response.data;
};

export const actualizarGrado = async (id, data) => {
  const response = await api.put(`/grados/${id}`, data);
  return response.data;
};

export const eliminarGrado = async (id) => {
  const response = await api.delete(`/grados/${id}`);
  return response.data;
};

// Admin - Encuestas
export const getEncuestasAdmin = async () => {
  const response = await api.get('/encuestas/admin');
  return response.data;
};

export const crearEncuesta = async (data) => {
  const response = await api.post('/encuestas', data);
  return response.data;
};

export const actualizarEncuesta = async (id, data) => {
  const response = await api.put(`/encuestas/${id}`, data);
  return response.data;
};

export const cambiarEstadoEncuesta = async (id, estado) => {
  const response = await api.patch(`/encuestas/${id}/estado`, { estado });
  return response.data;
};

export const eliminarEncuesta = async (id) => {
  const response = await api.delete(`/encuestas/${id}`);
  return response.data;
};

// Admin - Resultados
export const getResultados = async (id) => {
  const response = await api.get(`/resultados/encuesta/${id}`);
  return response.data;
};

// Admin - Borrar Respuestas
export const borrarRespuestas = async (id) => {
  const response = await api.delete(`/respuestas/encuesta/${id}`);
  return response.data;
};

// Admin - Usuarios
export const getUsuarios = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

export const crearUsuario = async (data) => {
  const response = await api.post('/usuarios', data);
  return response.data;
};

export const actualizarUsuario = async (id, data) => {
  const response = await api.put(`/usuarios/${id}`, data);
  return response.data;
};

export const eliminarUsuario = async (id) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};

// Configuración del Sistema
export const getConfiguracion = async () => {
  const response = await api.get('/config');
  return response.data;
};

export const actualizarConfiguracion = async (data) => {
  const response = await api.put('/config', data);
  return response.data;
};

export default api;

