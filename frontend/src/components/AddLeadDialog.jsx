import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AddLeadDialog = ({ show, onClose, onAddLead }) => {
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    value: '',
    stage: 'New', // Default stage is 'New'
    lastActivity: 'Just Now', // Default activity
    initials: '', // You can calculate initials from name or let the user fill this
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'value') {
      // Allow only numeric values and the comma for formatting
      const numericValue = value.replace(/[^\d,]/g, '');
      setNewLead({
        ...newLead,
        [name]: numericValue,
      });
    } else {
      setNewLead({
        ...newLead,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add INR symbol to the value when submitting the form
    const formattedLead = {
      ...newLead,
      value: `₹${newLead.value}`, // Adding INR symbol
    };
    onAddLead(formattedLead); // Adds the new lead to the state
    onClose(); // Closes the dialog
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={12} sm={6} className="mb-3">
              <Form.Group controlId="formLeadName">
                <Form.Label>Lead Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newLead.name}
                  onChange={handleInputChange}
                  placeholder="Enter lead's name"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} className="mb-3">
              <Form.Group controlId="formLeadCompany">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={newLead.company}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} className="mb-3">
              <Form.Group controlId="formLeadValue">
                <Form.Label>Value</Form.Label>
                <Form.Control
                  type="text"
                  name="value"
                  value={newLead.value}
                  onChange={handleInputChange}
                  placeholder="Enter lead value"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} className="mb-3">
              <Form.Group controlId="formLeadStage">
                <Form.Label>Stage</Form.Label>
                <Form.Control
                  as="select"
                  name="stage"
                  value={newLead.stage}
                  onChange={handleInputChange}
                  required
                >
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              Add Lead
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddLeadDialog;
