import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FormSolicitud = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [descripcion, setDescripcion] = useState("");
    const [fotoUrl, setFotoUrl] = useState("");
    const [estado, setEstado] = useState("pendiente");
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (id) {
            getSolicitudById();
        }
    }, [id]);

    const getSolicitudById = () => {
        axios
            .get(`http://localhost:3000/solicitudes-incidencia/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                const solicitud = res.data;
                setDescripcion(solicitud.descripcion);
                setFotoUrl(solicitud.foto_url);
                setEstado(solicitud.estado);
            })
            .catch((error) => {
                console.error("Error al obtener la solicitud:", error);
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

        const solicitud = { descripcion, foto_url: fotoUrl, estado };

        if (id) {
            editarSolicitud(solicitud);
        } else {
            crearSolicitud(solicitud);
        }
    };

    const editarSolicitud = (solicitud) => {
        axios
            .put(`http://localhost:3000/solicitudes-incidencia/${id}`, solicitud, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                console.log("Solicitud editada:", res.data);
                navigate("/solicitudes-incidencia");
            })
            .catch((error) => {
                console.error("Error al editar la solicitud:", error);
            });
    };

    const crearSolicitud = (solicitud) => {
        axios
            .post("http://localhost:3000/solicitudes-incidencia", solicitud, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                console.log("Solicitud creada:", res.data);
                navigate("/dashboard/solicitudes");
            })
            .catch((error) => {
                console.error("Error al crear la solicitud:", error);
            });
    };

    return (
        <Container>
            <Row className="mt-5 justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>{id ? "Editar Solicitud" : "Crear Solicitud"}</h2>
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
                                    <Form.Label>Foto URL:</Form.Label>
                                    <Form.Control
                                        required
                                        type="url"
                                        value={fotoUrl}
                                        onChange={(e) => setFotoUrl(e.target.value)}
                                    />
                                </Form.Group>
                                {id && (
                                    <Form.Group className="mt-3">
                                        <Form.Label>Estado:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}
                                            disabled 
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="procesado">Procesado</option>
                                        </Form.Control>
                                    </Form.Group>
                                )}
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

export default FormSolicitud;
