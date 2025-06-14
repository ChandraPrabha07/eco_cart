import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Notification from '../components/Notification';

export default function AddressPage() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch current address
    const fetchAddress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('shipping_address')
          .eq('id', user.id)
          .single();
        setShippingAddress(profile?.shipping_address || '');
        setAddressQuery(profile?.shipping_address || '');
      }
    };
    fetchAddress();
  }, []);

  // Debounced address search
  const handleAddressInput = (e) => {
    const value = e.target.value;
    setAddressQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAddress(value);
    }, 700); // 700ms debounce to respect Nominatim policy[1]
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

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        shipping_address: shippingAddress,
      });
      if (error) {
        setNotification('Failed to update address.');
      } else {
        setNotification('Address updated!');
        setTimeout(() => router.push('/cart'), 1000);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#f6f7f9', borderRadius: 8 }}>
      <h1>Update Shipping Address</h1>
      <Notification message={notification} onClose={() => setNotification('')} />
      <label>Shipping Address (powered by OpenStreetMap):</label>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input
          type="text"
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
      <button onClick={handleSave} disabled={loading || !shippingAddress} style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4 }}>
        {loading ? 'Saving...' : 'Save Address'}
      </button>
    </div>
  );
}
