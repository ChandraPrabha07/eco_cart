import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Address() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const { from } = router.query;

  // Search OpenStreetMap Nominatim API
  async function handleSearch(e) {
    e.preventDefault();
    setResults([]);
    setSaved(false);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setResults(data);
  }

  function handleSelect(place) {
    setSelected(place);
    setSaved(false);
  }

  function handleSave() {
    if (selected) {
      localStorage.setItem('default_address', JSON.stringify(selected));
      setSaved(true);
      // Redirect back to previous page or cart after a short delay
      setTimeout(() => {
        router.push(from || '/cart');
      }, 1000);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Set Default Address</h2>
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
        <div>
          <h4>Results:</h4>
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
        </div>
      )}
      {selected && (
        <div style={{ marginTop: 16 }}>
          <h4>Selected Address:</h4>
          <p>{selected.display_name}</p>
          <button onClick={handleSave}>Save as Default Address</button>
        </div>
      )}
      {saved && (
        <div style={{ color: 'green', marginTop: 12 }}>
          Default address saved! Redirecting...
        </div>
      )}
    </div>
  );
}

