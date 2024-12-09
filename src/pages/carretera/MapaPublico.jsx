import axios from "axios";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapaPublico = () => {
    const [carreteras, setCarreteras] = useState([]);
    const boliviaCenter = [-16.2902, -63.5887]; 

    useEffect(() => {
        getCarreteras();
    }, []);

    const getCarreteras = async () => {
        try {
            const response = await axios.get("http://localhost:3000/public/carreteras");
            const carreteras = response.data.map((carretera) => ({
                ...carretera,
                recorrido: carretera.recorrido ? JSON.parse(carretera.recorrido) : [],
            }));
            setCarreteras(carreteras);
        } catch (error) {
            console.error("Error al obtener las carreteras:", error);
        }
    };

    return (
        <div style={{ height: "100vh" }}>
            <MapContainer
                center={boliviaCenter}
                zoom={6}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {carreteras.map((carretera) => (
                    <Polyline
                        key={carretera.id}
                        positions={carretera.recorrido}
                        color={carretera.estado === "libre" ? "green" : "red"}
                    >
                        <Tooltip>{carretera.nombre}</Tooltip>
                    </Polyline>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapaPublico;
