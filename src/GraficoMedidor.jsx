import React, { useState, useEffect, useMemo  } from "react";
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom'; // Importa el complemento de zoom
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, zoomPlugin);

export function GraficoMedidor({ medidorSeleccionado }) {
  const [dataArr, setDataArr] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [anteriorFirstData, setAnteriorFirstData] = useState(0);

  const fetchData = async (startDate, endDate) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/medidor', {
        params: {
          startDate: startDate,
          endDate: endDate // Utiliza la fecha final ajustada
        }
      });
      const responseData = response.data;

      const newData = responseData.split('\n').map(jsonString => {
        const startIndex = jsonString.indexOf('{');
        if (startIndex !== -1) {
          const parsedData = JSON.parse(jsonString.slice(startIndex));
          // Convertir la marca de tiempo a la zona horaria local
          parsedData.fecha = new Date(parsedData.fecha);
          return parsedData;
        }
        return null;
      }).filter(item => item !== null);
      
      setDataArr(newData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      // Convierte las fechas a objetos Date
      const startDateTime = startDate.getTime();
      const endDateTime = endDate.getTime();
  
      // Busca el último dato antes de startDate para el medidor seleccionado
      let lastIndexBeforeStartDate = -1;
      for (let i = 0; i < dataArr.length; i++) {
        const itemDate = new Date(dataArr[i].fecha).getTime();
        if (itemDate < startDateTime && itemDate >= endDateTime && dataArr[i].id_medidor === medidorSeleccionado) {
          lastIndexBeforeStartDate = i;
        }
      }
  
      // Si se encontró un dato antes de startDate para el medidor seleccionado, cópialo en anteriorFirstData
      if (lastIndexBeforeStartDate !== -1) {
        const consumoAnteriorFirstData = JSON.parse(dataArr[lastIndexBeforeStartDate].otro_dato);
        setAnteriorFirstData(consumoAnteriorFirstData.consumo);
      } else {
        setAnteriorFirstData(0); // Si no se encontró ningún dato antes de startDate, establece 0
      }
  
      fetchData(startDate, endDate);
  
      const interval = setInterval(() => {
        fetchData(startDate, endDate);
      }, 5000);
  
      return () => {
        clearInterval(interval);
      };
    } 
  }, [startDate, endDate, dataArr, medidorSeleccionado]);

  const handleDateChange = (event, type) => {
    const selectedDate = new Date(event.target.value);
    if (type === 'start') {
      setStartDate(selectedDate);
    } else if (type === 'end') {
      setEndDate(selectedDate);
    }
  };

  const filteredData = dataArr.filter(item => {
    const itemDate = new Date(item.fecha);
    return startDate && endDate && itemDate >= startDate && itemDate < endDate && item.id_medidor === medidorSeleccionado;
  });

  const otroDatoArray = filteredData.map(item => {
    const otroDatoJSON = JSON.parse(item.otro_dato);
  
    // Recopilar todos los campos de otro_dato en un objeto
    const fields = [];
    for (const key in otroDatoJSON) {
      if (otroDatoJSON.hasOwnProperty(key)) {
        fields.push({
          field: key,
          value: otroDatoJSON[key]
        });
      }
    }
  
    return fields;
  });

  const datasets = otroDatoArray.reduce((result, fields) => {
    fields.forEach((fieldObj) => {
      const dataset = result.find((ds) => ds.label === fieldObj.field);
      if (dataset) {
        dataset.data.push(fieldObj.value);
      } else {
        result.push({
          label: fieldObj.field,
          data: [fieldObj.value],
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
          tension: 0.2,
        });
      }
    });
    return result;
  }, []);

  const chartData = {
    labels: filteredData.map(item => item.fecha),
    datasets: datasets
  };

  const chartOptions = useMemo(() => {
    return {
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            speed: 10,
            threshold: 10,
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            callback: (value, index, values) => {
              if (index === 0) {
                const startDateUTC = new Date(startDate);
                startDateUTC.setMinutes(startDateUTC.getMinutes() + startDateUTC.getTimezoneOffset());
                return startDateUTC.toLocaleDateString();
              } else if (index === values.length - 1) {
                const endDateUTC = new Date(endDate);
                endDateUTC.setMinutes(endDateUTC.getMinutes() + endDateUTC.getTimezoneOffset());
                return endDateUTC.toLocaleDateString();
              } else {
                return ; // Muestra las fechas de los datos en el medio
              }
            }
          }
        }
      }
    };
  }, [startDate, endDate]);

  const latestData = filteredData.length > 0 ? JSON.parse(filteredData[filteredData.length - 1].otro_dato) : null;

  const energiaConsumidaIntervalo = latestData
  ? latestData.consumo - anteriorFirstData
  : null;
  
  return (
    <div>
      <p>Gráfico Medidor</p>
      <div>
        <label htmlFor="start-date">Fecha y hora inicial: </label>
        <input type="datetime-local" id="start-date" onChange={e => handleDateChange(e, 'start')} />
      </div>
      <div>
        <label htmlFor="end-date">Fecha y hora final: </label>
        <input type="datetime-local" id="end-date" onChange={e => handleDateChange(e, 'end')} />
      </div>
      <Line data={chartData} options={chartOptions} />
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Energía Consumida en el tiempo seleccionado</th>
          </tr>
        </thead>
        <tbody>
          {latestData && (
            <tr>
              <td>{energiaConsumidaIntervalo.toFixed(2)} [Kwh]</td>
            </tr>
          )}
          
        </tbody>
      </table>
    </div>
  );
}