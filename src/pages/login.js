import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({
    name: '',
    password: '',
    country: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    // For demo: send only username/password to Fake Store API
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
        // Save user info and token to localStorage
        localStorage.setItem('user', JSON.stringify({ ...form, token: data.token }));
        router.push('/address');
      } else {
        setError('Login failed. Use username: "mor_2314", password: "83r5^_" for demo.');
      }
    } catch {
      setError('Network error. Try again.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: '2rem auto' }}>
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
    </div>
  );
}
