import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import './css/inicio.css';

function Inicio() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Obtener el usuario almacenado en localStorage
    const usuarioAlmacenado = JSON.parse(localStorage.getItem('authUser'));
    if (usuarioAlmacenado) {
      setUsuario(usuarioAlmacenado);
    }
  }, []);

  return (
    <div>
      <Menu />
      <main className="content main-content"> {/* Agrega la clase 'main-content' aquí */}
        <div className="container text-center">
          <div className="row justify-content-center">
            {/* Aplica la clase CSS 'title' al mensaje de bienvenida */}
            <h1 className="titleI">Bienvenido/a {usuario && usuario.nombre}</h1>
            {usuario && (
              <p className="message">AÑADIR IMAGENES O VIDEOS O TEMPERATURA ACTUAL O CALENDARIO</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inicio;
