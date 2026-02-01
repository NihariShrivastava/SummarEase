import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Sun, Moon } from 'lucide-react';

const Navigation = ({ darkMode, toggleTheme }) => {
    const location = useLocation();

    return (
        <Navbar expand="lg" className="py-3 sticky-top navbar-glass" variant={darkMode ? 'dark' : 'light'}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
                    <img src="/logo.png" alt="Logo" width="40" height="40" className="me-2" style={{ objectFit: 'contain' }} />
                    <span className="tracking-tight">SUMMAR<span className="text-danger">EASE</span></span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {location.pathname !== '/' && (
                            <Nav.Link as={Link} to="/" className="fw-medium mx-2 d-none d-lg-block">
                                Home
                            </Nav.Link>
                        )}

                        <Nav.Link as={Link} to="/video" className={`fw-medium mx-2 ${location.pathname === '/video' ? 'text-danger active' : ''}`}>
                            Video
                        </Nav.Link>
                        <Nav.Link as={Link} to="/text" className={`fw-medium mx-2 ${location.pathname === '/text' ? 'text-danger active' : ''}`}>
                            Text
                        </Nav.Link>
                        <Nav.Link as={Link} to="/data" className={`fw-medium mx-2 ${location.pathname === '/data' ? 'text-danger active' : ''}`}>
                            Data
                        </Nav.Link>
                        <Button
                            variant={darkMode ? "outline-light" : "outline-dark"}
                            size="sm"
                            className="ms-3 rounded-circle d-flex align-items-center justify-content-center p-2"
                            onClick={toggleTheme}
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
