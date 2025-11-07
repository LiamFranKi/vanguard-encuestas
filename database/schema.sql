-- =============================================
-- SISTEMA DE ENCUESTAS VANGUARD
-- Schema de Base de Datos PostgreSQL
-- =============================================

-- Eliminar tablas si existen (para desarrollo)
DROP TABLE IF EXISTS respuestas_detalle CASCADE;
DROP TABLE IF EXISTS respuestas CASCADE;
DROP TABLE IF EXISTS preguntas CASCADE;
DROP TABLE IF EXISTS encuestas CASCADE;
DROP TABLE IF EXISTS grados CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS configuracion_sistema CASCADE;

-- =============================================
-- TABLA: usuarios
-- =============================================
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  dni VARCHAR(9) UNIQUE NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  clave VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'Administrador',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- TABLA: grados
-- =============================================
CREATE TABLE grados (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  nivel VARCHAR(50),
  orden INTEGER,
  activo BOOLEAN DEFAULT true
);

-- =============================================
-- TABLA: encuestas
-- =============================================
CREATE TABLE encuestas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'borrador',
  fecha_inicio DATE,
  fecha_fin DATE,
  solicitar_grado BOOLEAN DEFAULT true,
  mensaje_agradecimiento TEXT,
  created_by INTEGER REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- TABLA: preguntas
-- =============================================
CREATE TABLE preguntas (
  id SERIAL PRIMARY KEY,
  encuesta_id INTEGER REFERENCES encuestas(id) ON DELETE CASCADE,
  orden INTEGER NOT NULL,
  texto_pregunta TEXT NOT NULL,
  subtitulo TEXT,
  tipo_respuesta VARCHAR(50) NOT NULL,
  obligatoria BOOLEAN DEFAULT true,
  opciones JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- TABLA: respuestas
-- =============================================
CREATE TABLE respuestas (
  id SERIAL PRIMARY KEY,
  encuesta_id INTEGER REFERENCES encuestas(id) ON DELETE CASCADE,
  grado_seleccionado VARCHAR(100),
  fecha_respuesta TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- =============================================
-- TABLA: respuestas_detalle
-- =============================================
CREATE TABLE respuestas_detalle (
  id SERIAL PRIMARY KEY,
  respuesta_id INTEGER REFERENCES respuestas(id) ON DELETE CASCADE,
  pregunta_id INTEGER REFERENCES preguntas(id) ON DELETE CASCADE,
  texto_respuesta TEXT,
  valor_numerico INTEGER,
  opciones_seleccionadas JSONB
);

-- =============================================
-- TABLA: configuracion_sistema
-- =============================================
CREATE TABLE configuracion_sistema (
  id SERIAL PRIMARY KEY,
  nombre_sistema VARCHAR(100) DEFAULT 'Vanguard Encuestas',
  descripcion_sistema TEXT,
  logo TEXT,
  color_primario VARCHAR(7) DEFAULT '#1976d2',
  color_secundario VARCHAR(7) DEFAULT '#7c3aed',
  email_sistema VARCHAR(100),
  telefono_sistema VARCHAR(20),
  direccion_sistema TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Usuario administrador inicial
-- DNI: 11111111, Contraseña: waltito10
INSERT INTO usuarios (dni, nombres, apellidos, email, clave, rol) VALUES
('11111111', 'Administrador', 'Sistema', 'admin@vanguard.edu.pe', 
 '$2b$10$xhO2T7yrH7SLd3b3QVVYnOGZF6rYXXHZlQTLlLvXvHLzXXLHZLHZL', 'Administrador');

-- Grados
INSERT INTO grados (nombre, nivel, orden) VALUES
('Inicial - 3 Años UNICA', 'Inicial', 1),
('Inicial - 4 Años UNICA', 'Inicial', 2),
('Inicial - 5 Años UNICA', 'Inicial', 3),
('Primaria - 1º A', 'Primaria', 4),
('Primaria - 1º B', 'Primaria', 5),
('Primaria - 2º A', 'Primaria', 6),
('Primaria - 2º B', 'Primaria', 7),
('Primaria - 3º A', 'Primaria', 8),
('Primaria - 3º B', 'Primaria', 9),
('Primaria - 4º A', 'Primaria', 10),
('Primaria - 4º B', 'Primaria', 11),
('Primaria - 5º A', 'Primaria', 12),
('Primaria - 5º B', 'Primaria', 13),
('Primaria - 6º A', 'Primaria', 14),
('Primaria - 6º B', 'Primaria', 15),
('Secundaria - 1º UNICA', 'Secundaria', 16),
('Secundaria - 2º UNICA', 'Secundaria', 17),
('Secundaria - 3º UNICA', 'Secundaria', 18),
('Secundaria - 4º UNICA', 'Secundaria', 19),
('Secundaria - 5º UNICA', 'Secundaria', 20);

-- Configuración inicial del sistema
INSERT INTO configuracion_sistema (nombre_sistema, descripcion_sistema, color_primario, color_secundario) VALUES
('Vanguard Encuestas', 'Sistema de Encuestas para Padres de Familia', '#1976d2', '#7c3aed');

-- Encuesta de ejemplo (10 preguntas)
INSERT INTO encuestas (titulo, descripcion, estado, solicitar_grado, mensaje_agradecimiento, created_by) VALUES
('Encuesta de Satisfacción 2025', 
 'Ayúdanos a conocer tu opinión sobre nuestros servicios educativos', 
 'activa', 
 true,
 '¡Gracias por tu participación! Tu opinión es muy importante para nosotros y nos ayuda a mejorar continuamente.',
 1);

-- 10 Preguntas de ejemplo
INSERT INTO preguntas (encuesta_id, orden, texto_pregunta, tipo_respuesta, obligatoria, opciones) VALUES
(1, 1, '¿Qué tan satisfecho está con la calidad educativa que recibe su hijo(a)?', 'marcar', true, 
 '{"opciones": ["Muy satisfecho", "Satisfecho", "Neutral", "Insatisfecho", "Muy insatisfecho"], "multiple": false}'),

(1, 2, '¿Cómo calificaría la comunicación entre docentes y padres de familia?', 'escala', true,
 '{"min": 1, "max": 5, "etiqueta_min": "Muy mala", "etiqueta_max": "Excelente"}'),

(1, 3, '¿Qué materia considera que debe reforzarse más en el colegio?', 'lista', true,
 '{"opciones": ["Matemáticas", "Comunicación", "Ciencias", "Inglés", "Arte", "Educación Física", "Otra"]}'),

(1, 4, '¿Considera que las instalaciones del colegio son adecuadas?', 'marcar', true,
 '{"opciones": ["Sí, totalmente adecuadas", "Sí, pero necesitan mejoras menores", "Requieren mejoras importantes", "No son adecuadas"], "multiple": false}'),

(1, 5, '¿Cómo evalúa el desempeño del personal administrativo?', 'escala', true,
 '{"min": 1, "max": 5, "etiqueta_min": "Muy malo", "etiqueta_max": "Excelente"}'),

(1, 6, '¿Qué aspectos valora más del colegio? (puede seleccionar varios)', 'marcar', true,
 '{"opciones": ["Calidad académica", "Valores y formación", "Infraestructura", "Actividades extracurriculares", "Atención personalizada", "Tecnología educativa"], "multiple": true}'),

(1, 7, '¿Recomendaría el colegio a otros padres de familia?', 'marcar', true,
 '{"opciones": ["Definitivamente sí", "Probablemente sí", "No estoy seguro", "Probablemente no", "Definitivamente no"], "multiple": false}'),

(1, 8, '¿Qué tan satisfecho está con las actividades extracurriculares ofrecidas?', 'escala', true,
 '{"min": 1, "max": 5, "etiqueta_min": "Muy insatisfecho", "etiqueta_max": "Muy satisfecho"}'),

(1, 9, '¿Hay algún servicio o actividad que le gustaría que el colegio ofreciera?', 'texto_largo', false,
 '{"placeholder": "Comparta sus sugerencias aquí...", "max_length": 500}'),

(1, 10, 'Comentarios adicionales o sugerencias', 'texto_largo', false,
 '{"placeholder": "Cualquier comentario adicional que desee compartir...", "max_length": 1000}');

-- =============================================
-- ÍNDICES para optimizar consultas
-- =============================================
CREATE INDEX idx_encuestas_estado ON encuestas(estado);
CREATE INDEX idx_preguntas_encuesta ON preguntas(encuesta_id);
CREATE INDEX idx_respuestas_encuesta ON respuestas(encuesta_id);
CREATE INDEX idx_respuestas_detalle_respuesta ON respuestas_detalle(respuesta_id);
CREATE INDEX idx_respuestas_detalle_pregunta ON respuestas_detalle(pregunta_id);

-- =============================================
-- PERMISOS (para usuario de producción)
-- =============================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO encuestas_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO encuestas_user;

