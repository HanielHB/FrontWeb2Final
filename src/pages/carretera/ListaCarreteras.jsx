import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { useNavigate } from "react-router-dom";

const ListaCarreteras = () => {
    const [carreteras, setCarreteras] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getListaCarreteras();
        document.title = "Lista de Carreteras";
    }, []);

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

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar la carretera?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/carreteras/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Carretera eliminada:", res.data);
            getListaCarreteras(); 
        })
        .catch(error => {
            console.error("Error al eliminar la carretera:", error);
        });
    };

    const editar = (id) => {
        navigate(`/dashboard/carreteras/form/${id}`); 
    };

    const crearCarretera = () => {
        navigate(`/dashboard/carreteras/form`); 
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row className="mb-3">
                    <Col>
                        <Button variant="success" onClick={crearCarretera}>
                            Crear Carretera
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Lista de Carreteras</h2>
                                </Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Municipio Origen</th>
                                            <th>Municipio Destino</th>
                                            <th>Estado</th>
                                            <th>Razón de Bloqueo</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {carreteras.map(carretera =>
                                            <tr key={carretera.id}>
                                                <td>{carretera.id}</td>
                                                <td>{carretera.nombre}</td>
                                                <td>{carretera.municipioOrigen?.nombre || "Sin especificar"}</td>
                                                <td>{carretera.municipioDestino?.nombre || "Sin especificar"}</td>
                                                <td>{carretera.estado}</td>
                                                <td>{carretera.estado === "bloqueada" ? carretera.razonBloqueo : "N/A"}</td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => { editar(carretera.id); }}
                                                        className="me-2"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => { eliminar(carretera.id); }}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListaCarreteras;
