# 🚀 GUÍA RÁPIDA - Sistema de Encuestas Vanguard

## ⚡ Inicio Rápido (Desarrollo Local)

### 1️⃣ Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 2️⃣ Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear BD
CREATE DATABASE encuestas_vanguard;

# Salir
\q

# Importar schema
psql -U postgres -d encuestas_vanguard -f database/schema.sql
```

### 3️⃣ Configurar Variables de Entorno

El archivo `.env` ya existe en `backend/` con configuración por defecto para desarrollo local.

**Si usas otro usuario de PostgreSQL, edita `backend/.env`**

### 4️⃣ Generar Hash de Contraseña (Opcional)

Si el usuario admin no funciona, genera un nuevo hash:

```bash
cd database
npm install bcryptjs
node generate-password-hash.js
```

Copia el hash generado y actualiza la contraseña en la base de datos.

### 5️⃣ Iniciar Servidores

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Backend corriendo en http://localhost:5002

# Terminal 2 - Frontend
cd frontend
npm run dev
# Frontend corriendo en http://localhost:5173
```

### 6️⃣ Acceder al Sistema

- **Landing Público:** http://localhost:5173
- **Admin Login:** http://localhost:5173/admin/login
  - DNI: `11111111`
  - Contraseña: `waltito10`

## 📱 Funcionalidades

### Parte Pública
- ✅ Ver encuestas activas
- ✅ Responder encuestas (anónimo)
- ✅ Seleccionar grado del estudiante
- ✅ Responder diferentes tipos de preguntas

### Parte Admin
- ✅ Login con DNI y contraseña
- ✅ Dashboard con estadísticas
- ✅ Ver lista de encuestas
- ✅ Cambiar estado de encuestas (borrador/activa/cerrada)
- ✅ Ver resultados con gráficos
- ✅ Eliminar encuestas

## 🎯 Encuesta de Ejemplo

El schema incluye una encuesta de ejemplo con **10 preguntas** ya creada:
- Título: "Encuesta de Satisfacción 2025"
- Estado: Activa
- Preguntas variadas (marcar, escala, texto, lista)

## 🔧 Comandos Útiles

```bash
# Ver estado de la base de datos
psql -U postgres -d encuestas_vanguard -c "\dt"

# Ver usuarios registrados
psql -U postgres -d encuestas_vanguard -c "SELECT * FROM usuarios;"

# Ver encuestas
psql -U postgres -d encuestas_vanguard -c "SELECT id, titulo, estado FROM encuestas;"

# Ver respuestas
psql -U postgres -d encuestas_vanguard -c "SELECT COUNT(*) FROM respuestas;"
```

## 📊 Estructura de la Base de Datos

- `usuarios` - Administradores del sistema
- `grados` - Grados escolares (Inicial, Primaria, Secundaria)
- `encuestas` - Encuestas creadas
- `preguntas` - Preguntas de cada encuesta
- `respuestas` - Respuestas de padres
- `respuestas_detalle` - Detalle de cada respuesta por pregunta

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
sudo service postgresql status

# Iniciar PostgreSQL
sudo service postgresql start
```

### Puerto 5002 o 5173 ya en uso

```bash
# Cambiar puerto en backend/.env
PORT=5003

# Cambiar puerto en frontend (vite.config.js)
server: { port: 5174 }
```

### No aparecen las encuestas

```bash
# Verificar que hay encuestas activas
psql -U postgres -d encuestas_vanguard -c "SELECT * FROM encuestas WHERE estado='activa';"

# Si no hay, activar la encuesta de ejemplo
psql -U postgres -d encuestas_vanguard -c "UPDATE encuestas SET estado='activa' WHERE id=1;"
```

### Error al hacer login

```bash
# Verificar que el usuario existe
psql -U postgres -d encuestas_vanguard -c "SELECT dni, nombres FROM usuarios;"

# Regenerar hash de contraseña
cd database
node generate-password-hash.js
# Actualizar en la BD
```

## 🚀 Siguiente Paso: Deployment

Cuando esté listo para producción, sigue la guía completa en:
**`deployment/DEPLOYMENT_GUIDE.md`**

## 📞 Información Adicional

- **Documentación Completa:** README.md
- **Especificaciones:** PROYECTO_ENCUESTAS_ESPECIFICACIONES.md
- **Deployment:** deployment/DEPLOYMENT_GUIDE.md

---

**¡Listo para desarrollar! 🎉**

