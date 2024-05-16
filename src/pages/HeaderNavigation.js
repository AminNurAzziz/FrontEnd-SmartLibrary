import React from 'react';
import { Container, Navbar, Nav, Image } from 'react-bootstrap';
import logo1 from '../assets/logo/logo_library.png';
import logo2 from '../assets/logo/logo_polinema.png';
import { alpha } from '@mui/material/styles';
import '../assets/css/style.css';

const Header = () => {
    const color = '#0f1f40';
    return (
        <Navbar bg="light" expand="lg" style={{ boxShadow: `0px 4px 6px 0px ${alpha(color, 0.1)}` }}>
            <Container style={{ height: ' 50px' }} >
                <Navbar.Brand href="#">
                    <Image src={logo2} alt="Logo 2" style={{ width: '55px', height: 'auto', marginRight: '10px' }} />
                    <Image src={logo1} alt="Logo 1" style={{ width: '105px', height: 'auto' }} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/">Borrow</Nav.Link>
                        <Nav.Link href="#about">History</Nav.Link>
                        <Nav.Link href="#about">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
