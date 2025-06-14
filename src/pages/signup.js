import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Notification from '../components/Notification';

function AddressInput({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchAddress = async (q) => {
    if (!q) return setResults([]);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
    );
    const data = await res.json();
    setResults(data);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    searchAddress(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your address"
        value={query}
        onChange={handleChange}
        style={{ width: '100%', padding: '8px' }}
      />
      <ul style={{ listStyle: 'none', padding: 0, maxHeight: 150, overflowY: 'auto', background: '#fff', border: '1px solid #eee', position: 'absolute', zIndex: 10, width: '100%' }}>
        {results.map((r) => (
          <li
            key={r.place_id}
            style={{ cursor: 'pointer', padding: '4px' }}
            onClick={() => {
              onSelect(r);
              setQuery(r.display_name);
              setResults([]);
            }}
          >
            {r.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lon: '' });
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddressSelect = (place) => {
    setAddress(place.display_name);
    setCoordinates({ lat: place.lat, lon: place.lon });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setNotification(error.message);
      setLoading(false);
      return;
    }

    // 2. Save address to profiles table (if you want to wait for email confirmation, you can do this later)
    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        default_address: address,
        latitude: coordinates.lat,
        longitude: coordinates.lon,
      });
      if (profileError) {
        setNotification('Signup succeeded, but failed to save address.');
        setLoading(false);
        return;
      }
    }

    setNotification('Signup successful! Please check your email to confirm your account.');
    setLoading(false);
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Sign Up - Eco Cart</title>
      </Head>
      <Notification message={notification} onClose={() => setNotification('')} />

      <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fafafa', borderRadius: 8 }}>
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <label>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: 16 }}
          />

          <label>Password:</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: 16 }}
          />

          <label>Address (powered by OpenStreetMap):</label>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <AddressInput onSelect={handleAddressSelect} />
          </div>
          {address && (
            <div style={{ marginBottom: 16, color: 'green', fontSize: '0.95rem' }}>
              Selected: {address}
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
