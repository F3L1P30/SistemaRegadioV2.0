import React, { useState, useEffect } from 'react';
import NavBare from './Menu';
import Footer from './Footer';
import Mapa from './Mapa';
import axios from 'axios';

function Geo() {
  const [listaMedidores, setListaMedidores] = useState([]);
  const [tipoMedidorSeleccionado, setTipoMedidorSeleccionado] = useState('');
  const [medidorSeleccionado, setMedidorSeleccionado] = useState('');
  const usuario = JSON.parse(localStorage.getItem('authUser'));
  const idSistemaUsuario = usuario.id_sistema;

  const tiposMedidores = [...new Set(listaMedidores.map(medidor => medidor.tipo_medidor))];

  useEffect(() => {
    // Realiza una solicitud HTTP GET al backend para obtener los datos de los medidores
    axios
      .get('http://127.0.0.1:8000/medidores')
      .then((response) => {
        // Dividir la respuesta en líneas y filtrar líneas vacías
        const lines = response.data.split('\n').filter((line) => line.trim() !== '');

        // Crear un arreglo de objetos JSON a partir de las líneas
        const medidoresArray = lines.map((line) => {
          const dataStartIndex = line.indexOf('{');
          if (dataStartIndex !== -1) {
            const jsonData = line.slice(dataStartIndex);
            return JSON.parse(jsonData);
          }
          return null;
        }).filter((item) => item !== null);

        // Filtrar los medidores por id_sistema del usuario
        const medidoresFiltrados = medidoresArray.filter((medidor) => medidor.id_sistema === idSistemaUsuario);

        // Actualizar el estado 'listaMedidores' con los datos convertidos y filtrados
        setListaMedidores(medidoresFiltrados);
      })
      .catch((error) => console.error('Error al obtener la lista de medidores:', error));
  }, [idSistemaUsuario]);

  const handleTipoMedidorChange = (event) => {
    setTipoMedidorSeleccionado(event.target.value);
    setMedidorSeleccionado(''); // Reiniciar la selección de medidor cuando cambia el tipo
  };

  const handleMedidorChange = (event) => {
    setMedidorSeleccionado(event.target.value);
  };

  return (
    <div className="wrapper">
      <header>
        <NavBare className="navbar-footer" />
      </header>
      <main className="content">
        <div className="container text-center">
          <h1 className="title">Geolocalización</h1>
          <div>
            <label htmlFor="tipoMedidor">Seleccione un tipo de medidor:</label>
            <select id="tipoMedidor" value={tipoMedidorSeleccionado} onChange={handleTipoMedidorChange}>
              <option value="">Todos los tipos</option>
              {tiposMedidores.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="medidor">Seleccione un medidor:</label>
            <select id="medidor" value={medidorSeleccionado} onChange={handleMedidorChange}>
              <option value="">Todos los medidores</option>
              {listaMedidores
                .filter((medidor) => !tipoMedidorSeleccionado || medidor.tipo_medidor === tipoMedidorSeleccionado)
                .map((medidor) => (
                  <option key={medidor.id_medidor} value={medidor.id_medidor}>
                    {medidor.id_medidor}
                  </option>
                ))}
            </select>
          </div>
          <Mapa
            listaMedidores={listaMedidores.filter(
              (medidor) =>
                (!tipoMedidorSeleccionado || medidor.tipo_medidor === tipoMedidorSeleccionado) &&
                (!medidorSeleccionado || medidor.id_medidor === medidorSeleccionado)
            )}
          />
        </div>
      </main>
    </div>
  );
}

export default Geo;
