import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('/user/register', form);
    alert('Registrasi berhasil! Silakan login.');
    navigate('/login');
  } catch (err) {
    console.error('Error detail:', err.response?.data || err.message);
    alert('Registrasi gagal: ' + (err.response?.data?.message || 'Pastikan data sudah benar.'));
  }
};

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '400px' }} className="p-4 shadow-sm">
        <h4 className="text-center mb-3">Daftar Akun</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-2">
            Daftar
          </Button>
        </Form>

        <div className="text-center mt-2">
          <small>
            Sudah punya akun?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Login
            </Link>
          </small>
        </div>
      </Card>
    </Container>
  );
}

export default Register;
