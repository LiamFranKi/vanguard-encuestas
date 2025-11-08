import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getResultados, borrarRespuestas } from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import './EncuestaResultados.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const EncuestaResultados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [encuesta, setEncuesta] = useState(null);
  const [totalRespuestas, setTotalRespuestas] = useState(0);
  const [respuestasPorGrado, setRespuestasPorGrado] = useState([]);
  const [resultadosPreguntas, setResultadosPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginasTexto, setPaginasTexto] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    cargarResultados();
  }, [id, isAuthenticated, navigate]);

  const cargarResultados = async () => {
    try {
      const data = await getResultados(id);
      setEncuesta(data.encuesta);
      setTotalRespuestas(data.totalRespuestas);
      setRespuestasPorGrado(data.respuestasPorGrado);
      setResultadosPreguntas(data.resultadosPreguntas);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los resultados', 'error');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generarGraficoMarcar = (datos) => {
    const labels = Object.keys(datos);
    const values = Object.values(datos);

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#1976d2',
            '#7c3aed',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#06b6d4'
          ],
          borderWidth: 0
        }
      ]
    };
  };

  const generarGraficoBarras = (datos) => {
    const labels = Object.keys(datos);
    const values = Object.values(datos);

    return {
      labels,
      datasets: [
        {
          label: 'Respuestas',
          data: values,
          backgroundColor: 'rgba(25, 118, 210, 0.8)',
          borderRadius: 8
        }
      ]
    };
  };

  const generarGraficoEscala = (distribucion) => {
    const labels = Object.keys(distribucion);
    const values = Object.values(distribucion);

    return {
      labels,
      datasets: [
        {
          label: 'Cantidad',
          data: values,
          backgroundColor: 'rgba(124, 58, 237, 0.8)',
          borderRadius: 8
        }
      ]
    };
  };

  const handleBorrarRespuestas = async () => {
    const result = await Swal.fire({
      title: '¿Borrar todas las respuestas?',
      text: 'Esta acción no se puede deshacer. Se eliminarán todas las respuestas de prueba de esta encuesta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar todas',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        await borrarRespuestas(id);
        Swal.fire('Eliminadas', 'Todas las respuestas han sido eliminadas', 'success');
        // Recargar resultados
        cargarResultados();
      } catch (error) {
        Swal.fire('Error', 'No se pudieron eliminar las respuestas', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando resultados...</p>
      </div>
    );
  }

  return (
    <div className="resultados-page">
      <AdminNavbar />
      
      <div className="container py-4">
        {/* Header */}
        <div className="resultados-header">
          <h1 className="resultados-titulo">{encuesta.titulo}</h1>
          <p className="resultados-descripcion">{encuesta.descripcion}</p>
        </div>

        {/* Botones de acción */}
        <div className="resultados-actions">
          {totalRespuestas > 0 && (
            <button 
              className="btn btn-danger"
              onClick={handleBorrarRespuestas}
            >
              🗑️ Borrar Todas las Respuestas
            </button>
          )}
        </div>

        {/* Resumen */}
        <div className="resumen-grid">
          <div className="resumen-card">
            <div className="resumen-icon">📊</div>
            <div className="resumen-content">
              <h3>Total de Respuestas</h3>
              <p className="resumen-number">{totalRespuestas}</p>
            </div>
          </div>
          <div className="resumen-card">
            <div className="resumen-icon">📅</div>
            <div className="resumen-content">
              <h3>Fecha de Inicio</h3>
              <p className="resumen-text">
                {encuesta.fecha_inicio 
                  ? new Date(encuesta.fecha_inicio).toLocaleDateString() 
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="resumen-card">
            <div className="resumen-icon">
              {encuesta.estado === 'activa' ? '✅' : '🔒'}
            </div>
            <div className="resumen-content">
              <h3>Estado</h3>
              <p className="resumen-text">{encuesta.estado}</p>
            </div>
          </div>
        </div>

        {/* Respuestas por Grado */}
        {respuestasPorGrado.length > 0 && (
          <div className="card mt-4">
            <div className="card-header">
              <h3>Respuestas por Grado</h3>
            </div>
            <div className="card-body">
              <div className="grados-list">
                {respuestasPorGrado.map((grado, index) => (
                  <div key={index} className="grado-item">
                    <span className="grado-nombre">{grado.grado_seleccionado}</span>
                    <span className="grado-cantidad">{grado.cantidad} respuestas</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resultados por Pregunta */}
        <div className="preguntas-resultados">
          {resultadosPreguntas.map((resultado, index) => (
            <div key={resultado.pregunta_id} className="card pregunta-resultado-card">
              <div className="card-header">
                <h3>Pregunta {resultado.orden}: {resultado.texto_pregunta}</h3>
              </div>
              <div className="card-body">
                {resultado.tipo_respuesta === 'marcar' && Object.keys(resultado.datos).length > 0 && (
                  <div className="chart-container">
                    <Doughnut
                      data={generarGraficoMarcar(resultado.datos)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                        },
                      }}
                    />
                  </div>
                )}

                {resultado.tipo_respuesta === 'lista' && Object.keys(resultado.datos).length > 0 && (
                  <div className="chart-container">
                    <Bar
                      data={generarGraficoBarras(resultado.datos)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                )}

                {resultado.tipo_respuesta === 'escala' && (
                  <div>
                    <div className="escala-promedio">
                      <span className="promedio-label">Promedio:</span>
                      <span className="promedio-valor">{resultado.datos.promedio}</span>
                      <span className="promedio-total">({resultado.datos.total} respuestas)</span>
                    </div>
                    <div className="chart-container">
                      <Bar
                        data={generarGraficoEscala(resultado.datos.distribucion)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}

                {(resultado.tipo_respuesta === 'texto_corto' || resultado.tipo_respuesta === 'texto_largo') && (
                  <div className="respuestas-texto">
                    {resultado.datos.respuestas.length === 0 ? (
                      <p className="text-center">No hay respuestas aún</p>
                    ) : (
                      <>
                        {(() => {
                          const paginaActual = paginasTexto[resultado.pregunta_id] || 1;
                          const porPagina = 5;
                          const inicio = (paginaActual - 1) * porPagina;
                          const fin = inicio + porPagina;
                          const respuestasPaginadas = resultado.datos.respuestas.slice(inicio, fin);
                          const totalPaginas = Math.ceil(resultado.datos.respuestas.length / porPagina);

                          return (
                            <>
                              {respuestasPaginadas.map((resp, i) => (
                                <div key={i} className="respuesta-texto-item">
                                  <p>"{resp.texto_respuesta}"</p>
                                  <small>
                                    {new Date(resp.fecha_respuesta).toLocaleDateString()}
                                  </small>
                                </div>
                              ))}
                              
                              {totalPaginas > 1 && (
                                <div className="paginacion">
                                  <button
                                    className="btn-pag"
                                    onClick={() => setPaginasTexto(prev => ({
                                      ...prev,
                                      [resultado.pregunta_id]: Math.max(1, (prev[resultado.pregunta_id] || 1) - 1)
                                    }))}
                                    disabled={paginaActual === 1}
                                  >
                                    ← Anterior
                                  </button>
                                  <span className="pag-info">
                                    Página {paginaActual} de {totalPaginas} ({resultado.datos.respuestas.length} respuestas)
                                  </span>
                                  <button
                                    className="btn-pag"
                                    onClick={() => setPaginasTexto(prev => ({
                                      ...prev,
                                      [resultado.pregunta_id]: Math.min(totalPaginas, (prev[resultado.pregunta_id] || 1) + 1)
                                    }))}
                                    disabled={paginaActual === totalPaginas}
                                  >
                                    Siguiente →
                                  </button>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EncuestaResultados;

