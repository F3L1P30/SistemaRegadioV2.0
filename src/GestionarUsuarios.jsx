import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBare from './Menu';
import Footer from './Footer';

const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editUsuario, setEditUsuario] = useState(null);
  const [valoresEditados, setValoresEditados] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    rol: '',
    id_sistema: '',
    password: '',
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/usuario', {});
      const responseData = response.data;

      const newData = responseData.split('\n').map((jsonString) => {
        const startIndex = jsonString.indexOf('{');
        if (startIndex !== -1) {
          return JSON.parse(jsonString.slice(startIndex));
        }
        return null;
      }).filter((item) => item !== null);
      setUsuarios(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteUsuario = async (correo) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/eliminarUsuario/${correo}`);
      // Después de eliminar con éxito el usuario en el servidor, puedes volver a cargar la lista de usuarios.
      fetchData();
    } catch (error) {
      console.error('Error deleting usuario:', error);
    }
  };

  const handleEditUsuario = (usuario) => {
    setEditUsuario(usuario);
    setValoresEditados({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      rol: usuario.rol,
      id_sistema: usuario.id_sistema,
      password: usuario.password,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        nombre: valoresEditados.nombre,
        apellidos: valoresEditados.apellidos,
        correo: valoresEditados.correo,
        rol: valoresEditados.rol,
        id_sistema: valoresEditados.id_sistema,
      };
  
      // Verificar si se proporcionó una nueva contraseña
      if (valoresEditados.password) {
        updatedData.password = valoresEditados.password;
      }
  
      await axios.put(`http://127.0.0.1:8000/actualizarUsuario/${editUsuario.correo}`, updatedData);  

      // Luego de guardar los cambios con éxito, puedes limpiar el estado de editUsuario.
      setEditUsuario(null);

      // Después de guardar con éxito, volver a cargar la lista de usuarios.
      fetchData();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // equivalencia del numero para mostrar el rol con palabras
  const tipoDeUsuario = (rol) => {
      if (rol === 0) {
          return 'Administrador';
      } else {
          return 'Usuario';
      }
  };

  return (
    <div className="wrapper">
      <header>
        <NavBare className="navbar-footer" />
      </header>

      <main className="content">
        <div className="container text-center">
          <h2 className="title">Gestionar Usuarios</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Sistema</th>
                <th>Password</th>
                <th>Editar</th>
                <th>Borrar</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    {editUsuario === usuario ? (
                      <input
                        type="text"
                        value={valoresEditados.nombre}
                        onChange={(e) => setValoresEditados({ ...valoresEditados, nombre: e.target.value })}
                      />
                    ) : (
                      usuario.nombre
                    )}
                  </td>
                  <td>
                    {editUsuario === usuario ? (
                      <input
                        type="text"
                        value={valoresEditados.apellidos}
                        onChange={(e) => setValoresEditados({ ...valoresEditados, apellidos: e.target.value })}
                      />
                    ) : (
                      usuario.apellidos
                    )}
                  </td>
                  <td>
                    {editUsuario === usuario ? (
                      <input
                        type="text"
                        value={valoresEditados.correo}
                        onChange={(e) => setValoresEditados({ ...valoresEditados, correo: e.target.value })}
                      />
                    ) : (
                      usuario.correo
                    )}
                  </td>
                  <td>
                    {editUsuario === usuario ? (
                      <input
                        type="text"
                        value={valoresEditados.rol}
                        onChange={(e) => setValoresEditados({ ...valoresEditados, rol: e.target.value })}
                      />
                    ) : (
                      tipoDeUsuario(usuario.rol)
                    )}
                  </td>
                  <td>
                    {editUsuario === usuario ? (
                      <input
                        type="text"
                        value={valoresEditados.id_sistema}
                        onChange={(e) => setValoresEditados({ ...valoresEditados, id_sistema: e.target.value })}
                      />
                    ) : (
                      usuario.id_sistema
                    )}
                  </td>
                  <td>
                    {editUsuario === usuario ? (
                      <input
                        type="text"
                        value={valoresEditados.password}
                        onChange={(e) => setValoresEditados({ ...valoresEditados, password: e.target.value })}
                      />
                    ) : (
                      // No mostrar la contraseña encriptada, podrías mostrar asteriscos u ocultarla de alguna otra manera.
                      '********'
                    )}
                  </td>
                  <td>
                    {editUsuario === usuario ? (
                      <button onClick={handleSaveChanges}>Guardar</button>
                    ) : (
                      <button onClick={() => handleEditUsuario(usuario)}>Editar</button>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteUsuario(usuario.correo)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default GestionarUsuarios;