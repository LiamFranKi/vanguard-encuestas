import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getResultados, borrarRespuestas } from '../../services/api';
import AdminNavbar from '../../components/AdminNavbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

  const handleExportarPDF = async () => {
    try {
      Swal.fire({
        title: 'Generando PDF...',
        html: 'Por favor espera, estamos capturando los gráficos y resultados<br><small>Esto puede tomar unos segundos</small>',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Crear PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let currentY = margin;

      // PÁGINA 1: PORTADA Y RESUMEN
      pdf.setFillColor(25, 118, 210);
      pdf.rect(0, 0, pageWidth, 60, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont(undefined, 'bold');
      pdf.text('RESULTADOS DE ENCUESTA', pageWidth / 2, 25, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'normal');
      const tituloLines = pdf.splitTextToSize(encuesta.titulo, pageWidth - 40);
      pdf.text(tituloLines, pageWidth / 2, 40, { align: 'center' });

      currentY = 75;
      pdf.setTextColor(0, 0, 0);

      // Información General
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('INFORMACION GENERAL', margin, currentY);
      currentY += 10;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Estado: ${encuesta.estado}`, margin, currentY);
      currentY += 6;
      pdf.text(`Fecha Inicio: ${encuesta.fecha_inicio ? new Date(encuesta.fecha_inicio).toLocaleDateString() : 'N/A'}`, margin, currentY);
      currentY += 6;
      pdf.text(`Total de Respuestas: ${totalRespuestas}`, margin, currentY);
      currentY += 6;
      pdf.text(`Fecha de Exportacion: ${new Date().toLocaleString()}`, margin, currentY);
      currentY += 15;

      // Respuestas por Grado
      if (respuestasPorGrado.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('RESPUESTAS POR GRADO', margin, currentY);
        currentY += 10;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        respuestasPorGrado.forEach(grado => {
          const porcentaje = ((grado.cantidad / totalRespuestas) * 100).toFixed(1);
          pdf.text(`• ${grado.grado_seleccionado}: ${grado.cantidad} respuestas (${porcentaje}%)`, margin + 5, currentY);
          currentY += 6;
        });
      }

      // PÁGINAS SIGUIENTES: PREGUNTAS CON GRÁFICOS
      for (let i = 0; i < resultadosPreguntas.length; i++) {
        const resultado = resultadosPreguntas[i];
        
        // Nueva página para cada pregunta
        pdf.addPage();
        currentY = margin;

        // Título de la pregunta
        pdf.setFillColor(124, 58, 237);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(`PREGUNTA ${resultado.orden}`, pageWidth / 2, 12, { align: 'center' });
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal');
        const preguntaLines = pdf.splitTextToSize(resultado.texto_pregunta, pageWidth - 30);
        pdf.text(preguntaLines, pageWidth / 2, 22, { align: 'center' });

        currentY = 45;
        pdf.setTextColor(0, 0, 0);

        // Tipo de pregunta
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Tipo: ${resultado.tipo_respuesta}`, margin, currentY);
        currentY += 10;
        pdf.setTextColor(0, 0, 0);

        // Capturar gráfico si existe
        if (resultado.tipo_respuesta === 'marcar' || resultado.tipo_respuesta === 'lista' || resultado.tipo_respuesta === 'escala') {
          const chartElements = document.querySelectorAll('.pregunta-resultado-card');
          if (chartElements[i]) {
            const chartElement = chartElements[i].querySelector('.chart-container');
            if (chartElement) {
              try {
                const canvas = await html2canvas(chartElement, {
                  scale: 2,
                  backgroundColor: '#ffffff',
                  logging: false
                });
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - (2 * margin);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                if (currentY + imgHeight > pageHeight - margin) {
                  pdf.addPage();
                  currentY = margin;
                }
                
                pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
                currentY += imgHeight + 10;
              } catch (error) {
                console.error('Error al capturar gráfico:', error);
              }
            }
          }

          // Agregar datos numéricos
          if (resultado.tipo_respuesta === 'escala') {
            pdf.setFontSize(11);
            pdf.setFont(undefined, 'bold');
            pdf.text(`Promedio: ${resultado.datos.promedio}`, margin, currentY);
            currentY += 6;
            pdf.setFont(undefined, 'normal');
            pdf.text(`Total de respuestas: ${resultado.datos.total}`, margin, currentY);
            currentY += 10;
          }

          // Tabla de datos
          if (resultado.tipo_respuesta === 'marcar' || resultado.tipo_respuesta === 'lista') {
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'bold');
            pdf.text('Opción', margin, currentY);
            pdf.text('Cantidad', margin + 110, currentY);
            pdf.text('%', margin + 150, currentY);
            currentY += 5;

            pdf.setFont(undefined, 'normal');
            const datos = resultado.datos;
            Object.entries(datos).forEach(([opcion, cantidad]) => {
              const porcentaje = ((cantidad / totalRespuestas) * 100).toFixed(1);
              const opcionText = pdf.splitTextToSize(opcion, 100);
              pdf.text(opcionText, margin, currentY);
              pdf.text(cantidad.toString(), margin + 110, currentY);
              pdf.text(`${porcentaje}%`, margin + 150, currentY);
              currentY += 6 * opcionText.length;
            });
          }
        }

        // Respuestas de texto
        if (resultado.tipo_respuesta === 'texto_corto' || resultado.tipo_respuesta === 'texto_largo') {
          pdf.setFontSize(11);
          pdf.setFont(undefined, 'bold');
          pdf.text('Respuestas:', margin, currentY);
          currentY += 8;

          pdf.setFontSize(9);
          pdf.setFont(undefined, 'normal');

          // MOSTRAR TODAS las respuestas (sin límite)
          const respuestas = resultado.datos.respuestas;
          respuestas.forEach((resp, idx) => {
            // Verificar espacio antes de cada respuesta
            if (currentY > pageHeight - 40) {
              pdf.addPage();
              currentY = margin;
              
              // Repetir título en nueva página
              pdf.setFontSize(10);
              pdf.setFont(undefined, 'bold');
              pdf.setTextColor(100, 100, 100);
              pdf.text(`PREGUNTA ${resultado.orden} (continuacion)`, margin, currentY);
              currentY += 8;
              pdf.setTextColor(0, 0, 0);
              pdf.setFontSize(9);
              pdf.setFont(undefined, 'normal');
            }

            pdf.setFont(undefined, 'bold');
            pdf.text(`${idx + 1}. ${new Date(resp.fecha_respuesta).toLocaleDateString()}`, margin, currentY);
            currentY += 5;
            
            pdf.setFont(undefined, 'normal');
            const respuestaLines = pdf.splitTextToSize(resp.texto_respuesta, pageWidth - (2 * margin));
            
            // Verificar si la respuesta completa cabe en la página
            const alturaRespuesta = respuestaLines.length * 4;
            if (currentY + alturaRespuesta > pageHeight - margin) {
              pdf.addPage();
              currentY = margin;
              
              // Repetir número y fecha en nueva página
              pdf.setFont(undefined, 'bold');
              pdf.text(`${idx + 1}. ${new Date(resp.fecha_respuesta).toLocaleDateString()} (cont.)`, margin, currentY);
              currentY += 5;
              pdf.setFont(undefined, 'normal');
            }
            
            pdf.text(respuestaLines, margin + 3, currentY);
            currentY += alturaRespuesta + 6;
          });

          // Mostrar total de respuestas
          if (respuestas.length > 0) {
            if (currentY > pageHeight - 30) {
              pdf.addPage();
              currentY = margin;
            }
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(25, 118, 210);
            pdf.text(`Total: ${respuestas.length} respuestas`, margin, currentY);
            pdf.setTextColor(0, 0, 0);
          }
        }
      }

      // Guardar PDF
      const fileName = `Resultados_${encuesta.titulo.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
      pdf.save(fileName);

      Swal.fire({
        icon: 'success',
        title: '¡PDF Generado!',
        text: 'El archivo se ha descargado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      Swal.fire('Error', 'No se pudo generar el PDF. Por favor intenta nuevamente.', 'error');
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
            <>
              <button 
                className="btn btn-success"
                onClick={handleExportarPDF}
              >
                Exportar a PDF
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleBorrarRespuestas}
              >
                🗑️ Borrar Todas las Respuestas
              </button>
            </>
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

