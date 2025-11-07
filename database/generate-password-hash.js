// Script para generar hash de contraseña con bcrypt
// Uso: node generate-password-hash.js

const bcrypt = require('bcryptjs');

const password = 'waltito10';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar hash:', err);
    return;
  }
  
  console.log('\n===========================================');
  console.log('HASH DE CONTRASEÑA GENERADO:');
  console.log('===========================================');
  console.log('Contraseña:', password);
  console.log('Hash:', hash);
  console.log('\n===========================================');
  console.log('QUERY SQL PARA INSERTAR USUARIO:');
  console.log('===========================================');
  console.log(`
INSERT INTO usuarios (dni, nombres, apellidos, email, clave, rol) 
VALUES (
  '11111111',
  'Administrador',
  'Sistema',
  'admin@vanguard.edu.pe',
  '${hash}',
  'Administrador'
);
  `);
  console.log('===========================================\n');
});

