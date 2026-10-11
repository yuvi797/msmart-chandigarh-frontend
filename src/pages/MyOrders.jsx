import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;

  if (orders.length === 0)
    return (
      <div className="empty-page">
        <div className="empty-icon">📦</div>
        <h2>No orders yet</h2>
        <p>Start shopping to place your first order</p>
      </div>
    );

  return (
    <div className="orders-page">
      <h2>📦 My Orders</h2>
      {orders.map((o) => (
        <div key={o._id} className="order-card">
          <div className="order-head">
            <span className="order-id">Order #{o._id.slice(-6).toUpperCase()}</span>
            <span className={`status ${o.status}`}>{o.status}</span>
          </div>
          <div className="order-items">
            {o.items.map((it, i) => (
              <div key={i} className="order-item">
                <span>
                  {it.name} × {it.qty}
                </span>
                <span>₹{it.price * it.qty}</span>
              </div>
            ))}
          </div>
          <div className="order-foot">
            <span>📍 {o.address}</span>
            <span className="order-total">Total: ₹{o.totalAmount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}