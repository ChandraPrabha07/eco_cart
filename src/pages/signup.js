import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function SignUp() {
  const [form, setForm] = useState({
    email: '', password: '', name: '', country: '', phone: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // 1. Sign up user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) return setError(signUpError.message);

    // 2. Insert profile (if signup succeeded)
    // Wait for email confirmation if you have it enabled!
    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id, // This links the profile to the auth user
          name: form.name,
          country: form.country,
          phone: form.phone,
        }
      ]);
      if (profileError) return setError(profileError.message);
      // Optionally, store user info locally
      localStorage.setItem('sb-user', JSON.stringify(user));
      router.push('/');
    } else {
      setError('Please check your email to confirm your account before proceeding.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit" style={{ marginTop: 16 }}>Sign Up</button>
        {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      </form>
    </div>
  );
}
