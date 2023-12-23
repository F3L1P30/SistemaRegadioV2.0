import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import "./css/inicio.css";
import tryall from "./logo/TRYALLREGADIO.png";

function Inicio() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioAlmacenado = JSON.parse(localStorage.getItem("authUser"));
    if (usuarioAlmacenado) {
      setUsuario(usuarioAlmacenado);
    }
  }, []);

  return (
    <div>
      <div className="menu">
        <Menu />
      </div>
      <main className="content main-content">
        <div className="container text-center">
          <div className="row justify-content-center">
            <h1 className="titleI">
              Bienvenido/a {usuario && usuario.nombre} a
            </h1>
          </div>
          <div className="row col-centered">
            <div className="col-sm-6"> {/* Usa "col-sm-6" en lugar de "col-md-6" */}
              <img src={tryall} alt="Imagen 1" className="img-fluid" />
            </div>
            <div className="col-sm-6"> {/* Usa "col-sm-6" en lugar de "col-md-6" */}
              <iframe
                width="100%" /* Cambiado a 100% para ocupar el ancho completo de la columna */
                height="320" /* Ajusta la altura según sea necesario */
                src="https://www.youtube.com/embed/cwhfKSCMFRc"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inicio;
