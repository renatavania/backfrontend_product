import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';
import Swal from 'sweetalert2'; // ✅ import SweetAlert2

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/login', form);
      localStorage.setItem('token', res.data.token);

      // ✅ tampilkan pop-up sukses
      Swal.fire({
        title: 'Login Berhasil 🎉',
        text: 'Selamat datang kembali!',
        icon: 'success',
        confirmButtonText: 'Lanjut ke Dashboard',
        confirmButtonColor: '#0d6efd',
      }).then(() => {
        navigate('/dashboard');
      });

    } catch (err) {
      // ❌ tampilkan pop-up error
      Swal.fire({
        title: 'Login Gagal',
        text: 'Email atau password salah!',
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
      });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: '400px' }}>
        <h4 className="text-center mb-4">Login</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100">
            Login
          </Button>
        </Form>
        <p className="text-center mt-3 mb-0">
          Belum punya akun? <a href="/register">Daftar</a>
        </p>
      </Card>
    </Container>
  );
}

export default Login;
