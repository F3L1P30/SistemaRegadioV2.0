const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');
const PORT = 8000;

const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();
app.use(cors());

app.use(express.json());
app.use(cors()); // Habilita CORS para permitir solicitudes desde otros dominios.

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'prueba',
  password: '123456',
  port: '3306',
  database: 'modbus',
  connectionLimit: 10 // Número máximo de conexiones en el pool
});


// Middleware para manejar errores de conexión
pool.on('error', (err) => {
  console.error('Error en el pool de conexiones:', err);
});

// Función para ejecutar consultas SQL con promesas
function queryPromise(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


// medidor
app.get('/medidor', (req, res) => {
  // Configura una conexión SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Escucha los cambios en la base de datos y envía actualizaciones SSE al cliente
  const query = pool.query("SELECT * FROM medidor");
  query
    .stream()
    .on('data', (row) => {
      const eventData = `data: ${JSON.stringify(row)}\n\n`;
      res.write(eventData);
    })
    .on('end', () => {
      res.end();
    });
});

app.post('/medidor', (req, res) => {
  const datos = req.body;
  datos.otro_dato = JSON.stringify(datos.otro_dato);
  // Insertar los datos en la tabla medidor
  const insertQuery = 'INSERT INTO medidor SET ?';
  pool.query(insertQuery, datos, (error, results) => {
    if (error) {
      console.error('Error al insertar los datos medidor de agua:', error);
      res.status(500).json({ mensaje: 'Error al insertar los datos medidor de agua' });
    } else {
      console.log('Datos medidor de agua insertados correctamente');
      res.json({ mensaje: 'Datos medidor de agua insertados correctamente' });

      // Actualizar el valor del contador de autoincremento
      const updateQuery = 'ALTER TABLE medidor AUTO_INCREMENT = ?';
      pool.query(updateQuery, [results.insertId + 1], (error, results) => {
        if (error) {
          console.error('Error al actualizar el contador de autoincremento:', error);
        } else {
          console.log('Contador de autoincremento actualizado en medidor');
        }
      });
    }
  });

  console.log('Datos medidor de agua recibidos:', datos);
});

// Medidores
app.get('/medidores', (req, res) => {
  // Configura una conexión SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Escucha los cambios en la base de datos y envía actualizaciones SSE al cliente
  const query = pool.query("SELECT * FROM medidores");
  query
    .stream()
    .on('data', (row) => {
      const eventData = `data: ${JSON.stringify(row)}\n\n`;
      res.write(eventData);
    })
    .on('end', () => {
      res.end();
    });
});

app.post('/medidores', (req, res) => {
  const datos = req.body;
  const id_medidor = datos.id_medidor; // Obtén el valor de id_medidor de los datos recibidos

  // Verifica si el valor de id_medidor ya existe en la tabla medidores
  const selectQuery = 'SELECT id_medidor FROM medidores WHERE id_medidor = ?';
  pool.query(selectQuery, id_medidor, (error, results) => {
    if (error) {
      console.error('Error al verificar la existencia del medidor:', error);
      res.status(500).json({ mensaje: 'Error al verificar la existencia del medidor' });
    } else {
      if (results.length > 0) {
        // El valor ya existe en la tabla medidores
        console.log('El valor de id_medidor ya está almacenado');
        res.status(409).json({ mensaje: 'El valor de id_medidor ya está almacenado' });
      } else {
        // El valor no existe en la tabla medidores, por lo que se puede insertar
        console.log('Datos del medidor recibidos:', datos);

        // Insertar los datos en la tabla medidores
        const insertQuery = 'INSERT INTO medidores SET ?';
        pool.query(insertQuery, datos, (error, results) => {
          if (error) {
            console.error('Error al insertar los datos del medidor:', error);
            res.status(500).json({ mensaje: 'Error al insertar los datos del medidor' });
          } else {
            console.log('Datos del medidor insertados correctamente');
            res.json({ mensaje: 'Datos del medidor insertados correctamente' });
          }
        });
      }
    }
  });
});

app.delete('/medidores/:id', (req, res) => {
  const id = req.params.id;

  // Realizar la eliminación en la base de datos
  const deleteQuery = 'DELETE FROM medidores WHERE id_medidor = ?';
  pool.query(deleteQuery, id, (error, results) => {
    if (error) {
      console.error('Error al eliminar los datos del medidor:', error);
      res.status(500).json({ mensaje: 'Error al eliminar los datos del medidor' });
    } else {
      console.log('Datos del medidor eliminados correctamente');
      res.json({ mensaje: 'Datos del medidor eliminados correctamente' });
    }
  });

  console.log('ID del medidor recibido:', id);
});

// Usuarios
// Obtener usuarios de la base de datos
app.get('/usuario', (req, res) => {
  const query = pool.query('SELECT nombre, apellidos, correo, rol, id_sistema FROM usuario');
  query.stream().on('data', (row) => {
    const eventData = `data: ${JSON.stringify(row)}\n\n`;
    res.write(eventData);
  }).on('end', () => {
    res.end();
  });
});

// Endpoint para iniciar sesión
app.post('/iniciarSesion', async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Obtener el usuario por correo
    const userQuery = 'SELECT * FROM usuario WHERE correo = ?';
    const userData = await queryPromise(userQuery, [correo]);

    if (userData.length === 0) {
      // No se encontró un usuario con el correo proporcionado
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    } else {
      // Verificar la contraseña utilizando bcrypt
      const hashedPassword = userData[0].password;
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);

      if (isPasswordValid) {
        // La contraseña es válida, puedes generar un token JWT si lo deseas
        // const token = jwt.sign({ correo: userData[0].correo, rol: userData[0].rol }, 'secreto');

        // Responder con un mensaje de éxito y opcionalmente el token
        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: userData[0] });
      } else {
        // La contraseña no es válida
        res.status(401).json({ mensaje: 'Credenciales incorrectas' });
      }
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});

// Endpoint para agregar un nuevo usuario
app.post('/registrarUsuario', async (req, res) => {
  const { nombre, apellidos, correo, password, rol, id_sistema } = req.body;

  try {
    // Verifica si el correo ya existe en la tabla usuario
    const userQuery = 'SELECT * FROM usuario WHERE correo = ?';
    const existingUser = await queryPromise(userQuery, [correo]);

    if (existingUser.length > 0) {
      // El correo ya existe en la tabla usuario
      res.status(409).json({ mensaje: 'El correo ya está registrado' });
    } else {
      // El correo no existe en la tabla usuario, por lo que se puede insertar
      console.log('Datos del usuario recibidos:', req.body);

      // Encriptar la contraseña antes de almacenarla en la base de datos
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar los datos en la tabla usuario, incluyendo la contraseña encriptada
      const newUser = { nombre, apellidos, correo, password: hashedPassword, rol, id_sistema };
      const insertUserQuery = 'INSERT INTO usuario SET ?';
      await queryPromise(insertUserQuery, newUser);

      console.log('Datos del usuario insertados correctamente');
      res.json({ mensaje: 'Datos del usuario insertados correctamente' });
    }
  } catch (error) {
    console.error('Error al registrar al usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar al usuario' });
  }
});

// Endpoint para eliminar un usuario por correo
app.delete('/eliminarUsuario/:correo', async (req, res) => {
  const correo = req.params.correo;

  try {
    // Verificar si el usuario existe en la base de datos
    const existingUser = await new Promise((resolve, reject) => {
      pool.query('SELECT correo FROM usuario WHERE correo = ?', correo, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });

    if (!existingUser) {
      // El usuario no existe en la tabla usuario
      console.log('El usuario no existe en la base de datos');
      return res.status(404).json({ mensaje: 'El usuario no existe en la base de datos' });
    }

    // Realizar la eliminación en la base de datos
    const query = pool.query('DELETE FROM usuario WHERE correo = ?', correo, (error, results) => {
      if (error) {
        console.error('Error al eliminar los datos del usuario:', error);
        res.status(500).json({ mensaje: 'Error al eliminar los datos del usuario' });
      } else {
        console.log('Datos del usuario eliminados correctamente');
        res.json({ mensaje: 'Datos del usuario eliminados correctamente' });
      }
    });

    console.log('Correo del usuario recibido:', correo);
  } catch (error) {
    console.error('Error al verificar la existencia del usuario:', error);
    res.status(500).json({ mensaje: 'Error al verificar la existencia del usuario' });
  }
});

// Endpoint para actualizar los datos de un usuario por correo
app.put('/actualizarUsuario/:correo', async (req, res) => {
  const correo = req.params.correo;
  const { nombre, apellidos, correo: nuevoCorreo, rol, id_sistema, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const existingUser = await new Promise((resolve, reject) => {
      pool.query('SELECT correo FROM usuario WHERE correo = ?', correo, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });

    if (!existingUser) {
      // El usuario no existe en la tabla usuario
      console.log('El usuario no existe en la base de datos');
      return res.status(404).json({ mensaje: 'El usuario no existe en la base de datos' });
    }

    // Construir los nuevos datos del usuario
    const updatedUserData = {
      nombre,
      apellidos,
      correo: nuevoCorreo, // Utiliza nuevoCorreo para actualizar el correo
      rol,
      id_sistema,
    };

    // Verificar si se proporcionó una nueva contraseña y encriptarla si es necesario
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUserData.password = hashedPassword;
    }

    // Actualizar los datos del usuario en la base de datos
    const query = pool.query('UPDATE usuario SET ? WHERE correo = ?', [updatedUserData, correo], (error, results) => {
      if (error) {
        console.error('Error al actualizar los datos del usuario:', error);
        res.status(500).json({ mensaje: 'Error al actualizar los datos del usuario' });
      } else {
        console.log('Datos del usuario actualizados correctamente');
        res.json({ mensaje: 'Datos del usuario actualizados correctamente' });
      }
    });
  } catch (error) {
    console.error('Error al verificar la existencia del usuario:', error);
    res.status(500).json({ mensaje: 'Error al verificar la existencia del usuario' });
  }
});

// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/tryallregadio.dyndns.org/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tryallregadio.dyndns.org/fullchain.pem'),
}, app);

httpServer.listen(8000, () => {
    console.log('HTTP Server running on port 8000');
});

httpsServer.listen(8002, () => {
    console.log('HTTPS Server running on port 8002');
});