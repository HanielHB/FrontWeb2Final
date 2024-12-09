import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        verificarRol();
        document.title = "Dashboard";
    }, []);

    const verificarRol = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión");
            navigate("/login");
            return;
        }
    
        axios.get("http://localhost:3000/usuarios/rol", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
            console.log("Rol recibido:", res.data);
            if (res.data.tipo === "admin") {
                setIsAdmin(true);
                getListaUsuarios();
            } else {
                alert("No tienes permisos para acceder a esta pantalla.");
                navigate("/"); 
            }
        })
        .catch(error => {
            console.error("Error al verificar el rol:", error.response || error.message);
            alert("No tienes permisos para acceder");
            navigate("/login");
        });
    };

    const getListaUsuarios = () => {
        axios.get("http://localhost:3000/usuarios", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            setUsuarios(res.data);
        })
        .catch(error => {
            console.error("Error al obtener la lista de usuarios:", error);
        });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el registro?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/usuarios/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log(res.data);
            getListaUsuarios();  
        })
        .catch(error => {
            console.log(error);
        });
    };

    const editar = (id) => {
        navigate(`/usuarios/form/${id}`); 
    };

    const crearUsuario = () => {
        navigate(`/usuarios/form`); 
    };
    
    const actualizarPassword = (id) => {
        navigate(`/usuarios/password/${id}`); 
    };

    if (!isAdmin) {
        return null; 
    }

    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row className="mb-3">
                    <Col>
                        <Button variant="success" onClick={crearUsuario}>
                            Crear Usuario
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Dashboard</h2>
                                </Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Email</th>
                                            <th>Tipo</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map(usuario =>
                                            <tr key={usuario.id}>
                                                <td>{usuario.id}</td>
                                                <td>{usuario.email}</td>
                                                <td>{usuario.tipo}</td>
                                                <td>
                                                    <Button 
                                                        variant="primary" 
                                                        onClick={() => { editar(usuario.id); }} 
                                                        className="me-2">
                                                        Editar
                                                    </Button>
                                                    <Button 
                                                        variant="warning" 
                                                        onClick={() => { actualizarPassword(usuario.id); }} 
                                                        className="me-2">
                                                        Cambiar Contraseña
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        onClick={() => { eliminar(usuario.id); }}>
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

export default Dashboard;
