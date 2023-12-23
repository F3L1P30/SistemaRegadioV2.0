import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import NavBare from './Menu';
import Footer from './Footer';

const RegistrarUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState(1);
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [correoError, setCorreoError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nombreError, setNombreError] = useState(false);
  const [apellidosError, setApellidosError] = useState(false);
  const [rolError, setRolError] = useState(false);

  const mensajeRef = useRef(null);
  const id_sistema = '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      setNombreError('Debe completar este campo');
      return;
    } else if (nombre.length > 50) {
      setNombreError('Debe ingresar un nombre menor a 50 caracteres');
      return;
    }

    if (apellidos.trim() === '') {
      setApellidosError('Debe completar este campo');
      return;
    } else if (apellidos.length > 50) {
      setApellidosError('Debe ingresar un apellido menor a 50 caracteres');
      return;
    }

    if (isNaN(rol)) {
      setRolError('Debe seleccionar un valor válido para el rol');
      return;
    }

    if (correo.trim() === '') {
      setCorreoError('Debe completar este campo');
      return;
    } else if (!/^\S+@\S+\.\S+$/.test(correo.trim())) {
      setCorreoError('Debe ingresar un correo electrónico real');
      return;
    }

    if (password.trim() === '') {
      setPasswordError('Debe completar este campo');
      return;
    } else if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    } else if (password.length > 20) { // Ejemplo de límite superior (ajustable)
      setPasswordError('La contraseña no puede tener más de 20 caracteres');
      return;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('La contraseña debe contener al menos una letra mayúscula');
      return;
    } else if (!/[a-z]/.test(password)) {
      setPasswordError('La contraseña debe contener al menos una letra minúscula');
      return;
    } else if (!/\d/.test(password)) {
      setPasswordError('La contraseña debe contener al menos un número');
      return;
    } else if (!/[@$!%*?&]/.test(password)) {
      setPasswordError('La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, &)');
      return;
    } 

    try {
      // Realiza una solicitud POST a la API utilizando Axios
      const response = await axios.post(`${process.env.REACT_APP_URL_HTTPS}registrarUsuario`, {
        nombre,
        apellidos,
        correo,
        rol,
        password,
        id_sistema
      });

      if (response.status === 200) {
        const data = response.data;
        setMensaje(data.mensaje);
        mostrarMensaje('Usuario creado correctamente', 'green');
      } else {
        setMensaje('Error al crear el usuario');
        mostrarMensaje('Error al crear el usuario', 'red');
      }
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setMensaje('Error al crear el usuario');
      mostrarMensaje('Error al crear el usuario', 'red');
    }
  };

  const mostrarMensaje = (mensaje, color) => {
    if (mensajeRef.current) {
      mensajeRef.current.textContent = mensaje;
      mensajeRef.current.style.color = color;
    }
  };

  return (
    <div className="wrapper">
      <header>
        <NavBare className="navbar-footer" />
      </header>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Registrar Usuario</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      value={nombre}
                      className={`form-control ${nombreError ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        setNombre(e.target.value);
                        setNombreError(false);
                      }}
                    />
                    {nombreError && <div className="invalid-feedback">{nombreError}</div>}
                  </div>
                  <div className="mb-3">
                    <label>Apellidos</label>
                    <input
                      type="text"
                      value={apellidos}
                      className={`form-control ${apellidosError ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        setApellidos(e.target.value);
                        setApellidosError(false);
                      }}
                    />
                    {apellidosError && <div className="invalid-feedback">{apellidosError}</div>}
                  </div>
                  <div className="mb-3">
                    <label>Rol</label>
                    <select
                      value={rol}
                      className={`form-select ${rolError ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        setRol(e.target.value); // Esto establecerá 'Administrador' o 'Usuario'
                        setRolError(false);
                      }}
                    >
                      <option value="0">Administrador</option>
                      <option value="1">Usuario</option>
                    </select>
                    {rolError && <div className="invalid-feedback">{rolError}</div>}
                  </div>
                  <div className="mb-3">
                    <label>Correo</label>
                    <input
                      type="email"
                      value={correo}
                      className={`form-control ${correoError ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        setCorreo(e.target.value);
                        setCorreoError(false);
                      }}
                    />
                    {correoError && <div className="invalid-feedback">{correoError}</div>}
                  </div>
                  <div className="mb-3">
                    <label>Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                      }}
                    />
                    {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                  </div>
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary w-100">
                      Registrar
                    </button>
                    <Link to="/Administrador" className="btn btn-secondary w-100 mt-2">
                      Volver
                    </Link>
                  </div>
                </form>
                {mensaje && <p ref={mensajeRef}></p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default RegistrarUsuario;