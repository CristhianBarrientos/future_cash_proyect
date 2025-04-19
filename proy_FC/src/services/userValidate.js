const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const router = express.Router();

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ROOT2024l3.',
  database: 'db_web1'
});

// Función para conectar a la base de datos
const connectDB = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error('Error en la conexión a la base de datos:', err.message);
        reject(err);
        return;
      }
      console.log("(userValidate) Conexión a bd correcta y estable");
      resolve();
    });
  });
};

// Iniciar conexión
connectDB().catch(err => {
  console.error('No se pudo establecer la conexión a la base de datos:', err);
});

// Middleware para validar los campos requeridos
const validateRequiredFields = (req, res, next) => {
  const { usuario, contrasena } = req.body;
  
  if (!usuario) {
    return res.status(400).json({ 
      success: false, 
      message: 'El campo usuario no puede ir vacío.' 
    });
  }
  
  if (!contrasena) {
    return res.status(400).json({ 
      success: false, 
      message: 'El campo de la contraseña no puede ir vacío.' 
    });
  }
  
  next();
};

/**
 * Verifica si una contraseña ingresada coincide con un hash de bcrypt almacenado.
 * @param {string} inputPassword - Contraseña ingresada por el usuario.
 * @param {string} storedPassword - Hash de bcrypt almacenado en la base de datos.
 * @returns {Promise<boolean>} - True si la contraseña coincide, false si no.
 * @throws {Error} - Si el hash no es válido o hay un error en la comparación.
 */
async function checkPassword(inputPassword, storedPassword) {
  // Validar parámetros
  if (!inputPassword || typeof inputPassword !== 'string') {
    throw new Error('La contraseña ingresada no es válida');
  }
  if (!storedPassword || typeof storedPassword !== 'string') {
    throw new Error('El hash almacenado no es válido');
  }

  // Verificar si el hash tiene el formato de bcrypt
  const isBcryptHash = storedPassword.match(/^\$2[ab]\$\d{2}\$/);
  if (!isBcryptHash) {
    throw new Error('El hash almacenado no es un hash válido de bcrypt');
  }

  try {
    // Comparar la contraseña con el hash
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    console.log(`Verificación de contraseña: ${isMatch ? 'Coincide' : 'No coincide'}`);
    return isMatch;
  } catch (error) {
    console.error('Error al verificar la contraseña:', error.message);
    throw new Error('Error al verificar la contraseña: ' + error.message);
  }
}

// Ruta para validar el inicio de sesión de usuarios
router.post('/login', validateRequiredFields, async (req, res) => {
  const { usuario, contrasena } = req.body;

  const query = 'SELECT id, usuario, contrasena_hash FROM usuarios WHERE usuario = ? AND estado = "activo"';

  try {
    // Usar promesas para ejecutar la consulta
    const queryPromise = (sql, params) => {
      return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    };

    const results = await queryPromise(query, [usuario]);
    
    // Verificar si el usuario existe
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario incorrecto o no registrado.'
      });
    }

    const usuarioDB = results[0];
    
    // Verificar la contraseña
    const passwordMatch = await checkPassword(contrasena, usuarioDB.contrasena_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Contraseña incorrecta' 
      });
    }

    // Autenticación exitosa
    res.json({ 
      success: true, 
      message: 'Login Exitoso',
      userId: usuarioDB.id
    });
    
  } catch (error) {
    console.error('Error en la autenticación:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Error interno en el servidor', 
      error: error.message 
    });
  }
});

module.exports = router;