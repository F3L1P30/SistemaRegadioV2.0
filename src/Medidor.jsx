import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBare from './Menu';
import Footer from './Footer';
import './css/medidor.css';
import { TablaMedidor } from './TablaMedidor';
import { GraficoMedidor } from './GraficoMedidor';

function Medidor() {
  const [medidorSeleccionado, setMedidorSeleccionado] = useState('');
  const [listaMedidores, setListaMedidores] = useState([]);
  const usuario = JSON.parse(localStorage.getItem('authUser'));
  const idSistemaUsuario = usuario.id_sistema;
  
  const handleMedidorChange = (event) => {
    const selectedMedidor = event.target.value;
    setMedidorSeleccionado(selectedMedidor);
  };

  useEffect(() => {
    // Realiza una solicitud HTTP GET al backend para obtener los datos de los medidores
    axios.get('http://127.0.0.1:8000/medidores')
      .then(response => {
        // Dividir la respuesta en líneas y filtrar líneas vacías
        const lines = response.data.split('\n').filter(line => line.trim() !== '');
  
        // Crear un arreglo de objetos JSON a partir de las líneas
        const medidoresArray = lines.map(line => {
          const dataStartIndex = line.indexOf('{');
          if (dataStartIndex !== -1) {
            const jsonData = line.slice(dataStartIndex);
            return JSON.parse(jsonData);
          }
          return null;
        }).filter(item => item !== null);

        // Filtrar los medidores por id_sistema del usuario
        const medidoresFiltrados = medidoresArray.filter(medidor => medidor.id_sistema === idSistemaUsuario);
  
        // Actualizar el estado 'listaMedidores' con los datos convertidos y filtrados
        setListaMedidores(medidoresFiltrados);
      })
      .catch(error => console.error('Error al obtener la lista de medidores:', error));
  }, [idSistemaUsuario]);

  return (
    <div className="wrapper">
      <header>
        <NavBare className="navbar-footer" />
      </header>
      <main className="content">
        <div className="container text-center">
          <div className="row justify-content-center">
            <h1 className="title">Medidores</h1>
            
            {/* Selector de Medidores */}
            <select onChange={handleMedidorChange} value={medidorSeleccionado} className="custom-select">
              <option value="">Selecciona un medidor</option>
              {listaMedidores.map((medidor) => (
                <option key={medidor.id_medidor} value={medidor.id_medidor}>
                  Medidor {medidor.id_medidor} del {medidor.id_sistema}
                </option>
              ))}
            </select>
            
            {/* Componente TablaMedidor */}
            <TablaMedidor medidorSeleccionado={medidorSeleccionado} />
            
            {/* Componente GraficoMedidor */}
            <GraficoMedidor medidorSeleccionado={medidorSeleccionado} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Medidor;