# 📋 Sistema de Encuestas Vanguard Schools

Sistema web de encuestas para padres de familia de Vanguard Schools. Permite a los administradores crear y gestionar encuestas, y a los padres responderlas de forma anónima sin necesidad de login.

## 🚀 Características

### Parte Pública
- ✅ Landing page con encuestas activas
- ✅ Formulario de encuesta con múltiples tipos de preguntas
- ✅ Respuestas anónimas (sin registro)
- ✅ 5 tipos de preguntas: Marcar, Lista, Texto corto, Texto largo, Escala
- ✅ Responsive (móvil, tablet, desktop)

### Parte Administrativa
- ✅ Login con JWT
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de encuestas
- ✅ Editor visual de preguntas (drag & drop)
- ✅ Resultados con gráficos (Chart.js)
- ✅ Exportación de resultados
- ✅ Gestión de grados escolares
- ✅ Borrado de respuestas de prueba

## 🛠️ Stack Tecnológico

**Backend:**
- Node.js 20.x
- Express 4
- PostgreSQL 14+
- JWT para autenticación
- Bcrypt para contraseñas

**Frontend:**
- React 18
- Vite 5
- React Router DOM
- Axios
- Chart.js + react-chartjs-2
- SweetAlert2

## 📁 Estructura del Proyecto

```
sistema-encuesta-padres/
├── backend/
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middlewares (auth)
│   ├── utils/           # Utilidades (DB)
│   ├── server.js        # Servidor principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # Páginas públicas y admin
│   │   ├── contexts/    # Context API (Auth)
│   │   ├── services/    # Servicios API
│   │   └── App.jsx
│   └── package.json
├── database/
│   └── schema.sql       # Schema PostgreSQL
└── deployment/
    ├── DEPLOYMENT_GUIDE.md
    └── nginx-config.txt
```

## 🔧 Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/LiamFranKi/vanguard-encuestas.git
cd vanguard-encuestas
```

### 2. Configurar Base de Datos
```bash
# Crear base de datos en PostgreSQL
psql -U postgres
CREATE DATABASE encuestas_vanguard;
\q

# Importar schema
psql -U postgres -d encuestas_vanguard -f database/schema.sql
```

### 3. Configurar Backend
```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

### 4. Configurar Frontend
```bash
cd frontend
npm install

# Crear archivo .env
echo "VITE_API_URL=http://localhost:5002/api" > .env
```

### 5. Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Acceder al Sistema
- **Público:** http://localhost:5173
- **Admin:** http://localhost:5173/admin/login
  - DNI: `11111111`
  - Contraseña: `waltito10`

## 🌐 Deployment en Hostinger VPS

Ver guía completa en: `deployment/DEPLOYMENT_GUIDE.md`

**Servidor:**
- IP: 72.60.172.101
- Subdominio: encuestas.vanguardschools.com
- Puerto Backend: 5002

## 📊 Tipos de Preguntas

1. **Marcar (Radio/Checkbox)** - Selección única o múltiple
2. **Lista (Dropdown)** - Menú desplegable
3. **Texto Corto** - Input de texto
4. **Texto Largo** - Textarea
5. **Escala (1-10)** - Botones numéricos

## 🔑 Usuario Administrador

**Por defecto:**
- DNI: `11111111`
- Contraseña: `waltito10`

## 📝 API Endpoints

### Público
- `GET /api/encuestas/publicas` - Listar encuestas activas
- `GET /api/encuestas/:id` - Obtener encuesta con preguntas
- `POST /api/respuestas/guardar` - Guardar respuesta
- `GET /api/grados` - Obtener grados activos

### Admin (requiere token)
- `POST /api/auth/login` - Login
- `GET /api/encuestas/admin` - Listar todas las encuestas
- `POST /api/encuestas` - Crear encuesta
- `PUT /api/encuestas/:id` - Actualizar encuesta
- `DELETE /api/encuestas/:id` - Eliminar encuesta
- `GET /api/resultados/encuesta/:id` - Obtener resultados
- `DELETE /api/respuestas/encuesta/:id` - Borrar respuestas
- `GET /api/grados/admin` - Gestión de grados

## 📱 Responsive Design

- ✅ Móviles: 320px - 767px
- ✅ Tablets: 768px - 1024px
- ✅ Desktop: 1025px+

## 🎨 Diseño

**Paleta de colores:**
- Primary: #1976d2 (azul)
- Secondary: #7c3aed (púrpura)
- Success: #10b981 (verde)
- Danger: #ef4444 (rojo)
- Warning: #f59e0b (naranja)

## 📄 Licencia

© 2025 Vanguard Schools. Todos los derechos reservados.

## 👨‍💻 Desarrollo

Desarrollado para Vanguard Schools como parte del ecosistema de aplicaciones web del colegio.

**Otros sistemas:**
- Calendar: calendar.vanguardschools.com (puerto 5000)
- Estadísticas: estadisticas.vanguardschools.com (puerto 5001)
- Encuestas: encuestas.vanguardschools.com (puerto 5002)
