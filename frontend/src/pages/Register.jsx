// src/pages/Register.jsx
import { Link } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';

const Register = () => {



    // inside Register component
const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Registered successfully');
    } else {
      alert(data.message || 'Error');
    }
  };
  
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }} className="p-4">
        <h3 className="mb-3 text-center">Register</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Register
          </Button>

          <div className="mt-3 text-center">
            Already have an account? <Link to="/">Login</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
