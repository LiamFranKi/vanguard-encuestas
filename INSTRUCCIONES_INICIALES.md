# 🎯 INSTRUCCIONES INICIALES - Para Empezar YA

## ⚡ LO PRIMERO: Instalar Dependencias

### Paso 1: Backend

```bash
cd backend
npm install
```

**Esto instalará:**
- Express
- PostgreSQL driver
- JWT y Bcrypt
- CORS
- Y todas las dependencias necesarias

### Paso 2: Frontend

```bash
cd frontend
npm install
```

**Esto instalará:**
- React 18
- Vite
- React Router
- Axios
- Chart.js
- SweetAlert2

## 🗄️ Paso 3: Crear Base de Datos

### Opción A: PostgreSQL Local

```bash
# 1. Abrir PostgreSQL
psql -U postgres

# 2. Crear base de datos
CREATE DATABASE encuestas_vanguard;

# 3. Salir
\q

# 4. Importar el schema
psql -U postgres -d encuestas_vanguard -f database/schema.sql
```

### Opción B: Si tienes otro usuario de PostgreSQL

```bash
# Editar backend/.env y cambiar:
DB_USER=tu_usuario
DB_PASSWORD=tu_password
```

## 🚀 Paso 4: Iniciar el Sistema

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

**Deberías ver:**
```
✅ Servidor iniciado en puerto 5002
🌍 Entorno: development
🔗 CORS habilitado para: http://localhost:5173
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

**Deberías ver:**
```
VITE v5.0.11  ready in XXX ms

➜  Local:   http://localhost:5173/
```

## 🎉 Paso 5: Probar el Sistema

### 1. Abrir el Navegador

Ve a: **http://localhost:5173**

Deberías ver:
- 📋 Hero section con "Encuestas Vanguard Schools"
- Una tarjeta con la encuesta de ejemplo: "Encuesta de Satisfacción 2025"
- Botón "Responder Encuesta"

### 2. Probar como Usuario Público

1. Click en "Responder Encuesta"
2. Seleccionar un grado (ejemplo: "Primaria - 3º A")
3. Responder las 10 preguntas
4. Click en "Enviar Respuestas"
5. Ver mensaje de agradecimiento

### 3. Probar como Administrador

1. Click en "Administrar" (footer)
2. O ir a: **http://localhost:5173/admin/login**
3. Ingresar:
   - **DNI:** 11111111
   - **Contraseña:** waltito10
4. Ver dashboard con:
   - Total de encuestas
   - Encuestas activas
   - Total de respuestas
5. Click en el icono 📊 para ver resultados con gráficos

## ✅ Verificación Rápida

### Backend funcionando:

```bash
curl http://localhost:5002/api/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Servidor funcionando correctamente",
  "timestamp": "2025-11-07T..."
}
```

### Frontend funcionando:

Abrir: http://localhost:5173

Debería cargar sin errores.

### Base de datos funcionando:

```bash
psql -U postgres -d encuestas_vanguard -c "SELECT COUNT(*) FROM encuestas;"
```

**Respuesta esperada:**
```
 count 
-------
     1
```

## 🐛 Problemas Comunes

### ❌ Error: "Cannot connect to database"

**Solución:**
```bash
# Verificar que PostgreSQL está corriendo
sudo service postgresql status

# Si no está corriendo, iniciarlo
sudo service postgresql start
```

### ❌ Error: "Port 5002 already in use"

**Solución:**
```bash
# En backend/.env, cambiar:
PORT=5003

# Y en frontend/src/services/api.js:
const API_URL = 'http://localhost:5003/api';
```

### ❌ Error: "Login failed"

**Solución:**

El hash de la contraseña podría no ser correcto. Regenerarlo:

```bash
cd database
npm install bcryptjs
node generate-password-hash.js
```

Copiar el hash generado y ejecutar en PostgreSQL:

```sql
UPDATE usuarios 
SET clave = 'HASH_GENERADO_AQUI' 
WHERE dni = '11111111';
```

### ❌ No aparecen encuestas en el landing

**Solución:**

```bash
# Verificar que la encuesta está activa
psql -U postgres -d encuestas_vanguard -c "UPDATE encuestas SET estado='activa' WHERE id=1;"
```

## 📦 Estructura Creada

```
sistema-encuesta-padres/
├── backend/              ✅ Backend Node.js + Express
│   ├── routes/          ✅ 5 archivos de rutas
│   ├── middleware/      ✅ Autenticación JWT
│   ├── utils/           ✅ Conexión PostgreSQL
│   ├── uploads/         ✅ Carpeta para archivos
│   └── server.js        ✅ Servidor principal
├── frontend/            ✅ Frontend React + Vite
│   ├── src/
│   │   ├── pages/       ✅ 6 páginas
│   │   ├── contexts/    ✅ AuthContext
│   │   └── services/    ✅ API service
├── database/            ✅ Schema SQL
│   ├── schema.sql       ✅ Tablas + datos iniciales
│   └── generate-password-hash.js
└── deployment/          ✅ Guías de deployment
```

## 🎯 Características Implementadas

### ✅ Parte Pública
- [x] Landing page con encuestas activas
- [x] Formulario de respuesta
- [x] Selección de grado
- [x] 5 tipos de preguntas (marcar, lista, texto, escala)
- [x] Validación de campos obligatorios
- [x] Mensaje de agradecimiento
- [x] Responsive (móvil, tablet, desktop)

### ✅ Parte Admin
- [x] Login con JWT
- [x] Dashboard con estadísticas
- [x] Lista de encuestas
- [x] Cambiar estado (borrador/activa/cerrada)
- [x] Ver resultados con gráficos
- [x] Eliminar encuestas
- [x] Gráficos: Donut, Barras, Escalas

### ✅ Técnico
- [x] Base de datos PostgreSQL
- [x] API RESTful completa
- [x] Autenticación con JWT
- [x] Contraseñas encriptadas (bcrypt)
- [x] CORS configurado
- [x] Rate limiting
- [x] Helmet (seguridad)
- [x] Compression

## 📖 Próximos Pasos

1. **Probar todo localmente** ✅
2. **Hacer cambios si es necesario** 
3. **Crear repositorio en GitHub**
4. **Hacer commit y push**
5. **Seguir la guía de deployment** (deployment/DEPLOYMENT_GUIDE.md)

## 🚀 Para Deployment en Producción

Una vez que todo funcione localmente:

1. Crear repo en GitHub: `vanguard-encuestas`
2. Hacer commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Sistema de Encuestas Vanguard"
   git remote add origin https://github.com/LiamFranKi/vanguard-encuestas.git
   git push -u origin master
   ```
3. Seguir la guía completa en: **deployment/DEPLOYMENT_GUIDE.md**

## 🎊 ¡Listo para Probar!

Si llegaste hasta aquí y todo funciona:

**🎉 ¡FELICIDADES! El sistema está funcionando correctamente.**

Ahora puedes:
- ✅ Responder la encuesta de ejemplo
- ✅ Ver los resultados en el admin
- ✅ Crear nuevas encuestas (aunque esta función no está en el UI, puedes usar la API)
- ✅ Prepararte para el deployment

---

**Tiempo estimado de instalación: 10-15 minutos**  
**Dificultad: Baja** 🟢

