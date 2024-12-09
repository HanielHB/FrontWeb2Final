import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavMenu from "../../components/NavMenu";

const Login = () => {
    const navigate = useNavigate();

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onLoginClick = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const credentials = { email, password };
        loginUser(credentials);
    };

    const loginUser = (credentials) => {
        axios.post('http://localhost:3000/usuarios/login', credentials)
            .then(res => {
                const { token } = res.data;

                
                localStorage.setItem('token', token);

                
                axios.get('http://localhost:3000/usuarios/rol', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(res => {
                    const { tipo } = res.data;

                    if (tipo === 'admin') {
                        
                        navigate('/dashboard');
                    } else if (tipo === 'verificador') {
                        
                        navigate('/dashboard/carreteras');
                    } else {
                        
                        localStorage.removeItem('token');
                        setErrorMessage("Rol no autorizado.");
                    }
                })
                .catch(error => {
                    console.error("Error al verificar el rol:", error);
                    setErrorMessage("No se pudo verificar el rol del usuario.");
                });
            })
            .catch(error => {
                console.error(error);
                setErrorMessage("Credenciales inválidas, intente nuevamente.");
            });
    };

    return (
        <>
            <NavMenu />
            <Container>
                <Row className="mt-5 justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Iniciar Sesión</h2>
                                </Card.Title>
                                {errorMessage && (
                                    <div className="alert alert-danger">{errorMessage}</div>
                                )}
                                <Form noValidate validated={validated} onSubmit={onLoginClick}>
                                    <Form.Group>
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control 
                                            required 
                                            type="email" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese un email válido.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mt-3">
                                        <Form.Label>Contraseña:</Form.Label>
                                        <Form.Control 
                                            required 
                                            type="password" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese su contraseña.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mt-3">
                                        <Button type="submit">Iniciar Sesión</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>    
    );
};

export default Login;
