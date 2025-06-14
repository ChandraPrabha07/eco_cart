import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Notification from '../components/Notification';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  // Address search state
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lon: '' });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const router = useRouter();

  // OpenStreetMap address search logic
  const searchAddress = async (q) => {
    if (!q) return setResults([]);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
    );
    const data = await res.json();
    setResults(data);
  };

  const handleAddressChange = (e) => {
    setQuery(e.target.value);
    searchAddress(e.target.value);
  };

  const handleAddressSelect = (place) => {
    setAddress(place.display_name);
    setCoordinates({ lat: place.lat, lon: place.lon });
    setQuery(place.display_name);
    setResults([]);
  };

  // Signup logic
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setNotification(error.message);
      setLoading(false);
      return;
    }

    setShowAddress(true);
    setNotification('Signup successful! Please enter your address.');
    setLoading(false);
  };

  // Save address to Supabase
  const handleSaveAddress = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        shipping_address: address,
        
      });
      if (profileError) {
        setNotification('Failed to save address.');
        setLoading(false);
        return;
      }
      setNotification('Address saved! Redirecting...');
      setTimeout(() => {
        router.push('/'); // or '/cart' if you prefer
      }, 1000);
    } else {
      setNotification('Please log in to save your address.');
    }
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
        {!showAddress ? (
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

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4 }}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <>
            <label>Address (powered by OpenStreetMap):</label>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Enter your address"
                value={query}
                onChange={handleAddressChange}
                style={{ width: '100%', padding: '8px' }}
              />
              <ul style={{ listStyle: 'none', padding: 0, maxHeight: 150, overflowY: 'auto', background: '#fff', border: '1px solid #eee', position: 'absolute', zIndex: 10, width: '100%' }}>
                {results.map((r) => (
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
            {address && (
              <div style={{ marginBottom: 16, color: 'green', fontSize: '0.95rem' }}>
                Selected: {address}
              </div>
            )}
            <button onClick={handleSaveAddress} disabled={loading || !address} style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
              {loading ? 'Saving...' : 'Save Address & Continue'}
            </button>
          </>
        )}
      </div>
    </>
  );
}
