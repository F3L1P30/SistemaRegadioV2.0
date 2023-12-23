import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import "./css/medidor.css";

export function TablaMedidor({ medidorSeleccionado }) {
  const [ultimoDato, setUltimoDato] = useState(null); // Usamos un objeto para el utlimo dato de otro_dato
  const [consumo, setConsumo] = useState(null); // Usamos un objeto para el penúltimo dato
  const [fecha, setFecha] = useState(null);

  // Función para formatear la fecha
  const formatFecha = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL_HTTPS}medidor`, {});
        const responseData = response.data;

        const newData = responseData.split('\n').map(jsonString => {
          const startIndex = jsonString.indexOf('{');
          if (startIndex !== -1) {
            return JSON.parse(jsonString.slice(startIndex));
          }
          return null;
        }).filter(item => item !== null);

        if (newData.length > 0) {
          const filteredData = newData.filter(item => item.id_medidor === medidorSeleccionado);

          if (filteredData.length > 0) {
            setUltimoDato(JSON.parse(filteredData[filteredData.length - 1].otro_dato));
            setFecha(formatFecha(filteredData[filteredData.length - 1].fecha));
            if (filteredData.length > 1) {
              const ultimoDato = JSON.parse(filteredData[filteredData.length - 1].otro_dato);
              const penultimoDato = JSON.parse(filteredData[filteredData.length - 2].otro_dato);
              const consumoActual = ultimoDato.consumo - penultimoDato.consumo;
              setConsumo(consumoActual);
            } else {
              setConsumo(null);
            }
          } else {
            setUltimoDato(null);
            setConsumo(null);
          }
        } else {
          setUltimoDato(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [medidorSeleccionado]);

  return (
    <div>
      <div className="table-responsive table-container">
        <Table striped bordered>
          <thead>
            <tr>
              <th>Dato actual: {fecha}</th>
              <th>Valor</th>
            </tr>
          </thead>
          {ultimoDato && (
            <tbody>
              {Object.entries(ultimoDato).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{key === 'consumo' ? consumo : value}</td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>
    </div>
  );
}