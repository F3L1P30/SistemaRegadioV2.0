import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../src/css/Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXNmZGFzZGYxMiIsImEiOiJjbGs2Yzg2eHkxY2h2M2htdjA0YjIyM2t1In0.qyPzSqQk4xQKtR6Oc17P_A";

export default function App({ listaMedidores }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [geolocationAllowed, setGeolocationAllowed] = useState(false);
  const [medidor, setMedidor] = useState([]);

  useEffect(() => {
    // Convierte la lista de medidores en una matriz de coordenadas [lng, lat]
    console.log(listaMedidores);
    if (Array.isArray(listaMedidores) && listaMedidores.length > 0) {
      const coordenadasMedidor = listaMedidores.map((medidor) => {
        return [medidor.latitud, medidor.longitud];
      });
      setMedidor(coordenadasMedidor);
    }
  }, [listaMedidores]);

  useEffect(() => {
    // Configuración inicial del mapa y geolocalización
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      });

      map.current.on("move", () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });

      // Obtener la ubicación actual del usuario usando la API de geolocalización del navegador
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newUserLocation = [position.coords.longitude, position.coords.latitude];
          setGeolocationAllowed(true);
          setLng(newUserLocation[0]);
          setLat(newUserLocation[1]);
          map.current.setCenter(newUserLocation);

          new mapboxgl.Marker({ element: createUserMarkerElement(), offset: [0, -10] })
            .setLngLat(newUserLocation)
            .addTo(map.current)
            .setPopup(new mapboxgl.Popup().setHTML("<h3>Tu ubicación actual</h3>"));
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          setGeolocationAllowed(false);
        }
      );
      
    }
  }, [lat, lng, zoom]);

  useEffect(() => {
    // Se eliminan los marcadores anteriores para que no se sobreescriban, excepto la ubicacion del usuario
    document.querySelectorAll(".mapboxgl-marker").forEach((marker) => {
      if (!marker.classList.contains("user-marker")) {
        marker.remove();
      }
    });

    // Personalizacion de los marcadores
    if (medidor.length > 0) {
      medidor.forEach((medidorLocation, index) => {
        
        const marker = new mapboxgl.Marker({ color: "blue" })
          .setLngLat(medidorLocation)
          .addTo(map.current);
    
        // Crear un Popup personalizado para este marcador y los datos que se mostraran en el
        const [lat, lng] = medidorLocation;
        const id_medidor = listaMedidores.find((item) => item.latitud === lat && item.longitud === lng)?.id_medidor;
        const tipo_medidor = listaMedidores.find((item) => item.latitud === lat && item.longitud === lng)?.tipo_medidor;
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<p>Medidor ${id_medidor || 'No disponible'}, Tipo: ${tipo_medidor || 'No disponible'}</p`);
    
        marker.setPopup(popup);
        
        // Agregar un evento click al marcador para mostrar el Popup
        marker.getElement().addEventListener("click", () => {
          popup.addTo(map.current);
        });
      });
    }
  }, [medidor, listaMedidores]);

  useEffect(() => {
    // Actualizar la ubicación en tiempo real usando watchPosition
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newUserLocation = [position.coords.longitude, position.coords.latitude];
        setLng(newUserLocation[0]);
        setLat(newUserLocation[1]);
        map.current.setCenter(newUserLocation);
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error);
        setGeolocationAllowed(false);
      }
    );

    // Detener la observación de la ubicación cuando el componente se desmonte
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const createUserMarkerElement = () => {
    const userMarkerElement = document.createElement("div");
    userMarkerElement.className = "mapboxgl-marker user-marker mapboxgl-marker-anchor-center";
    userMarkerElement.innerHTML = `
      <div class="mapboxgl-user-location-dot"></div>
      <div class="mapboxgl-user-location-heading"></div>
    `;
    return userMarkerElement;
  };

  return (
    <div className="container text-center">
      <div className="row justify-content-center">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}
