import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Table, Image } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { useNavigate } from "react-router-dom";

const ListaSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getSolicitudes();
    }, []);

    const getSolicitudes = () => {
        axios.get("http://localhost:3000/solicitudes-incidencia/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
            setSolicitudes(res.data);
        })
        .catch((error) => {
            console.error("Error al obtener las solicitudes:", error);
        });
    };

    const aprobarSolicitud = (id) => {
        axios.put(`http://localhost:3000/solicitudes-incidencia/${id}/aprobar`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
            getSolicitudes(); 
        })
        .catch((error) => {
            console.error("Error al aprobar la solicitud:", error);
        });
    };

    const rechazarSolicitud = (id) => {
        axios.put(`http://localhost:3000/solicitudes-incidencia/${id}/rechazar`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
            getSolicitudes(); 
        })
        .catch((error) => {
            console.error("Error al rechazar la solicitud:", error);
        });
    };

    const verProcesadas = () => {
        navigate("/solicitudes/procesadas"); 
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-3">
                <div className="d-flex justify-content-between mb-3">
                    <h3>Revisión de Solicitudes de Incidencia</h3>
                    <Button variant="primary" onClick={verProcesadas}>
                        Ver Solicitudes Procesadas
                    </Button>
                </div>
                <Card>
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Descripción</th>
                                    <th>Foto</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudes.map((solicitud) => (
                                    <tr key={solicitud.id}>
                                        <td>{solicitud.id}</td>
                                        <td>{solicitud.descripcion}</td>
                                        <td>
                                            <Image
                                                src={`http://localhost:3000/${solicitud.foto_url}`}
                                                alt="Foto de la solicitud"
                                                width={100}
                                                rounded
                                            />
                                        </td>
                                        <td>{solicitud.estado}</td>
                                        <td>
                                            <Button
                                                variant="success"
                                                onClick={() => aprobarSolicitud(solicitud.id)}
                                                className="me-2"
                                            >
                                                Aprobar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => rechazarSolicitud(solicitud.id)}
                                            >
                                                Rechazar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ListaSolicitudes;
