import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Table, Image } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { useNavigate } from "react-router-dom";

const SolicitudesProcesadas = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getSolicitudesProcesadas();
    }, []);

    const getSolicitudesProcesadas = () => {
        axios.get("http://localhost:3000/solicitudes-incidencia/procesadas", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
            setSolicitudes(res.data);
        })
        .catch((error) => {
            console.error("Error al obtener las solicitudes procesadas:", error);
        });
    };

    const volverARevisar = () => {
        navigate("/dashboard/solicitudes"); 
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-3">
                <div className="d-flex justify-content-between mb-3">
                    <h3>Solicitudes Procesadas</h3>
                    <Button variant="secondary" onClick={volverARevisar}>
                        Volver a Revisar Solicitudes
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

export default SolicitudesProcesadas;
