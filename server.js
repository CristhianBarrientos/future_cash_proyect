const express = require('express'); // Framework para manejar rutas y APIs
const mysql = require('mysql2'); // Cliente para conectarse a MySQL
const bodyParser = require('body-parser'); // Middleware para procesar datos JSON
const cors = require('cors'); // Middleware para permitir solicitudes de diferentes dominios
const path = require('path'); // Módulo para manejar rutas de archivos

const app = express(); // inicializacion de la app de Express
const PORT = process.env.PORT || 1000;

// Middleware
app.use(bodyParser.json()); // aqui se procesan los datos en formato json en las solicitudes
app.use(cors());  // deja solicitudes de diferentes dominios

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '../')));

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost', //host
  user: 'root', //usr
  password: 'ROOT2024l3.', //psswd 
  database: 'db_web1' // bd
});

db.connect((err) => {
  if (err) {
    console.error('Error en la conexion a bd', err.message);
    return;
  }
  console.log('Conexion estable suu');
});


// Ruta para servir el archivo HTML principal
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '../login.html'));
  res.sendFile(path.join(__dirname, 'public', 'login.html'));

});

// Servicio que maneja los datos de inicio de sesion
app.post('/api/usuarios/login', (req, res) => {
  // estraccion de los datos que se envian a la bd
  const { usuario, contrasena } = req.body;

  // query de consuulta para comparacion de datos
  const query = 'SELECT usuario, contrasena_hash FROM usuarios WHERE usuario = ? AND estado = "activo"';
  // query = 'UPDATE usuarios set ultimo_acceso = ?';

  db.query(query, [usuario], (err, results) => {

    if (err) {
        console.error('Error en la consulta: ', err);
        res.status(500).json({ message: 'Error en el servidor' });
        return;
      }

      if (results.length > 0) {
        // Se compara la contrasenia ingresada con la que esta en bd
        const usuarioDB = results[0];
        if (contrasena === usuarioDB.contrasena_hash) {
          res.json({ success: true, message: 'Lógica Exitosa' });
        } else {
          res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }
        //res.json({ success: true, user: results[0] });
      } else {
        res.status(401).json({ success: false, message: 'las credenciales no coinciden con los datos de bd' });
      }


  });

});

app.get('/api/imagenes/:nombre', (req, res) => {
  const { nombre } = req.params;

  const imagen = path.join(__dirname, 'public', 'imagenes', nombre);

  res.sendFile(imagen, (err) => {

    if (err) {
      console.error('Error al enviar la imagen al srv');
      res.status(404).json({ message: 'La imagen no se encontro' });
    }

  });


});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
