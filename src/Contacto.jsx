import React from 'react';
import './css/index.css'; // Archivo CSS para estilos personalizados
import Menu from './Menu';
function Contacto() {
  return (
    <div className="wrapper">
      <header>
        <Menu />
      </header>
      <main className="content">
        <div className="container text-center">
          <div className="row justify-content-center">
            <h1 className="title">Contacto</h1>
            <br />
            <table className="contact-table">
              <tbody>
                <tr>
                  <th>Contacto</th>
                  <th>Información</th>
                </tr>
                <tr>
                  <td>Email:</td>
                  <td>esilva@tryall.cl</td>
                </tr>
                <tr>
                  <td>Numero:</td>
                  <td>+569 967 56 009</td>
                </tr>
                <tr>
                  <td>Ubicacion:</td>
                  <td>Santiago, Chile</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contacto;
