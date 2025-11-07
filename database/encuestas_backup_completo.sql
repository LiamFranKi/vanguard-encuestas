--
-- PostgreSQL database dump
--

\restrict 8Lc4Wvawhvog6XJHJlcFemdg0W5nrCeNwr2UC6AlUzq4RwgpuzD5NDJrotUsQd7

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-07 13:37:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS encuestas_vanguard;
--
-- TOC entry 4986 (class 1262 OID 16642)
-- Name: encuestas_vanguard; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE encuestas_vanguard WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Peru.1252';


ALTER DATABASE encuestas_vanguard OWNER TO postgres;

\unrestrict 8Lc4Wvawhvog6XJHJlcFemdg0W5nrCeNwr2UC6AlUzq4RwgpuzD5NDJrotUsQd7
\connect encuestas_vanguard
\restrict 8Lc4Wvawhvog6XJHJlcFemdg0W5nrCeNwr2UC6AlUzq4RwgpuzD5NDJrotUsQd7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 16735)
-- Name: configuracion_sistema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_sistema (
    id integer NOT NULL,
    nombre_sistema character varying(100) DEFAULT 'Vanguard Encuestas'::character varying,
    descripcion_sistema text,
    logo text,
    color_primario character varying(7) DEFAULT '#1976d2'::character varying,
    color_secundario character varying(7) DEFAULT '#7c3aed'::character varying,
    email_sistema character varying(100),
    telefono_sistema character varying(20),
    direccion_sistema text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.configuracion_sistema OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16734)
-- Name: configuracion_sistema_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configuracion_sistema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configuracion_sistema_id_seq OWNER TO postgres;

--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 229
-- Name: configuracion_sistema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configuracion_sistema_id_seq OWNED BY public.configuracion_sistema.id;


--
-- TOC entry 222 (class 1259 OID 16667)
-- Name: encuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encuestas (
    id integer NOT NULL,
    titulo character varying(200) NOT NULL,
    descripcion text,
    estado character varying(20) DEFAULT 'borrador'::character varying,
    fecha_inicio date,
    fecha_fin date,
    solicitar_grado boolean DEFAULT true,
    mensaje_agradecimiento text,
    created_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.encuestas OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16666)
-- Name: encuestas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encuestas_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 221
-- Name: encuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encuestas_id_seq OWNED BY public.encuestas.id;


--
-- TOC entry 220 (class 1259 OID 16659)
-- Name: grados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grados (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    nivel character varying(50),
    orden integer,
    activo boolean DEFAULT true
);


ALTER TABLE public.grados OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16658)
-- Name: grados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grados_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 219
-- Name: grados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grados_id_seq OWNED BY public.grados.id;


--
-- TOC entry 224 (class 1259 OID 16685)
-- Name: preguntas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preguntas (
    id integer NOT NULL,
    encuesta_id integer,
    orden integer NOT NULL,
    texto_pregunta text NOT NULL,
    subtitulo text,
    tipo_respuesta character varying(50) NOT NULL,
    obligatoria boolean DEFAULT true,
    opciones jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.preguntas OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16684)
-- Name: preguntas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.preguntas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.preguntas_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 223
-- Name: preguntas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.preguntas_id_seq OWNED BY public.preguntas.id;


--
-- TOC entry 226 (class 1259 OID 16701)
-- Name: respuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respuestas (
    id integer NOT NULL,
    encuesta_id integer,
    grado_seleccionado character varying(100),
    fecha_respuesta timestamp without time zone DEFAULT now(),
    ip_address character varying(45),
    user_agent text
);


ALTER TABLE public.respuestas OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16716)
-- Name: respuestas_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respuestas_detalle (
    id integer NOT NULL,
    respuesta_id integer,
    pregunta_id integer,
    texto_respuesta text,
    valor_numerico integer,
    opciones_seleccionadas jsonb
);


ALTER TABLE public.respuestas_detalle OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16715)
-- Name: respuestas_detalle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.respuestas_detalle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.respuestas_detalle_id_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 227
-- Name: respuestas_detalle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.respuestas_detalle_id_seq OWNED BY public.respuestas_detalle.id;


--
-- TOC entry 225 (class 1259 OID 16700)
-- Name: respuestas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.respuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.respuestas_id_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 225
-- Name: respuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.respuestas_id_seq OWNED BY public.respuestas.id;


--
-- TOC entry 218 (class 1259 OID 16644)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    dni character varying(9) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    email character varying(100),
    clave character varying(255) NOT NULL,
    rol character varying(50) DEFAULT 'Administrador'::character varying,
    activo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16643)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4790 (class 2604 OID 16738)
-- Name: configuracion_sistema id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sistema ALTER COLUMN id SET DEFAULT nextval('public.configuracion_sistema_id_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 16670)
-- Name: encuestas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuestas ALTER COLUMN id SET DEFAULT nextval('public.encuestas_id_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 16662)
-- Name: grados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grados ALTER COLUMN id SET DEFAULT nextval('public.grados_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 16688)
-- Name: preguntas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas ALTER COLUMN id SET DEFAULT nextval('public.preguntas_id_seq'::regclass);


--
-- TOC entry 4787 (class 2604 OID 16704)
-- Name: respuestas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas ALTER COLUMN id SET DEFAULT nextval('public.respuestas_id_seq'::regclass);


--
-- TOC entry 4789 (class 2604 OID 16719)
-- Name: respuestas_detalle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas_detalle ALTER COLUMN id SET DEFAULT nextval('public.respuestas_detalle_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 16647)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4980 (class 0 OID 16735)
-- Dependencies: 230
-- Data for Name: configuracion_sistema; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.configuracion_sistema (id, nombre_sistema, descripcion_sistema, logo, color_primario, color_secundario, email_sistema, telefono_sistema, direccion_sistema, created_at, updated_at) VALUES (1, 'Vanguard Encuestas', 'Sistema de Encuestas para Padres de Familia', NULL, '#1976d2', '#7c3aed', NULL, NULL, NULL, '2025-11-07 10:29:49.208885', '2025-11-07 10:29:49.208885') ON CONFLICT DO NOTHING;


--
-- TOC entry 4972 (class 0 OID 16667)
-- Dependencies: 222
-- Data for Name: encuestas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.encuestas (id, titulo, descripcion, estado, fecha_inicio, fecha_fin, solicitar_grado, mensaje_agradecimiento, created_by, created_at, updated_at) VALUES (6, 'Encuesta Padres - Vanguard Schools 2025', 'Su opinión es fundamental para mejorar', 'activa', '2025-11-07', '2025-11-08', true, '¡Gracias por tu participación! Tu opinión es muy importante para nosotros y nos ayuda a mejorar continuamente...', 1, '2025-11-07 11:19:10.048501', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;


--
-- TOC entry 4970 (class 0 OID 16659)
-- Dependencies: 220
-- Data for Name: grados; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (4, 'Primaria - 1º A', 'Primaria', 4, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (5, 'Primaria - 1º B', 'Primaria', 5, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (6, 'Primaria - 2º A', 'Primaria', 6, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (7, 'Primaria - 2º B', 'Primaria', 7, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (8, 'Primaria - 3º A', 'Primaria', 8, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (9, 'Primaria - 3º B', 'Primaria', 9, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (10, 'Primaria - 4º A', 'Primaria', 10, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (11, 'Primaria - 4º B', 'Primaria', 11, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (1, 'Inicial - 3 Años', 'Inicial', 1, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (2, 'Inicial - 4 Años', 'Inicial', 2, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (3, 'Inicial - 5 Años', 'Inicial', 3, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (12, 'Primaria - 5º', 'Primaria', 12, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (15, 'Primaria - 6°', 'Primaria', 15, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (16, 'Secundaria - 1º A', 'Secundaria', 16, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (20, 'Secundaria - 5º UNICA', 'Secundaria', 22, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (19, 'Secundaria - 4º A', 'Secundaria', 20, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (18, 'Secundaria - 3º UNICA', 'Secundaria', 19, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (17, 'Secundaria - 2º UNICA', 'Secundaria', 18, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (21, 'Secundaria - 1º B', 'Secundaria', 17, true) ON CONFLICT DO NOTHING;
INSERT INTO public.grados (id, nombre, nivel, orden, activo) VALUES (22, 'Secundaria - 4º B', 'Secundaria', 21, true) ON CONFLICT DO NOTHING;


--
-- TOC entry 4974 (class 0 OID 16685)
-- Dependencies: 224
-- Data for Name: preguntas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (62, 6, 1, '¿Qué tan satisfecho/a está con la calidad educativa que recibe su hijo/a en Vanguard Schools?', 'Satisfacción General', 'marcar', true, '{"max": 10, "multiple": false, "opciones": ["Nada Satisfecho", "Satisfecho", "Muy Satisfecho"], "etiqueta_max": "Muy satisfecho", "etiqueta_min": "Nada satisfecho"}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;
INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (63, 6, 2, '¿Qué opina sobre la implementación del programa bilingüe? ¿Le parece beneficioso para su hijo/a?', 'Bilingüismo', 'escala', true, '{"max": 10, "min": 1, "etiqueta_max": "Excelente", "etiqueta_min": "Muy mala"}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;
INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (64, 6, 3, '¿Qué tan interesado/a está en que su hijo/a participe en el curso de robótica?', 'Nuevos cursos y actividades (Robótica)', 'marcar', true, '{"opciones": ["Nada Interesado", "Poco Interesado", "Interesado", "Muy Interesado"]}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;
INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (65, 6, 4, '¿Cómo describiría el ambiente en términos de seguridad y bienestar?', 'Comunicación y ambiente escolar', 'texto_corto', true, '{"multiple": false, "opciones": ["Sí, totalmente adecuadas", "Sí, pero necesitan mejoras menores", "Requieren mejoras importantes", "No son adecuadas"]}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;
INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (66, 6, 5, '¿Hay algún aspecto en el que crea que podamos mejorar?', 'Mejora continua', 'texto_largo', true, '{"max": 5, "min": 1, "etiqueta_max": "Excelente", "etiqueta_min": "Muy malo"}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;
INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (67, 6, 6, '¿Podría compartir alguna experiencia positiva o área de mejora que haya notado en la educación de su hijo/a en el colegio?', 'Experiencia personal', 'texto_largo', true, '{"multiple": true, "opciones": ["Calidad académica", "Valores y formación", "Infraestructura", "Actividades extracurriculares", "Atención personalizada", "Tecnología educativa"]}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;
INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (68, 6, 7, '¿Siente que tiene oportunidades suficientes para participar en las actividades escolares o en la toma de decisiones?', 'Participación de los padres', 'escala', true, '{"max": 10, "multiple": false, "opciones": ["Definitivamente sí", "Probablemente sí", "No estoy seguro", "Probablemente no", "Definitivamente no"], "etiqueta_max": "Muchas Oportunidades", "etiqueta_min": "Ninguna oportunidad"}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;
INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (69, 6, 8, '¿Cómo evaluaría el apoyo que el colegio brinda a los alumnos que necesitan ayuda adicional, ya sea académica o emocional?', 'Apoyo a los estudiantes', 'escala', true, '{"max": 10, "min": 1, "etiqueta_max": "Mucho apoyo", "etiqueta_min": "Ningún apoyo"}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;
INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (70, 6, 9, '¿Está satisfecho/a con las instalaciones y los recursos tecnológicos o de laboratorio que ofrece el colegio?', 'Infraestructura y recursos', 'escala', false, '{"max": 10, "max_length": 500, "placeholder": "Comparta sus sugerencias aquí...", "etiqueta_max": "Muy Satisfecho", "etiqueta_min": "Nada satisfecho"}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;
INSERT INTO public.preguntas (id, encuesta_id, orden, texto_pregunta, subtitulo, tipo_respuesta, obligatoria, opciones, created_at) VALUES (71, 6, 10, '¿Cómo calificaría la comunicación y el trato del personal docente hacia su hijo/a y hacia usted como padre o madre?', 'Percepción del personal docente', 'escala', false, '{"max": 10, "max_length": 1000, "placeholder": "Cualquier comentario adicional que desee compartir...", "etiqueta_max": "Excelente", "etiqueta_min": "Muy mala"}', '2025-11-07 11:32:32.237147') ON CONFLICT DO NOTHING;


--
-- TOC entry 4976 (class 0 OID 16701)
-- Dependencies: 226
-- Data for Name: respuestas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.respuestas (id, encuesta_id, grado_seleccionado, fecha_respuesta, ip_address, user_agent) VALUES (2, 6, 'Inicial - 4 Años UNICA', '2025-11-07 11:37:45.011433', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas (id, encuesta_id, grado_seleccionado, fecha_respuesta, ip_address, user_agent) VALUES (3, 6, 'Primaria - 1º A', '2025-11-07 11:38:45.44371', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas (id, encuesta_id, grado_seleccionado, fecha_respuesta, ip_address, user_agent) VALUES (4, 6, 'Primaria - 1º A', '2025-11-07 11:39:05.20225', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas (id, encuesta_id, grado_seleccionado, fecha_respuesta, ip_address, user_agent) VALUES (5, 6, 'Primaria - 2º B', '2025-11-07 11:46:50.569917', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas (id, encuesta_id, grado_seleccionado, fecha_respuesta, ip_address, user_agent) VALUES (6, 6, 'Primaria - 4º A', '2025-11-07 11:47:07.510265', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas (id, encuesta_id, grado_seleccionado, fecha_respuesta, ip_address, user_agent) VALUES (7, 6, 'Primaria - 4º B', '2025-11-07 11:47:25.507657', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas (id, encuesta_id, grado_seleccionado, fecha_respuesta, ip_address, user_agent) VALUES (8, 6, 'Secundaria - 3º UNICA', '2025-11-07 11:52:34.447129', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36') ON CONFLICT DO NOTHING;


--
-- TOC entry 4978 (class 0 OID 16716)
-- Dependencies: 228
-- Data for Name: respuestas_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (11, 2, 62, NULL, NULL, '["Satisfecho"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (12, 2, 63, NULL, 7, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (13, 2, 64, NULL, NULL, '["Poco Interesado"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (14, 2, 65, 'aasdasd', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (15, 2, 66, 'asdasdas', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (16, 2, 67, 'asdasdas', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (17, 2, 68, NULL, 5, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (18, 2, 69, NULL, 8, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (19, 2, 70, NULL, 7, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (20, 2, 71, NULL, 8, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (21, 3, 62, NULL, NULL, '["Muy Satisfecho"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (22, 3, 63, NULL, 5, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (23, 3, 64, NULL, NULL, '["Nada Interesado"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (24, 3, 65, 'sssss', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (25, 3, 66, 'ssss', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (26, 3, 67, 'ssss', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (27, 3, 68, NULL, 4, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (28, 3, 69, NULL, 5, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (29, 3, 70, NULL, 6, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (30, 3, 71, NULL, 4, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (31, 4, 62, NULL, NULL, '["Satisfecho"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (32, 4, 63, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (33, 4, 64, NULL, NULL, '["Nada Interesado"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (34, 4, 65, 'ssss', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (35, 4, 66, 'sss', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (36, 4, 67, 'sss', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (37, 4, 68, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (38, 4, 69, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (39, 4, 70, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (40, 4, 71, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (41, 5, 62, NULL, NULL, '["Nada Satisfecho"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (42, 5, 63, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (43, 5, 64, NULL, NULL, '["Nada Interesado"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (44, 5, 65, '<zx<', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (45, 5, 66, '<zx<x', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (46, 5, 67, '<xz', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (47, 5, 68, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (48, 5, 69, NULL, 4, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (49, 5, 70, NULL, 6, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (50, 5, 71, NULL, 6, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (51, 6, 62, NULL, NULL, '["Nada Satisfecho"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (52, 6, 63, NULL, 2, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (53, 6, 64, NULL, NULL, '["Poco Interesado"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (54, 6, 65, '<zx<zx', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (55, 6, 66, '<xz', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (56, 6, 67, '<xz<', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (57, 6, 68, NULL, 4, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (58, 6, 69, NULL, 6, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (59, 6, 70, NULL, 5, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (60, 6, 71, NULL, 6, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (61, 7, 62, NULL, NULL, '["Nada Satisfecho"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (62, 7, 63, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (63, 7, 64, NULL, NULL, '["Nada Interesado"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (64, 7, 65, 'xcvxc', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (65, 7, 66, 'xcvxcv', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (66, 7, 67, 'xcvxcv', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (67, 7, 68, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (68, 7, 69, NULL, 4, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (69, 7, 70, NULL, 4, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (70, 7, 71, NULL, 5, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (71, 8, 62, NULL, NULL, '["Nada Satisfecho"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (72, 8, 63, NULL, 1, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (73, 8, 64, NULL, NULL, '["Nada Interesado"]') ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (74, 8, 65, 'DSSF', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (75, 8, 66, 'SDFSDF', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (76, 8, 67, 'SDFSDF', NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (77, 8, 68, NULL, 3, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (78, 8, 69, NULL, 6, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (79, 8, 70, NULL, 4, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.respuestas_detalle (id, respuesta_id, pregunta_id, texto_respuesta, valor_numerico, opciones_seleccionadas) VALUES (80, 8, 71, NULL, 6, NULL) ON CONFLICT DO NOTHING;


--
-- TOC entry 4968 (class 0 OID 16644)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios (id, dni, nombres, apellidos, email, clave, rol, activo, created_at, updated_at) VALUES (1, '11111111', 'Administrador', 'Sistema', 'admin@vanguard.edu.pe', '$2a$10$G0zsam7alMcFJWDRqWSXX.QbBWE.E.Owmk5Xk8qUWbVCMM1ge5MNq', 'Administrador', true, '2025-11-07 10:29:49.208885', '2025-11-07 10:29:49.208885') ON CONFLICT DO NOTHING;


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 229
-- Name: configuracion_sistema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configuracion_sistema_id_seq', 1, true);


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 221
-- Name: encuestas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encuestas_id_seq', 6, true);


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 219
-- Name: grados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grados_id_seq', 22, true);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 223
-- Name: preguntas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.preguntas_id_seq', 71, true);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 227
-- Name: respuestas_detalle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.respuestas_detalle_id_seq', 80, true);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 225
-- Name: respuestas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.respuestas_id_seq', 8, true);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- TOC entry 4816 (class 2606 OID 16747)
-- Name: configuracion_sistema configuracion_sistema_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_sistema
    ADD CONSTRAINT configuracion_sistema_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 16678)
-- Name: encuestas encuestas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuestas
    ADD CONSTRAINT encuestas_pkey PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 16665)
-- Name: grados grados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grados
    ADD CONSTRAINT grados_pkey PRIMARY KEY (id);


--
-- TOC entry 4807 (class 2606 OID 16694)
-- Name: preguntas preguntas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 16723)
-- Name: respuestas_detalle respuestas_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas_detalle
    ADD CONSTRAINT respuestas_detalle_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 16709)
-- Name: respuestas respuestas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 2606 OID 16657)
-- Name: usuarios usuarios_dni_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_dni_key UNIQUE (dni);


--
-- TOC entry 4799 (class 2606 OID 16655)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4804 (class 1259 OID 16748)
-- Name: idx_encuestas_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_encuestas_estado ON public.encuestas USING btree (estado);


--
-- TOC entry 4805 (class 1259 OID 16749)
-- Name: idx_preguntas_encuesta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_preguntas_encuesta ON public.preguntas USING btree (encuesta_id);


--
-- TOC entry 4811 (class 1259 OID 16752)
-- Name: idx_respuestas_detalle_pregunta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_respuestas_detalle_pregunta ON public.respuestas_detalle USING btree (pregunta_id);


--
-- TOC entry 4812 (class 1259 OID 16751)
-- Name: idx_respuestas_detalle_respuesta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_respuestas_detalle_respuesta ON public.respuestas_detalle USING btree (respuesta_id);


--
-- TOC entry 4808 (class 1259 OID 16750)
-- Name: idx_respuestas_encuesta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_respuestas_encuesta ON public.respuestas USING btree (encuesta_id);


--
-- TOC entry 4817 (class 2606 OID 16679)
-- Name: encuestas encuestas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuestas
    ADD CONSTRAINT encuestas_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(id);


--
-- TOC entry 4818 (class 2606 OID 16695)
-- Name: preguntas preguntas_encuesta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_encuesta_id_fkey FOREIGN KEY (encuesta_id) REFERENCES public.encuestas(id) ON DELETE CASCADE;


--
-- TOC entry 4820 (class 2606 OID 16729)
-- Name: respuestas_detalle respuestas_detalle_pregunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas_detalle
    ADD CONSTRAINT respuestas_detalle_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.preguntas(id) ON DELETE CASCADE;


--
-- TOC entry 4821 (class 2606 OID 16724)
-- Name: respuestas_detalle respuestas_detalle_respuesta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas_detalle
    ADD CONSTRAINT respuestas_detalle_respuesta_id_fkey FOREIGN KEY (respuesta_id) REFERENCES public.respuestas(id) ON DELETE CASCADE;


--
-- TOC entry 4819 (class 2606 OID 16710)
-- Name: respuestas respuestas_encuesta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_encuesta_id_fkey FOREIGN KEY (encuesta_id) REFERENCES public.encuestas(id) ON DELETE CASCADE;


-- Completed on 2025-11-07 13:37:59

--
-- PostgreSQL database dump complete
--

\unrestrict 8Lc4Wvawhvog6XJHJlcFemdg0W5nrCeNwr2UC6AlUzq4RwgpuzD5NDJrotUsQd7

