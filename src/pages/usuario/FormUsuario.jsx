import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const FormUsuario = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const isPasswordMode = location.pathname.includes("password"); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tipo, setTipo] = useState('verificador'); 
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (id) {
            getUsuarioById();
        }
    }, [id]);

    const getUsuarioById = () => {
        axios.get(`http://localhost:3000/usuarios/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            const usuario = res.data;
            setEmail(usuario.email);
            setTipo(usuario.tipo);
        })
        .catch(error => {
            console.error("Error al obtener el usuario:", error);
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

        if (isPasswordMode) {
            actualizarPassword();
        } else if (id) {
            editarUsuario();
        } else {
            crearUsuario();
        }
    };

    const editarUsuario = () => {
        const usuario = { email, tipo };
        axios.put(`http://localhost:3000/usuarios/${id}`, usuario, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Usuario editado:", res.data);
            navigate('/dashboard');
        })
        .catch(error => {
            console.error("Error al editar el usuario:", error);
        });
    };

    const actualizarPassword = () => {
        if (!password) {
            alert("La contraseña no puede estar vacía.");
            return;
        }
        axios.put(`http://localhost:3000/usuarios/${id}`, { password }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Contraseña actualizada:", res.data);
            navigate('/dashboard');
        })
        .catch(error => {
            console.error("Error al actualizar la contraseña:", error);
        });
    };

    const crearUsuario = () => {
        const usuario = { email, password, tipo };
        axios.post(`http://localhost:3000/usuarios`, usuario, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(res => {
            console.log("Usuario creado:", res.data);
            navigate('/dashboard');
        })
        .catch(error => {
            console.error("Error al crear el usuario:", error);
        });
    };

    return (
        <Container>
            <Row className="mt-5 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>
                                    {isPasswordMode ? "Cambiar Contraseña" : id ? "Editar Usuario" : "Crear Usuario"}
                                </h2>
                            </Card.Title>
                            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                {!isPasswordMode && (
                                    <>
                                        <Form.Group>
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isPasswordMode} 
                                            />
                                        </Form.Group>
                                        <Form.Group className="mt-3">
                                            <Form.Label>Tipo:</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={tipo}
                                                onChange={(e) => setTipo(e.target.value)}
                                                disabled={isPasswordMode} 
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="verificador">Verificador</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </>
                                )}
                                <Form.Group className="mt-3">
                                    <Form.Label>Contraseña:</Form.Label>
                                    <Form.Control
                                        required={isPasswordMode || !id} 
                                        type="password"
                                        placeholder={
                                            id && !isPasswordMode
                                                ? "Dejar en blanco para no cambiar"
                                                : "Ingrese una nueva contraseña"
                                        }
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={!isPasswordMode && id} 
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

export default FormUsuario;
