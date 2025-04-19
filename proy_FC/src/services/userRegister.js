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

// Conectar a la base de datos
const connectDB = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error('Error en la conexión a la base de datos:', err.message);
        reject(err);
        return;
      }
      console.log("(userRegister) Conexión a bd correcta y estable");
      resolve();
    });
  });
};

// Iniciar conexión
connectDB().catch(err => {
  console.error('No se pudo establecer la conexión a la base de datos:', err);
});

// Middleware para validar campos requeridos
const validateRequiredFields = (req, res, next) => {
  const { firstName, frstLastName, email, age, genre, username, password } = req.body;
  
  if (!firstName) {
    return res.status(400).json({ success: false, message: 'El primer nombre es obligatorio' });
  }
  
  if (!frstLastName) {
    return res.status(400).json({ success: false, message: 'El primer apellido es obligatorio' });
  }
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'El email es obligatorio' });
  }
  
  if (!age) {
    return res.status(400).json({ success: false, message: 'La fecha de nacimiento es obligatoria' });
  }
  
  if (!genre) {
    return res.status(400).json({ success: false, message: 'El género es obligatorio' });
  }
  
  if (!username) {
    return res.status(400).json({ success: false, message: 'El nombre de usuario es obligatorio' });
  }
  
  if (!password) {
    return res.status(400).json({ success: false, message: 'La contraseña es obligatoria' });
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'El formato del email no es válido' });
  }
  
  // Validar formato de fecha de nacimiento (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(age)) {
    return res.status(400).json({ success: false, message: 'El formato de la fecha de nacimiento no es válido' });
  }
  
  // Validar género
  if (!['M', 'F'].includes(genre)) {
    return res.status(400).json({ success: false, message: 'El género debe ser M o F' });
  }

  next();
};

// Función para verificar si el usuario o email ya existen
const checkExistingUser = (username, email) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT u.usuario, p.email 
      FROM usuarios u 
      JOIN personas p ON u.persona_id = p.id 
      WHERE u.usuario = ? OR p.email = ?
    `;
    
    db.query(query, [username, email], (err, results) => {
      if (err) {
        return reject(err);
      }
      
      if (results.length > 0) {
        const isDuplicateUsername = results.some(row => row.usuario === username);
        const isDuplicateEmail = results.some(row => row.email === email);
        
        if (isDuplicateUsername && isDuplicateEmail) {
          return reject(new Error('El usuario y el email ya están registrados'));
        } else if (isDuplicateUsername) {
          return reject(new Error('El nombre de usuario ya está registrado'));
        } else if (isDuplicateEmail) {
          return reject(new Error('El email ya está registrado'));
        }
      }
      
      resolve();
    });
  });
};

// Servicio para insertar usuarios nuevos
router.post('/signup', validateRequiredFields, async (req, res) => {
  const now = new Date();
  const fecha_creacion = now.toISOString().slice(0, 19).replace('T', ' ');

  const { 
    firstName, 
    secondName = '', 
    frstLastName, 
    scndLastName = '', 
    age,
    email, 
    genre,
    username, 
    password 
  } = req.body;

  try {
    // Verificar si el usuario o email ya existen
    await checkExistingUser(username, email);
    
    // Hashear la contraseña con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Iniciar la transacción
    const beginTransaction = () => {
      return new Promise((resolve, reject) => {
        db.beginTransaction(err => {
          if (err) reject(err);
          else resolve();
        });
      });
    };
    
    const executeQuery = (query, params) => {
      console.log('Consulta:', query, 'Parámetros:', params); // Depuración
      return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };
    
    const commitTransaction = () => {
      return new Promise((resolve, reject) => {
        db.commit(err => {
          if (err) reject(err);
          else resolve();
        });
      });
    };
    
    await beginTransaction();
    
    // Insertar en la tabla personas
    const query1 = 'INSERT INTO personas(primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, email, fecha_nacimiento, sexo, fecha_creacion) VALUES(?, ?, ?, ?, ?, ?, ?, ?);';
    const params1 = [firstName, secondName, frstLastName, scndLastName, email, age, genre, fecha_creacion];
    const result1 = await executeQuery(query1, params1);
    
    // Capturar el personaId
    const personaId = result1.insertId;
    
    // Insertar en la tabla usuarios
    const query2 = 'INSERT INTO usuarios(persona_id, usuario, contrasena_hash, ultimo_acceso, estado, tipo_usuario) VALUES(?, ?, ?, ?, ?, ?);';
    const params2 = [personaId, username, hashedPassword, fecha_creacion, 'activo', 'cliente'];
    await executeQuery(query2, params2);
    
    // Confirmar la transacción
    await commitTransaction();
    
    // Enviar respuesta
    res.status(201).json({ 
      success: true,
      message: 'Usuario registrado correctamente' 
    });
    
  } catch (error) {
    console.error('Error en el registro:', error.message);
    
    const rollbackTransaction = () => {
      return new Promise((resolve, reject) => {
        db.rollback(() => resolve());
      });
    };

    try {
      await rollbackTransaction();
    } catch (rollbackError) {
      console.error('Error al revertir la transacción:', rollbackError.message);
    }
    
    if (error.message.includes('ya está registrado')) {
      return res.status(409).json({ 
        success: false,
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor durante el registro',
      error: error.message 
    });
  }
});

module.exports = router;