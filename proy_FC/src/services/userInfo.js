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
    else console.log("(userInfo) Conexión a bd correcta y estable");
  });

router.post('/info', (req, res) => {
    const { usuario } = req.body;
    const query = 'SELECT CONCAT(p.primer_nombre, " ", p.segundo_nombre) nombres, CONCAT(p.primer_apellido, " ", p.segundo_apellido) apellidos, u.usuario, p.email FROM usuarios u INNER JOIN personas p ON u.persona_id = p.id WHERE u.usuario = ? AND u.estado = "activo"';
    db.query(query, [usuario], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor', err });
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    });
});

module.exports = router;