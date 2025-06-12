import { useState } from 'react';

export default function LoginModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    password: '',
    country: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');

  if (!open) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.name,
          password: form.password
        })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('user', JSON.stringify({ ...form, token: data.token }));
        onSuccess();
      } else {
        setError('Login failed. Use username: "mor_2314", password: "83r5^_" for demo.');
      }
    } catch {
      setError('Network error. Try again.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Login / Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
          <input name="phone" placeholder="Phone (with country code)" value={form.phone} onChange={handleChange} required pattern="^\+\d{1,3}\d{7,}$" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <button type="submit" className="buy-now-btn" style={{ marginTop: 16 }}>Login / Register</button>
          {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
        </form>
        <button onClick={onClose} style={{ marginTop: 12 }}>Cancel</button>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 3000;
        }
        .modal-content {
          background: #fff; padding: 32px 24px; border-radius: 10px; min-width: 320px;
        }
        input { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }
      `}</style>
    </div>
  );
}
