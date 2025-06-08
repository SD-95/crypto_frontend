import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';

const Navbar_content = () => {
    return (
        <React.Fragment>
            <Navbar expand="lg" className="bg-body-tertiary" bg="primary" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="">Crypto-Currency Predictor</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={NavLink} to="" end>Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* <!-- Hero Section --> */}
            <section className="hero">
                <div className="container">
                    <h1>Predict Liquidity & Make Smart Decisions</h1>
                    <p className="lead">Input coin metrics to check liquidity risk and investment advice.</p>
                </div>
            </section>
        </React.Fragment>
    )
}

export default Navbar_content
