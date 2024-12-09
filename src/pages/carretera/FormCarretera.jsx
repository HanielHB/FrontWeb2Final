import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, FeatureGroup, Polyline } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const FormCarretera = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [nombre, setNombre] = useState('');
    const [municipioOrigen, setMunicipioOrigen] = useState('');
    const [municipioDestino, setMunicipioDestino] = useState('');
    const [municipios, setMunicipios] = useState([]);
    const [estado, setEstado] = useState('libre');
    const [razonBloqueo, setRazonBloqueo] = useState('');
    const [recorrido, setRecorrido] = useState([]); 
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        getListaMunicipios();
        if (id) {
            getCarreteraById();
        }
    }, [id]);

    const getListaMunicipios = () => {
        axios.get('http://localhost:3000/municipios', {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            setMunicipios(res.data);
        })
        .catch(error => {
            console.error("Error al obtener los municipios:", error);
        });
    };

    const getCarreteraById = () => {
        axios.get(`http://localhost:3000/carreteras/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
            const carretera = res.data;
            setNombre(carretera.nombre);
            setMunicipioOrigen(carretera.municipioOrigenId || '');
            setMunicipioDestino(carretera.municipioDestinoId || '');
            setEstado(carretera.estado);
            setRazonBloqueo(carretera.razon_bloqueo || '');
            setRecorrido(carretera.recorrido || []); 
        })
        .catch((error) => {
            console.error("Error al obtener la carretera:", error);
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

        const carretera = { 
            nombre, 
            municipioOrigenId: municipioOrigen, 
            municipioDestinoId: municipioDestino, 
            estado, 
            razonBloqueo, 
            recorrido 
        };

        if (id) {
            editarCarretera(carretera);
        } else {
            crearCarretera(carretera);
        }
    };

    const editarCarretera = (carretera) => {
        axios.put(`http://localhost:3000/carreteras/${id}`, carretera, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Carretera editada:", res.data);
            navigate('/dashboard/carreteras');
        })
        .catch(error => {
            console.error("Error al editar la carretera:", error);
        });
    };

    const crearCarretera = (carretera) => {
        axios.post(`http://localhost:3000/carreteras`, carretera, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Carretera creada:", res.data);
            navigate('/dashboard/carreteras');
        })
        .catch(error => {
            console.error("Error al crear la carretera:", error);
        });
    };

    const onDrawCreated = (e) => {
        const { layer } = e;
        const latLngs = layer.getLatLngs();
        setRecorrido(latLngs.map(({ lat, lng }) => [lat, lng]));
    };

    const onDrawEdited = (e) => {
        const layers = e.layers;
        layers.eachLayer((layer) => {
            const latLngs = layer.getLatLngs();
            setRecorrido(latLngs.map(({ lat, lng }) => [lat, lng]));
        });
    };

    return (
        <Container>
            <Row className="mt-5 justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>{id ? "Editar Carretera" : "Crear Carretera"}</h2>
                            </Card.Title>
                            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                <Form.Group>
                                    <Form.Label>Nombre de la Carretera:</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Form.Label>Municipio de Origen:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        required
                                        value={municipioOrigen}
                                        onChange={(e) => setMunicipioOrigen(e.target.value)}
                                    >
                                        <option value="">Seleccione un municipio</option>
                                        {municipios.map((municipio) => (
                                            <option key={municipio.id} value={municipio.id}>
                                                {municipio.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    <Form.Label>Municipio de Destino:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        required
                                        value={municipioDestino}
                                        onChange={(e) => setMunicipioDestino(e.target.value)}
                                    >
                                        <option value="">Seleccione un municipio</option>
                                        {municipios.map((municipio) => (
                                            <option key={municipio.id} value={municipio.id}>
                                                {municipio.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    <Form.Label>Estado:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                    >
                                        <option value="libre">Libre</option>
                                        <option value="bloqueada">Bloqueada</option>
                                    </Form.Control>
                                </Form.Group>
                                {estado === "bloqueada" && (
                                    <Form.Group className="mt-3">
                                        <Form.Label>Razón de Bloqueo:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={razonBloqueo}
                                            onChange={(e) => setRazonBloqueo(e.target.value)}
                                        />
                                    </Form.Group>
                                )}

                                <Form.Group className="mt-3">
                                    <Form.Label>Mapa (Trazar Recorrido):</Form.Label>
                                    <div style={{ height: "400px" }}>
                                        <MapContainer
                                            center={[-16.2902, -63.5887]}
                                            zoom={6}
                                            style={{ height: "100%", width: "100%" }}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <FeatureGroup>
                                                <EditControl
                                                    position="topright"
                                                    onCreated={onDrawCreated}
                                                    onEdited={onDrawEdited}
                                                    draw={{
                                                        rectangle: false,
                                                        circle: false,
                                                        circlemarker: false,
                                                        marker: false,
                                                        polygon: false,
                                                    }}
                                                />
                                                {recorrido.length > 0 && <Polyline positions={recorrido} />}
                                            </FeatureGroup>
                                        </MapContainer>
                                    </div>
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

export default FormCarretera;
