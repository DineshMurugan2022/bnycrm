// pages/Contacts.jsx
import { useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '' });

  const addContact = () => {
    setContacts([...contacts, newContact]);
    setNewContact({ name: '', email: '' });
  };

  return (
    <div className="container mt-4">
      <h2>Contacts</h2>
      <Form>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={newContact.name}
            onChange={e => setNewContact({ ...newContact, name: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={newContact.email}
            onChange={e => setNewContact({ ...newContact, email: e.target.value })}
          />
        </Form.Group>
        <Button className="mt-2" onClick={addContact}>Add Contact</Button>
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr><th>Name</th><th>Email</th></tr>
        </thead>
        <tbody>
          {contacts.map((c, index) => (
            <tr key={index}>
              <td>{c.name}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Contacts;
