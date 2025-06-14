import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SignUp() {
  const [form, setForm] = useState({
    email: '', password: '', name: '', country: '', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem('sb-user');
      if (stored) {
        router.push('/'); // Redirect to home if already logged in
      }
    }
  }, [router]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // 2. Insert profile
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: user.id,
            name: form.name,
            country: form.country,
            phone: form.phone,
          }
        ]);

        if (profileError) {
          setError(profileError.message);
        } else {
          localStorage.setItem('sb-user', JSON.stringify(user));
          // Redirect to shopping list (home page) after successful signup
          router.push('/');
        }
      } else {
        setError('Please check your email to confirm your account.');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Eco Cart</title>
      </Head>
      <div className="auth-container">
        <div className="auth-form">
          <h2>Join Eco Cart</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>

        <style jsx>{`
          .auth-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
            padding: 2rem;
          }
          .auth-form {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
          }
          .auth-form h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #333;
          }
          .auth-form input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .auth-form button {
            width: 100%;
            padding: 0.75rem;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }
          .auth-form button:hover {
            background: #218838;
          }
          .auth-form button:disabled {
            background: #6c757d;
            cursor: not-allowed;
          }
          .error {
            color: #dc3545;
            text-align: center;
            margin-top: 1rem;
          }
          .auth-form p {
            text-align: center;
            margin-top: 1rem;
          }
          .auth-form a {
            color: #007bff;
            text-decoration: none;
          }
        `}</style>
      </div>
    </>
  );
}
