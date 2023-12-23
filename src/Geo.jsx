import React, { useState, useEffect } from 'react';
import NavBare from './Menu';
import Mapa from './Mapa';
import axios from 'axios';

function Geo() {
  const [listaMedidores, setListaMedidores] = useState([]);
  const [tipoMedidorSeleccionado, setTipoMedidorSeleccionado] = useState('');
  const [medidorSeleccionado, setMedidorSeleccionado] = useState('');
  const usuario = JSON.parse(localStorage.getItem('authUser'));
  const idSistemaUsuario = usuario.id_sistema;
  const [userLocation, setUserLocation] = useState(null);

  const tiposMedidores = [...new Set(listaMedidores.map(medidor => medidor.tipo_medidor))];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL_HTTPS}medidores`)
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

    // Configurar el observador de geolocalización
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        // Actualizar la ubicación del usuario en el estado
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error);
      }
    );

    // Limpiar el observador cuando el componente se desmonta
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
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
          <div className="row justify-content-center">
            <div className="col-md-3">
              <div className="form-group mb-2">
                <label htmlFor="tipoMedidor">Seleccione un tipo de medidor:</label>
                <select className="form-control" id="tipoMedidor" value={tipoMedidorSeleccionado} onChange={handleTipoMedidorChange}>
                  <option value="">Todos los tipos</option>
                  {tiposMedidores.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="medidor">Seleccione un medidor:</label>
                <select className="form-control" id="medidor" value={medidorSeleccionado} onChange={handleMedidorChange}>
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
            </div>
          </div>
          
          <Mapa
            listaMedidores={listaMedidores.filter(
              (medidor) =>
                (!tipoMedidorSeleccionado || medidor.tipo_medidor === tipoMedidorSeleccionado) &&
                (!medidorSeleccionado || medidor.id_medidor === medidorSeleccionado)
            )}
            userLocation={userLocation}
          />
        </div>
      </main>
    </div>
  );
}

export default Geo;
