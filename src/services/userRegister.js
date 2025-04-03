// userRegister.js
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
    console.error('Error en la conexión a base de datos: ', err.message);
    return;
  }
  console.log("Conexión a bd correcta y estable");
});

// Servicio para insertar usuarios nuevos a la base de datos
router.post('/signup', (req, res) => {
  const now = new Date();
  const fecha_creacion = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  const { firstName, secondName, frstLastName, scndLastName, email, username, password } = req.body;

  const query1 = 'INSERT INTO personas(primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, email, fecha_creacion) VALUES( ?, ?, ?, ?, ?, ?);';
  const query2 = 'INSERT INTO usuarios(persona_id, usuario, contrasena_hash, ultimo_acceso, estado) VALUES(?, ?, ?, ?, 1);';

  // Iniciar la transacción
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar transacción:', err.message);
      return res.status(500).json({ message: 'Error en el servidor 1', err });
    }

    // Insertar en la tabla personas
    db.query(query1, [firstName, secondName, frstLastName, scndLastName, email, fecha_creacion], (err1, result1) => {
      if (err1) {
        console.error('Error en la consulta 1: ', err1.message);
        // alert("Respuesta del servidor:" ,err1.message);
        return db.rollback(() => {
          res.status(500).json({ message: 'Error en el servidor 2 (La persona no se inserto)', err: err1.message });
        });
      }

      // Capturar el personaId generado por la inserción en personas
      const personaId = result1.insertId;

      // Insertar en la tabla usuarios usando el personaId
      db.query(query2, [personaId, username, password, fecha_creacion], (err2, result2) => {
        if (err2) {
          console.error('Error en la consulta 2: ', err2.message);
          return db.rollback(() => {
            res.status(500).json({ message: 'Error en el servidor 3 (El usuario no se inserto)', err: err2 });
          });
        }

        // Si ambas consultas son exitosas, hacer commit
        db.commit((errCommit) => {
          if (errCommit) {
            console.error('Error al hacer commit:', errCommit.message);
            return db.rollback(() => {
              res.status(500).json({ message: 'Error en el servidor', err: errCommit });
            });
          }
          // Enviar respuesta al cliente solo después de completar la transacción
          res.status(201).json({ message: 'Usuario registrado correctamente' });
        });
      });
    });
  });
});

module.exports = router;