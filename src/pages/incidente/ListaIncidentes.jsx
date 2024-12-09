import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Modal, Form } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ListaIncidentes = () => {
    const [incidentes, setIncidentes] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFotosModal, setShowFotosModal] = useState(false);
    const [fotos, setFotos] = useState([]);
    const [selectedCoordinates, setSelectedCoordinates] = useState({ lat: 0, lng: 0 });
    const [selectedIncidenteId, setSelectedIncidenteId] = useState(null);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getListaIncidentes();
        document.title = "Lista de Incidentes";
    }, []);

    const getListaIncidentes = () => {
        axios.get('http://localhost:3000/incidentes', {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            setIncidentes(res.data);
        })
        .catch(error => {
            console.error("Error al obtener los incidentes:", error);
        });
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (!file) {
            alert("Por favor, seleccione un archivo.");
            return;
        }

        const formData = new FormData();
        formData.append("fotoPerfil", file);

        axios.post(`http://localhost:3000/incidentes/${selectedIncidenteId}/upload`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        })
        .then(res => {
            console.log("Foto subida:", res.data);
            setShowUploadModal(false);
            setFile(null);
            getListaIncidentes(); 
        })
        .catch(error => {
            console.error("Error al subir la foto:", error);
        });
    };

    const getFotos = (id) => {
        setSelectedIncidenteId(id);
        axios.get(`http://localhost:3000/incidentes/${id}/fotos`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            setFotos(res.data.fotos); 
            setShowFotosModal(true);
        })
        .catch(error => {
            console.error("Error al obtener las fotos:", error);
        });
    };

    const eliminarFoto = (fotoId) => {
        const confirm = window.confirm("¿Está seguro de eliminar esta foto?");
        if (!confirm) return;

        axios.delete(`http://localhost:3000/fotos/${fotoId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
            setFotos((prevFotos) => prevFotos.filter((foto) => foto.id !== fotoId));
            console.log("Foto eliminada correctamente");
        })
        .catch((error) => {
            console.error("Error al eliminar la foto:", error);
        });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el incidente?");
        if (!confirm) return;

        axios.delete(`http://localhost:3000/incidentes/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
            getListaIncidentes();
            console.log("Incidente eliminado correctamente");
        })
        .catch((error) => {
            console.error("Error al eliminar el incidente:", error);
        });
    };

    const editar = (id) => {
        navigate(`/dashboard/incidentes/form/${id}`);
    };

    const crearIncidente = () => {
        navigate(`/dashboard/incidentes/form`);
    };

    const verEnMapa = (lat, lng) => {
        setSelectedCoordinates({ lat, lng });
        setShowMap(true);
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row className="mb-3">
                    <Col>
                        <Button variant="success" onClick={crearIncidente}>
                            Crear Incidente
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Lista de Incidentes</h2>
                                </Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Foto</th>
                                            <th>Descripción</th>
                                            <th>Tipo</th>
                                            <th>Carretera</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incidentes.map((incidente) => (
                                            <tr key={incidente.id}>
                                                <td>{incidente.id}</td>
                                                <td>
                                                <img 
                                                    src={`http://localhost:3000/incidentes/${incidente.id}.jpg`} 
                                                    alt={`Imagen de ${incidente.nombre}`} 
                                                    width="100" 
                                                                
                                                />
                                                </td>
                                                <td>{incidente.descripcion}</td>
                                                <td>{incidente.tipo}</td>
                                                <td>{incidente.carretera?.nombre || "No especificada"}</td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => editar(incidente.id)}
                                                        className="me-2"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="info"
                                                        onClick={() =>
                                                            verEnMapa(incidente.latitud, incidente.longitud)
                                                        }
                                                        className="me-2"
                                                    >
                                                        Ver en mapa
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => getFotos(incidente.id)}
                                                        className="me-2"
                                                    >
                                                        Ver Fotos
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => eliminar(incidente.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal para mostrar el mapa */}
            <Modal show={showMap} onHide={() => setShowMap(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ubicación del Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: "400px" }}>
                        <MapContainer
                            center={[selectedCoordinates.lat, selectedCoordinates.lng]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[selectedCoordinates.lat, selectedCoordinates.lng]}></Marker>
                        </MapContainer>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMap(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para mostrar las fotos */}
            <Modal show={showFotosModal} onHide={() => setShowFotosModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Fotos del Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {fotos.length > 0 ? (
                        <Row>
                            {fotos.map((foto, index) => (
                                <Col key={index} md={4} className="mb-3">
                                    <div className="text-center">
                                    <img 
                                        src={`http://localhost:3000/incidentes/${incidentes.id}.jpg`} 
                                        alt={`Imagen de ${incidentes.nombre}`} 
                                        width="100" 
                                                    
                                    />
                                        <Button
                                            variant="danger"
                                            className="mt-2"
                                            onClick={() => eliminarFoto(foto.id)}
                                        >
                                            Eliminar Foto
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p>No hay fotos disponibles para este incidente.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFotosModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para subir foto */}
            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Subir Foto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpload}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Seleccionar Foto</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Subir
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ListaIncidentes;
