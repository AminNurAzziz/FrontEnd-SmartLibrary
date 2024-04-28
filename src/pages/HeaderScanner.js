import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import logo1 from '../assets/logo/logo_library.png';
import logo2 from '../assets/logo/logo_polinema.png';
import { alpha } from '@mui/material/styles';
import '../assets/css/style.css';

const Header = () => {
    const color = '#0f1f40';
    return (
        <header className="py-2" style={{ backgroundColor: '#fff', boxShadow: `0px 4px 6px 0px ${alpha(color, 0.1)}` }}>
            <Container>
                <Row className="justify-content-center align-items-center" style={{ animation: 'fadeIn 3s ease', }}>
                    <Col xs="auto">
                        <img src={logo2} alt="Logo 2" className="img-fluid" style={{ width: '60px', height: 'auto', marginRight: '-10px' }} />
                    </Col>
                    <Col xs="auto">
                        <img src={logo1} alt="Logo 1" className="img-fluid" style={{ width: '110px', height: 'auto', marginLeft: '-10px' }} />
                    </Col>
                </Row>
            </Container>
        </header>
    );
};

export default Header;
