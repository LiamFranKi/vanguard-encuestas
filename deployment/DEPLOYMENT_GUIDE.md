# 🚀 Guía de Deployment - Sistema de Encuestas Vanguard

## 📋 Información del Servidor

- **IP:** 72.60.172.101
- **Hostname:** srv1063042.hstgr.cloud
- **Usuario SSH:** root
- **Password:** Vanguard2025@&
- **Directorio:** `/var/www/encuestas/`
- **Subdominio:** `encuestas.vanguardschools.com`
- **Puerto Backend:** 5002

## ✅ Pre-requisitos

El servidor ya cuenta con:
- ✅ Node.js v20.19.5
- ✅ PostgreSQL v14.19
- ✅ Nginx v1.18.0
- ✅ PM2 v6.0.13
- ✅ Certbot (SSL)

## 📝 Paso a Paso

### 1. Conectarse al Servidor

```bash
ssh root@72.60.172.101
# Password: Vanguard2025@&
```

### 2. Crear Directorio del Proyecto

```bash
sudo mkdir -p /var/www/encuestas
cd /var/www/encuestas
```

### 3. Clonar Repositorio

```bash
git clone https://github.com/LiamFranKi/vanguard-encuestas.git .
```

### 4. Crear Base de Datos

```bash
sudo -u postgres psql

-- Dentro de PostgreSQL:
CREATE DATABASE encuestas_vanguard;
CREATE USER encuestas_user WITH PASSWORD 'Encuestas2025@Secure';
GRANT ALL PRIVILEGES ON DATABASE encuestas_vanguard TO encuestas_user;

-- Conectarse a la BD:
\c encuestas_vanguard

-- Otorgar permisos:
GRANT ALL ON SCHEMA public TO encuestas_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO encuestas_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO encuestas_user;

-- Salir:
\q
```

### 5. Importar Schema

```bash
sudo -u postgres psql -d encuestas_vanguard -f /var/www/encuestas/database/schema.sql
```

### 6. Configurar Backend

```bash
cd /var/www/encuestas/backend

# Crear archivo .env
nano .env
```

**Contenido de .env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=encuestas_vanguard
DB_USER=encuestas_user
DB_PASSWORD=Encuestas2025@Secure

PORT=5002
NODE_ENV=production
FRONTEND_URL=https://encuestas.vanguardschools.com

JWT_SECRET=vanguard_encuestas_jwt_secret_2025_change_this
JWT_EXPIRES_IN=24h

CORS_ORIGIN=https://encuestas.vanguardschools.com
```

```bash
# Instalar dependencias
npm install

# Probar que funciona
node server.js
# Ctrl+C para detener
```

### 7. Configurar Frontend

```bash
cd /var/www/encuestas/frontend

# Crear archivo .env
nano .env
```

**Contenido de .env:**
```env
VITE_API_URL=https://encuestas.vanguardschools.com/api
VITE_BACKEND_URL=https://encuestas.vanguardschools.com
```

```bash
# Instalar dependencias
npm install

# Generar build de producción
npm run build
```

### 8. Configurar PM2

```bash
cd /var/www/encuestas/backend

# Iniciar aplicación con PM2
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save

# Ver estado
pm2 list
pm2 logs encuestas-backend
```

### 9. Configurar Nginx

```bash
# Crear archivo de configuración
sudo nano /etc/nginx/sites-available/encuestas
```

**Copiar el contenido de `deployment/nginx-config.txt`**

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/encuestas /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### 10. Configurar DNS en Hostinger

1. Ir al Panel de Hostinger
2. Sección DNS
3. Agregar registro A:
   - **Nombre:** encuestas
   - **Apunta a:** 72.60.172.101
   - **TTL:** 14400

4. Esperar propagación (5-30 minutos)

### 11. Verificar DNS

```bash
ping encuestas.vanguardschools.com
# Debe resolver a 72.60.172.101
```

### 12. Configurar SSL con Certbot

```bash
sudo certbot --nginx -d encuestas.vanguardschools.com

# Seguir las instrucciones en pantalla
# Seleccionar opción 2: Redirect HTTP to HTTPS
```

### 13. Verificar Funcionamiento

```bash
# Ver logs del backend
pm2 logs encuestas-backend

# Ver estado de Nginx
sudo systemctl status nginx

# Verificar que el backend responde
curl http://localhost:5002/api/health
```

### 14. Acceder al Sistema

1. Abrir navegador: `https://encuestas.vanguardschools.com`
2. Verificar que carga el landing page
3. Ir a `/admin/login`
4. Login con:
   - **DNI:** 11111111
   - **Contraseña:** waltito10

## 🔄 Actualizar el Sistema

```bash
cd /var/www/encuestas

# Pull cambios
git pull origin master

# Backend
cd backend
npm install
pm2 restart encuestas-backend

# Frontend
cd ../frontend
npm install
npm run build

# Recargar Nginx
sudo systemctl reload nginx
```

## 🐛 Troubleshooting

### Backend no inicia

```bash
# Ver logs
pm2 logs encuestas-backend

# Reiniciar
pm2 restart encuestas-backend

# Ver procesos
pm2 list
```

### Error de permisos en PostgreSQL

```bash
sudo -u postgres psql -d encuestas_vanguard

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO encuestas_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO encuestas_user;
```

### Nginx 502 Bad Gateway

```bash
# Verificar que backend esté corriendo
pm2 list

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Frontend no carga

```bash
# Verificar que el build existe
ls -la /var/www/encuestas/frontend/dist

# Rebuild frontend
cd /var/www/encuestas/frontend
npm run build

# Verificar permisos
sudo chown -R www-data:www-data /var/www/encuestas/frontend/dist
```

## 📞 Información de Acceso

### SSH
- Host: 72.60.172.101
- User: root
- Pass: Vanguard2025@&

### PostgreSQL (local en servidor)
- Host: localhost
- Port: 5432
- Database: encuestas_vanguard
- User: encuestas_user
- Pass: Encuestas2025@Secure

### Admin del Sistema
- DNI: 11111111
- Password: waltito10

## ✅ Checklist de Deployment

- [ ] Repositorio clonado
- [ ] Base de datos creada
- [ ] Schema importado
- [ ] Permisos de PostgreSQL otorgados
- [ ] Backend configurado (.env)
- [ ] Backend instalado (npm install)
- [ ] Backend funcionando con PM2
- [ ] Frontend configurado (.env)
- [ ] Frontend build generado
- [ ] Nginx configurado
- [ ] DNS configurado
- [ ] SSL configurado
- [ ] Sistema accesible en HTTPS
- [ ] Login admin funcionando
- [ ] Encuestas mostrándose en landing
- [ ] Formulario de respuesta funcionando
- [ ] Resultados mostrándose con gráficos

## 🎉 Sistema Desplegado Exitosamente

Si completaste todos los pasos, tu sistema debería estar funcionando en:

**https://encuestas.vanguardschools.com**

¡Felicidades! 🎊

