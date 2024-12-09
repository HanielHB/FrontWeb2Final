import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FormIncidente = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('');
    const [latitud, setLatitud] = useState(-16.2902); 
    const [longitud, setLongitud] = useState(-63.5887);
    const [carreteraId, setCarreteraId] = useState('');
    const [carreteras, setCarreteras] = useState([]);
    const [validated, setValidated] = useState(false);

    
    const boliviaBounds = [
        [-22.8992, -69.6663], 
        [-9.6806, -57.4993],  
    ];

    useEffect(() => {
        getListaCarreteras();
        if (id) {
            getIncidenteById();
        }
    }, [id]);

    const getListaCarreteras = () => {
        axios.get('http://localhost:3000/carreteras', {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            setCarreteras(res.data);
        })
        .catch(error => {
            console.error("Error al obtener las carreteras:", error);
        });
    };

    const getIncidenteById = () => {
        axios.get(`http://localhost:3000/incidentes/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            const incidente = res.data;
            setDescripcion(incidente.descripcion);
            setTipo(incidente.tipo);
            setLatitud(incidente.latitud);
            setLongitud(incidente.longitud);
            setCarreteraId(incidente.carreteraId);
        })
        .catch(error => {
            console.error("Error al obtener el incidente:", error);
        });
    };

    const onGuardarClick = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const incidente = { descripcion, tipo, latitud, longitud, carreteraId };

        if (id) {
            editarIncidente(incidente);
        } else {
            crearIncidente(incidente);
        }
    };

    const editarIncidente = (incidente) => {
        axios.put(`http://localhost:3000/incidentes/${id}`, incidente, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Incidente editado:", res.data);
            navigate('/dashboard/incidentes');
        })
        .catch(error => {
            console.error("Error al editar el incidente:", error);
        });
    };

    const crearIncidente = (incidente) => {
        axios.post('http://localhost:3000/incidentes', incidente, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Incidente creado:", res.data);
            navigate('/dashboard/incidentes');
        })
        .catch(error => {
            console.error("Error al crear el incidente:", error);
        });
    };

    
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setLatitud(e.latlng.lat);
                setLongitud(e.latlng.lng);
            },
        });

        return latitud && longitud ? (
            <Marker position={[latitud, longitud]}></Marker>
        ) : null;
    };

    return (
        <Container>
            <Row className="mt-5 justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>{id ? "Editar Incidente" : "Crear Incidente"}</h2>
                            </Card.Title>
                            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                <Form.Group>
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Tipo:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        required
                                        value={tipo}
                                        onChange={(e) => setTipo(e.target.value)}
                                    >
                                        <option value="">Seleccione un tipo</option>
                                        <option value="No transitable tráfico cerrado">No transitable tráfico cerrado</option>
                                        <option value="Transitable con precaución">Transitable con precaución</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Carretera:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        required
                                        value={carreteraId}
                                        onChange={(e) => setCarreteraId(e.target.value)}
                                    >
                                        <option value="">Seleccione una carretera</option>
                                        {carreteras.map(carretera => (
                                            <option key={carretera.id} value={carretera.id}>
                                                {carretera.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Mapa:</Form.Label>
                                    <div style={{ height: "400px" }}>
                                        <MapContainer
                                            bounds={boliviaBounds} 
                                            zoom={6}
                                            style={{ height: "100%", width: "100%" }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <LocationMarker />
                                        </MapContainer>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Latitud:</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        value={latitud}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Longitud:</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        value={longitud}
                                        readOnly
                                    />
                                </Form.Group>
                                <Button className="mt-3" type="submit">
                                    Guardar
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormIncidente;
