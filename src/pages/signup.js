import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Notification from '../components/Notification';

export default function Signup() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Debounced address search
  let debounceTimer;
  const handleAddressInput = (e) => {
    const value = e.target.value;
    setAddressQuery(value);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchAddress(value);
    }, 600);
  };

  const searchAddress = async (q) => {
    if (!q) return setAddressResults([]);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
    );
    const data = await res.json();
    setAddressResults(data);
  };

  const handleAddressSelect = (place) => {
    setShippingAddress(place.display_name);
    setAddressQuery(place.display_name);
    setAddressResults([]);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setNotification(error.message);
      setLoading(false);
      return;
    }

    // 2. Insert profile info into profiles table
    const user = data.user || data.session?.user;
    if (user) {
      const { error: profileError } = await supabase.from('profiles').upsert([{
        id: user.id,
        name,
        country,
        phone,
        email,
        shipping_address: shippingAddress,
      }]);
      if (profileError) {
        setNotification('Signup succeeded, but failed to save profile.');
        setLoading(false);
        return;
      }
    }

    setNotification('Signup successful! Redirecting...');
    setTimeout(() => {
      router.push('/'); // or '/cart'
    }, 1200);
    setLoading(false);
  };

  return (
  <>
    <Head>
      <title>Sign Up - Eco Cart</title>
    </Head>
    <Notification message={notification} onClose={() => setNotification('')} />
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#f6f7f9', borderRadius: 8 }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <label>Name:</label>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: 12 }}
        />

        <label>Country:</label>
        <input
          type="text"
          required
          value={country}
          onChange={e => setCountry(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: 12 }}
        />

        <label>Phone Number:</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: 12 }}
        />

        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: 12 }}
        />

        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: 12 }}
        />

        <label>Shipping Address (powered by OpenStreetMap):</label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            type="text"
            required
            value={addressQuery}
            onChange={handleAddressInput}
            placeholder="Enter your address"
            style={{ width: '100%', padding: '8px' }}
          />
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: 150, overflowY: 'auto', background: '#fff', border: '1px solid #eee', position: 'absolute', zIndex: 10, width: '100%' }}>
            {addressResults.map((r) => (
              <li
                key={r.place_id}
                style={{ cursor: 'pointer', padding: '4px' }}
                onClick={() => handleAddressSelect(r)}
              >
                {r.display_name}
              </li>
            ))}
          </ul>
        </div>
        {shippingAddress && (
          <div style={{ marginBottom: 16, color: 'green', fontSize: '0.95rem' }}>
            Selected: {shippingAddress}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4 }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  </>
);
}
