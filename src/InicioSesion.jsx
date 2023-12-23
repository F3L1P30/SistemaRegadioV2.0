import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import logo from './logo/Recurso-1.png'; 
import { Link } from 'react-router-dom';
import './css/inicioSesion.css'; // Importa tu archivo CSS personalizado

const InicioSesion = () => {
  const { login, rol } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [correoError, setCorreoError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async () => {
    try{
      // Validación de campos
      if (correo.trim() === '') {
        setCorreoError('Debe completar este campo');
        return;
      }
      if (password.trim() === '') {
        setPasswordError('Debe completar este campo');
        return;
      }

      // Enviar solicitud POST al endpoint de inicio de sesión
      const response = await axios.post(`${process.env.REACT_APP_URL_HTTPS}iniciarSesion`, {
        correo,
        password,
      });
      
      console.log(response);

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        login(data.usuario);
        rol(data.usuario);
      } else {
        setCorreoError('Email o contraseña incorrectos');
        setPasswordError('Email o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !correoError && !passwordError) {
      event.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="card-container">
        <div className="card">
          <div className="card-body">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
          
            <form>
              <div className="mb-2">
                <input
                  type="email"
                  className={`form-control ${correoError ? 'is-invalid' : ''}`}
                  id="email"
                  placeholder='Correo electrónico'
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    setCorreoError(false);
                  }}
                  onKeyPress={handleKeyPress}
                />
                {correoError && <div className="invalid-feedback">{correoError}</div>}
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                  id="password"
                  placeholder='Contraseña'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  onKeyPress={handleKeyPress}
                />
                {passwordError && <div className="invalid-feedback">{passwordError}</div>}
              </div>
              <div className="text-right">
                <Link to="">¿Olvidó la contraseña?</Link>
              </div>
              <br />
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleLogin}
              >
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;
