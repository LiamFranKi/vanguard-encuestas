-- Agregar campo para controlar restricción por IP
ALTER TABLE configuracion_sistema 
ADD COLUMN IF NOT EXISTS restringir_respuesta_por_ip BOOLEAN DEFAULT false;

-- Actualizar comentario
COMMENT ON COLUMN configuracion_sistema.restringir_respuesta_por_ip IS 'Si está en true, solo permite una respuesta por IP. Si está en false, permite múltiples respuestas desde la misma IP.';

