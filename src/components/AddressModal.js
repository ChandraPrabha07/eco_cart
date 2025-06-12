import { useState } from 'react';

export default function AddressModal({ open, onClose, onSuccess }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  if (!open) return null;

  async function handleSearch(e) {
    e.preventDefault();
    setResults([]);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setResults(data);
  }

  function handleSelect(place) {
    setSelected(place);
  }

  function handleSave() {
    if (selected) {
      localStorage.setItem('default_address', JSON.stringify(selected));
      onSuccess();
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Select Shipping Address</h2>
        <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by place name, address, or pincode"
            style={{ width: '70%', marginRight: 8 }}
          />
          <button type="submit">Search</button>
        </form>
        {results.length > 0 && (
          <ul>
            {results.map(place => (
              <li key={place.place_id} style={{ marginBottom: 6 }}>
                <button onClick={() => handleSelect(place)} style={{ marginRight: 8 }}>
                  Select
                </button>
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
        {selected && (
          <div style={{ marginTop: 16 }}>
            <h4>Selected Address:</h4>
            <p>{selected.display_name}</p>
            <button onClick={handleSave}>Save as Default Address</button>
          </div>
        )}
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
        input { display: inline-block; margin-bottom: 10px; padding: 8px; }
      `}</style>
    </div>
  );
}
