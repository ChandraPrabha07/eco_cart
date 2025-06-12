import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem('sb-user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch orders for this user
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data }) => setOrders(data || []));
    }
  }, [user]);

  if (!user) return <p>Please <a href="/login">login</a> to view your orders.</p>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <strong>Order #{order.id}</strong> - {order.status} - {new Date(order.created_at).toLocaleString()}
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} x {item.quantity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
