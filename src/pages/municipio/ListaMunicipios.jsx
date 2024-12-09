import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { useNavigate } from "react-router-dom";

const ListaMunicipios = () => {
    const [municipios, setMunicipios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getListaMunicipios();
        document.title = "Lista de Municipios";
    }, []);

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

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el municipio?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/municipios/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Municipio eliminado:", res.data);
            getListaMunicipios(); 
        })
        .catch(error => {
            console.error("Error al eliminar el municipio:", error);
        });
    };

    const editar = (id) => {
        navigate(`/dashboard/municipios/form/${id}`); 
    };

    const crearMunicipio = () => {
        navigate(`/dashboard/municipios/form`); 
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row className="mb-3">
                    <Col>
                        <Button variant="success" onClick={crearMunicipio}>
                            Crear Municipio
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Lista de Municipios</h2>
                                </Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {municipios.map(municipio =>
                                            <tr key={municipio.id}>
                                                <td>{municipio.id}</td>
                                                <td>{municipio.nombre}</td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => { editar(municipio.id); }}
                                                        className="me-2"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => { eliminar(municipio.id); }}
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

export default ListaMunicipios;
