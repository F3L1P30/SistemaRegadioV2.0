import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBare from './Menu';
import Footer from './Footer';
import { useAuth } from './AuthContext';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GestionarUsuarios = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [editUsuario, setEditUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [nombreError, setNombreError] = useState(false);
  const [apellidosError, setApellidosError] = useState(false);
  const [correoError, setCorreoError] = useState(false);
  const [rolError, setRolError] = useState(false);
  const [id_SistemaError, setId_SistemaError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [valoresEditados, setValoresEditados] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    rol: '',
    id_sistema: '',
    password: '',
  });

  const limpiar = () => {
    setEditUsuario(null);
    setNombreError(false);
    setApellidosError(false);
    setCorreoError(false);
    setRolError(false);
    setId_SistemaError(false);
    setPasswordError(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL_HTTPS}usuario`, {});
      const responseData = response.data;

      const newData = responseData.split('\n').map((jsonString) => {
        const startIndex = jsonString.indexOf('{');
        if (startIndex !== -1) {
          return JSON.parse(jsonString.slice(startIndex));
        }
        return null;
      }).filter((item) => {
        // Reemplaza 'rol' por la propiedad específica que contiene el rol en tu objeto
        console.log(user.rol);
        return item !== null && item.rol > user.rol;
      });
      setUsuarios(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleDeleteUsuario = async (correo) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL_HTTPS}eliminarUsuario/${correo}`);
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

      //validacion de nombre
      if (valoresEditados.nombre.trim() === '') {
        setNombreError('Debe ingresar un nombre');
        return;
      } else if (valoresEditados.nombre.length > 50) {
        setNombreError('Debe ingresar un nombre menor a 50 caracteres');
        return;
      }

      //validacion de apellidos
      if (valoresEditados.apellidos.trim() === '' ) {
        setApellidosError('Debe ingresar un apellido');
        return;
      } else if (valoresEditados.apellidos.length > 50) {
        setApellidosError('Debe ingresar un apellido menor a 50 caracteres');
        return;
      }

      //validacion de correo
      if (valoresEditados.correo.trim() === '') {
        setCorreoError('Debe ingresar un correo electrónico');
        return;
      } else if (!/^\S+@\S+\.\S+$/.test(valoresEditados.correo.trim())) {
        setCorreoError('Debe ingresar un correo electrónico real');
        return;
      }

      //validacion de rol
      if (valoresEditados.rol === '') {
        setRolError('Debe ingresar un rol');
        return;
      }

      //validacion de id_sistema
      if (valoresEditados.id_sistema.trim() === '') {
        setId_SistemaError('Debe ingresar el nombre del sistema');
        return;
      } else if (valoresEditados.id_sistema.length > 50) {
        setId_SistemaError('Debe ingresar un nombre de sistema menor a 50 caracteres');
        return;
      }

      //validacion de contraseña
      if (valoresEditados.password) {
        if (valoresEditados.password.length < 8) {
          setPasswordError('La contraseña debe tener al menos 8 caracteres');
          return;
        } else if (valoresEditados.password.length > 20) { // Ejemplo de límite superior (ajustable)
          setPasswordError('La contraseña no puede tener más de 20 caracteres');
          return;
        } else if (!/[A-Z]/.test(valoresEditados.password)) {
          setPasswordError('La contraseña debe contener al menos una letra mayúscula');
          return;
        } else if (!/[a-z]/.test(valoresEditados.password)) {
          setPasswordError('La contraseña debe contener al menos una letra minúscula');
          return;
        } else if (!/\d/.test(valoresEditados.password)) {
          setPasswordError('La contraseña debe contener al menos un número');
          return;
        } else if (!/[@$!%*?&]/.test(valoresEditados.password)) {
          setPasswordError('La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, &)');
          return;
        } 
      }

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
  
      await axios.put(`${process.env.REACT_APP_URL_HTTPS}actualizarUsuario/${editUsuario.correo}`, updatedData);  

      // Limpiar el estado de editUsuario y los errores en falso.
      limpiar();

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

  const filtrarUsuariosBuscador = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.id_sistema.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="wrapper">
      <header>
        <NavBare className="navbar-footer" />
      </header>

      <main className="content">
        <div className="container text-center">
          <h2 className="title">Gestionar Usuarios</h2>

          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
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
              {filtrarUsuariosBuscador.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    {usuario.nombre}
                    <Modal show={editUsuario === usuario} onHide={() => setEditUsuario(null)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Editar Usuario</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="mb-3">
                          <label className="form-label">Nombre</label>
                          <input
                            type="text"
                            className={`form-control ${nombreError ? 'is-invalid' : ''}`}
                            value={valoresEditados.nombre}
                            onChange={(e) => {
                              setValoresEditados({ ...valoresEditados, nombre: e.target.value });
                              setNombreError(false);
                            }}
                          />
                          {nombreError && <div className="invalid-feedback">{nombreError}</div>}
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Apellidos</label>
                          <input
                            type="text"
                            className={`form-control ${apellidosError ? 'is-invalid' : ''}`}
                            value={valoresEditados.apellidos}
                            onChange={(e) => {
                              setValoresEditados({ ...valoresEditados, apellidos: e.target.value });
                              setApellidosError(false);
                            }}
                          />
                          {apellidosError && <div className="invalid-feedback">{apellidosError}</div>}
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Correo</label>
                          <input
                            type="email"
                            className={`form-control ${correoError ? 'is-invalid' : ''}`}
                            value={valoresEditados.correo}
                            onChange={(e) => {
                              setValoresEditados({ ...valoresEditados, correo: e.target.value });
                              setCorreoError(false);
                            }}
                          />
                          {correoError && <div className="invalid-feedback">{correoError}</div>}
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Rol</label>
                          <select
                            value={valoresEditados.rol}
                            className={`form-select ${rolError ? 'is-invalid' : ''}`}
                            onChange={(e) => {
                              setValoresEditados({ ...valoresEditados, rol: e.target.value });
                              setRolError(false);
                            }}
                          >
                            {usuario.rol === 1 ? (
                              <>
                                <option value="1">Usuario</option>
                                <option value="0">Administrador</option>
                              </>
                            ) : (
                              <>
                                <option value="0">Administrador</option>
                                <option value="1">Usuario</option>
                              </>
                            )}
                          </select>
                          {rolError && <div className="invalid-feedback">{rolError}</div>}
                        </div>
                        <div className="mb-3"> 
                          <label className="form-label">Sistema</label>
                          <input
                            type="text"
                            className={`form-control ${id_SistemaError ? 'is-invalid' : ''}`}
                            value={valoresEditados.id_sistema}
                            onChange={(e) => {
                              setValoresEditados({ ...valoresEditados, id_sistema: e.target.value });
                              setId_SistemaError(false);
                            }}
                          />
                          {id_SistemaError && <div className="invalid-feedback">{id_SistemaError}</div>}
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Contraseña</label>
                          <input
                            type="password"
                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                            value={valoresEditados.password}
                            onChange={(e) => {
                              setValoresEditados({ ...valoresEditados, password: e.target.value });
                              setPasswordError(false);
                            }}
                          />
                          {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <button onClick={handleSaveChanges} className="btn btn-primary w-100">Guardar</button>
                        <button onClick={() => limpiar()} className="btn btn-primary w-100">Cancelar</button>
                      </Modal.Footer>
                    </Modal>
                  </td>
                  <td>{usuario.apellidos}</td>
                  <td>{usuario.correo}</td>
                  <td>{tipoDeUsuario(usuario.rol)}</td>
                  <td>{usuario.id_sistema}</td>
                  <td>********</td>
                  <td>
                    {editUsuario === usuario ? (
                      <button onClick={handleSaveChanges} className="btn btn-primary w-100">Guardar</button>
                    ) : (
                      <button onClick={() => handleEditUsuario(usuario)} className="btn btn-primary w-100">Editar</button>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteUsuario(usuario.correo)} className="btn btn-primary w-100">Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row justify-content-center">
            <div className="mb-3 col-md-2">
              <Link to="/Administrador" className="btn btn-secondary w-100 mt-2">
                Volver
              </Link>
            </div>
          </div>
        </div> 
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default GestionarUsuarios;