import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const NavigationBar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar bg="light" expand="lg" expanded={expanded}>
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/Index">
          B&Y CRM
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/Index">Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/Monitoring">Monitoring</Nav.Link>
            <Nav.Link as={NavLink} to="/leads">Leads</Nav.Link>
            <Nav.Link as={NavLink} to="/tasks">Tasks</Nav.Link>
            <Nav.Link as={NavLink} to="/calendar">Calendar</Nav.Link>
            <Nav.Link as={NavLink} to="/team">Team</Nav.Link>
            <Nav.Link as={NavLink} to="/appointment">Appointment</Nav.Link>
            <Nav.Link as={NavLink} to="/bdm">BDM</Nav.Link>
            <Nav.Link as={NavLink} to="/call">Call</Nav.Link>
            <Nav.Link as={NavLink} to="/livelocation">Live Location</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
