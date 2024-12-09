import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NavMenu = () => {
    const [userEmail, setUserEmail] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Recuperar correo desde localStorage
        const email = localStorage.getItem("userEmail");
        if (!email) {
            console.warn("No se encontró el correo del usuario en localStorage.");
        }
        setUserEmail(email);
    }, []);

    const handleLogout = () => {
        // Eliminar datos de sesión y redirigir
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#home" className="text-white">Proyecto</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Opciones del menú */}
                    </Nav>
                    <Nav>
                        {userEmail ? (
                            <>
                                <span className="navbar-text text-white me-3">
                                    {userEmail}
                                </span>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleLogout}
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <span className="navbar-text text-white">
                                Usuario no identificado
                            </span>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavMenu;
