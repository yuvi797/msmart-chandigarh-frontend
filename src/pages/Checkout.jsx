import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!address || !phone) return alert("Please fill address and phone");

    setLoading(true);
    try {
      const items = cart.map((c) => ({
        product: c._id,
        name: c.name,
        price: c.price,
        qty: c.qty,
      }));

      await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        { items, address, phone, totalAmount: total },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const msg = `🛒 *New Order - MSmart Chandigarh*%0A%0A${cart
        .map((c) => `• ${c.name} × ${c.qty} = ₹${c.price * c.qty}`)
        .join("%0A")}%0A%0A*Total: ₹${total}*%0A%0A📍 ${address}%0A📞 ${phone}%0A%0A👤 ${user.name}`;

      window.open(
        `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${msg}`,
        "_blank"
      );

      clearCart();
      alert("✅ Order placed successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <h2>📦 Checkout</h2>
      <div className="checkout-layout">
        <div className="checkout-form">
          <h3>Delivery Details</h3>
          <label>Delivery Address</label>
          <textarea
            placeholder="Flat, Building, Street, Area, Chandigarh"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
          />
          <label>Phone Number</label>
          <input
            placeholder="10 digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map((c) => (
            <div key={c._id} className="row">
              <span>
                {c.name} × {c.qty}
              </span>
              <span>₹{c.price * c.qty}</span>
            </div>
          ))}
          <div className="row total">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>
          <button
            className="order-btn"
            onClick={placeOrder}
            disabled={loading}
          >
            {loading ? "Placing..." : "Place Order via WhatsApp 📱"}
          </button>
        </div>
      </div>
    </div>
  );
}