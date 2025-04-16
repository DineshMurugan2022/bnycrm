import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Dropdown, Badge } from 'react-bootstrap';
import { FaBell, FaUser, FaSearch, FaCog } from 'react-icons/fa';

const Header = ({ title }) => {
  return (
    <Navbar bg="light" expand="lg" className="border-bottom px-3 py-2 justify-content-between">
      <Navbar.Brand className="fw-bold fs-4">{title}</Navbar.Brand>

      <div className="d-flex align-items-center gap-3">

        <Form className="d-none d-md-flex position-relative">
          <FaSearch className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
          <FormControl
            type="search"
            placeholder="Search..."
            className="ps-5"
            style={{ width: '300px' }}
          />
        </Form>

        <Button variant="link" className="position-relative p-0 me-2">
          <FaBell size={18} />
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle p-1 border border-light rounded-circle"
          ></Badge>
        </Button>

        <Dropdown align="end">
          <Dropdown.Toggle
            as={Button}
            variant="outline-secondary"
            className="rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: '38px', height: '38px' }}
          >
            <FaUser size={16} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>My Account</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Header;
