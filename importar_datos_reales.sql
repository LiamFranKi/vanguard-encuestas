-- =============================================
-- DATOS REALES DE ENCUESTAS Y GRADOS
-- =============================================

-- Limpiar datos existentes
DELETE FROM respuestas_detalle;
DELETE FROM respuestas;
DELETE FROM preguntas;
DELETE FROM encuestas;
DELETE FROM grados;

-- GRADOS (20 grados personalizados)
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (1, 'Inicial - 3 Años', 'Inicial', 1, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (2, 'Inicial - 4 Años', 'Inicial', 2, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (3, 'Inicial - 5 Años', 'Inicial', 3, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (4, 'Primaria - 1º A', 'Primaria', 4, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (5, 'Primaria - 1º B', 'Primaria', 5, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (6, 'Primaria - 2º A', 'Primaria', 6, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (7, 'Primaria - 2º B', 'Primaria', 7, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (8, 'Primaria - 3º A', 'Primaria', 8, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (9, 'Primaria - 3º B', 'Primaria', 9, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (10, 'Primaria - 4º A', 'Primaria', 10, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (11, 'Primaria - 4º B', 'Primaria', 11, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (12, 'Primaria - 5º', 'Primaria', 12, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (15, 'Primaria - 6°', 'Primaria', 15, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (16, 'Secundaria - 1º A', 'Secundaria', 16, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (21, 'Secundaria - 1º B', 'Secundaria', 17, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (17, 'Secundaria - 2º UNICA', 'Secundaria', 18, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (18, 'Secundaria - 3º UNICA', 'Secundaria', 19, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (19, 'Secundaria - 4º A', 'Secundaria', 20, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (22, 'Secundaria - 4º B', 'Secundaria', 21, true);
INSERT INTO grados (id, nombre, nivel, orden, activo) VALUES (20, 'Secundaria - 5º UNICA', 'Secundaria', 22, true);

-- ENCUESTA
INSERT INTO encuestas (id, titulo, descripcion, estado, fecha_inicio, fecha_fin, solicitar_grado, mensaje_agradecimiento, created_by) VALUES (6, 'Encuesta Padres - Vanguard Schools 2025', 'Su opinión es fundamental para mejorar', 'activa', '2025-11-07', '2025-11-08', true, '¡Gracias por tu participación! Tu opinión es muy importante para nosotros y nos ayuda a mejorar continuamente...', 1);

-- PREGUNTAS
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (62, 6, 1, '¿Qué tan satisfecho/a está con la calidad educativa que recibe su hijo/a en Vanguard Schools?', 'Satisfacción General', 'marcar', true, '{"max": 10, "multiple": false, "opciones": ["Nada Satisfecho", "Satisfecho", "Muy Satisfecho"], "etiqueta_max": "Muy satisfecho", "etiqueta_min": "Nada satisfecho"}'::jsonb);
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (63, 6, 2, '¿Qué opina sobre la implementación del programa bilingüe? ¿Le parece beneficioso para su hijo/a?', 'Bilingüismo', 'escala', true, '{"max": 10, "min": 1, "etiqueta_max": "Excelente", "etiqueta_min": "Muy mala"}'::jsonb);
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (64, 6, 3, '¿Qué tan interesado/a está en que su hijo/a participe en el curso de robótica?', 'Nuevos cursos y actividades (Robótica)', 'marcar', true, '{"opciones": ["Nada Interesado", "Poco Interesado", "Interesado", "Muy Interesado"]}'::jsonb);
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (65, 6, 4, '¿Cómo describiría el ambiente en términos de seguridad y bienestar?', 'Comunicación y ambiente escolar', 'texto_corto', true, '{"multiple": false, "opciones": ["Sí, totalmente adecuadas", "Sí, pero necesitan mejoras menores", "Requieren mejoras importantes", "No son adecuadas"]}'::jsonb);
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (66, 6, 5, '¿Hay algún aspecto en el que crea que podamos mejorar?', 'Mejora continua', 'texto_largo', true, '{"max": 5, "min": 1, "etiqueta_max": "Excelente", "etiqueta_min": "Muy malo"}'::jsonb);
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (67, 6, 6, '¿Podría compartir alguna experiencia positiva o área de mejora que haya notado en la educación de su hijo/a en el colegio?', 'Experiencia personal', 'texto_largo', true, '{"multiple": true, "opciones": ["Calidad académica", "Valores y formación", "Infraestructura", "Actividades extracurriculares", "Atención personalizada", "Tecnología educativa"]}'::jsonb);
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (68, 6, 7, '¿Siente que tiene oportunidades suficientes para participar en las actividades escolares o en la toma de decisiones?', 'Participación de los padres', 'escala', true, '{"max": 10, "multiple": false, "opciones": ["Definitivamente sí", "Probablemente sí", "No estoy seguro", "Probablemente no", "Definitivamente no"], "etiqueta_max": "Muchas Oportunidades", "etiqueta_min": "Ninguna oportunidad"}'::jsonb);
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (69, 6, 8, '¿Cómo evaluaría el apoyo que el colegio brinda a los alumnos que necesitan ayuda adicional, ya sea académica o emocional?', 'Apoyo a los estudiantes', 'escala', true, '{"max": 10, "min": 1, "etiqueta_max": "Mucho apoyo", "etiqueta_min": "Ningún apoyo"}'::jsonb);
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (70, 6, 9, '¿Está satisfecho/a con las instalaciones y los recursos tecnológicos o de laboratorio que ofrece el colegio?', 'Infraestructura y recursos', 'escala', false, '{"max": 10, "max_length": 500, "placeholder": "Comparta sus sugerencias aquí...", "etiqueta_max": "Muy Satisfecho", "etiqueta_min": "Nada satisfecho"}'::jsonb);
INSERT INTO preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones) VALUES (71, 6, 10, '¿Cómo calificaría la comunicación y el trato del personal docente hacia su hijo/a y hacia usted como padre o madre?', 'Percepción del personal docente', 'escala', false, '{"max": 10, "max_length": 1000, "placeholder": "Cualquier comentario adicional que desee compartir...", "etiqueta_max": "Excelente", "etiqueta_min": "Muy mala"}'::jsonb);

-- Actualizar secuencias para evitar conflictos
SELECT setval('grados_id_seq', (SELECT MAX(id) FROM grados));
SELECT setval('encuestas_id_seq', (SELECT MAX(id) FROM encuestas));
SELECT setval('preguntas_id_seq', (SELECT MAX(id) FROM preguntas));

