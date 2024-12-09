import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const FormMunicipio = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [nombre, setNombre] = useState('');
    const [latitud, setLatitud] = useState(-16.5); 
    const [longitud, setLongitud] = useState(-68.15); 
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (id) {
            getMunicipioById();
        }
    }, [id]);

    const getMunicipioById = () => {
        axios.get(`http://localhost:3000/municipios/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            const municipio = res.data;
            setNombre(municipio.nombre);
            setLatitud(municipio.latitud);
            setLongitud(municipio.longitud);
        })
        .catch(error => {
            console.error("Error al obtener el municipio:", error);
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

        const municipio = { nombre, latitud, longitud };

        if (id) {
            editarMunicipio(municipio);
        } else {
            crearMunicipio(municipio);
        }
    };

    const editarMunicipio = (municipio) => {
        axios.put(`http://localhost:3000/municipios/${id}`, municipio, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Municipio editado:", res.data);
            navigate('/dashboard/municipios');
        })
        .catch(error => {
            console.error("Error al editar el municipio:", error);
        });
    };

    const crearMunicipio = (municipio) => {
        axios.post('http://localhost:3000/municipios', municipio, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Municipio creado:", res.data);
            navigate('/dashboard/municipios');
        })
        .catch(error => {
            console.error("Error al crear el municipio:", error);
        });
    };

    
    const ManejadorDeMarcador = () => {
        useMapEvents({
            click(e) {
                setLatitud(e.latlng.lat);
                setLongitud(e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <Container>
            <Row className="mt-5 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>{id ? "Editar Municipio" : "Crear Municipio"}</h2>
                            </Card.Title>
                            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                <Form.Group>
                                    <Form.Label>Nombre del Municipio:</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Latitud:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={latitud}
                                        onChange={(e) => setLatitud(parseFloat(e.target.value))}
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Longitud:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={longitud}
                                        onChange={(e) => setLongitud(parseFloat(e.target.value))}
                                        disabled
                                    />
                                </Form.Group>
                                <div className="mt-3">
                                    <MapContainer
                                        center={[latitud, longitud]}
                                        zoom={6}
                                        style={{ height: "300px", width: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[latitud, longitud]}></Marker>
                                        <ManejadorDeMarcador />
                                    </MapContainer>
                                </div>
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

export default FormMunicipio;
