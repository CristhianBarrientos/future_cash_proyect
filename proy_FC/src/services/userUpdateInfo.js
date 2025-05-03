const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ROOT2024l3.',
    database: 'db_web1'
});

db.connect((err) => {
    if (err) console.error('Error en la conexión a base de datos: ', err.message);
    else console.log("(updateUserInfo) Conexión a bd correcta y estable");
  });

  router.put('updateInfo', (req, res) => {
    
  });

  module.exports = router;