// userValidate.js
const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ROOT2024l3.',
  database: 'db_web1'
});

db.connect((err) => {
  if (err) {
    console.error('Error en la conexión a la base de datos:', err.message);
    return;
  }
  console.log("(userValidate) Conexión a bd correcta y estable");
});

// Ruta para validar el inicio de sesión de usuarios
router.post('/login', (req, res) => {
  const 
  { 
    usuario, 
    contrasena 
  } = req.body;

  const query = 'SELECT usuario, contrasena_hash FROM usuarios WHERE usuario = ? AND estado = "activo"';

  db.query(query, [usuario], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err.message);
      return res.status(500).json({ message: 'Error en el servidor', err });
    }

    if (results.length > 0) {
      const usuarioDB = results[0];
      if (contrasena === usuarioDB.contrasena_hash) {
        res.json({ success: true, message: 'Lógica Exitosa' });
      } else {
        res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
      }
    } else {
      res.status(204).json({ success: false, message: 'Completa los campos antes de realizar la consulta.' });
    }
  });
});

module.exports = router;