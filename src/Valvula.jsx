import React, { useState, useEffect } from 'react';
import NavBare from './Menu';
import './css/medidor.css';

function Valvula() {
  // Aquí podrías agregar el estado para manejar la lógica de abrir y cerrar las válvulas si es necesario

  return (
    <div className="wrapper">
      <header>
        <NavBare className="navbar-footer" />
      </header>
      <main className="content">
        <div className="container text-center">
          <h2 className="title">Gestionar Válvulas</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Valvula</th>
                <th>Abrir</th>
                <th>Cerrar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Valvula 1</td>
                <td><button className="btn-abrir">Abrir</button></td>
                <td><button className="btn-cerrar">Cerrar</button></td>
              </tr>
              <tr>
                <td>Valvula 2</td>
                <td><button className="btn-abrir">Abrir</button></td>
                <td><button className="btn-cerrar">Cerrar</button></td>
              </tr>
              <tr>
                <td>Valvula 3</td>
                <td><button className="btn-abrir">Abrir</button></td>
                <td><button className="btn-cerrar">Cerrar</button></td>
              </tr>
              <tr>
                <td>Valvula 4</td>
                <td><button className="btn-abrir">Abrir</button></td>
                <td><button className="btn-cerrar">Cerrar</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <footer>
        {/* Aquí puedes incluir tu componente Footer si es necesario */}
      </footer>
    </div>
  );
}

export default Valvula;
