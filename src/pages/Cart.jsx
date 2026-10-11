import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkout = () => {
    if (!user) return navigate("/login");
    navigate("/checkout");
  };

  if (cart.length === 0)
    return (
      <div className="empty-page">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add products to get started</p>
        <button onClick={() => navigate("/")} className="shop-btn">
          Start Shopping
        </button>
      </div>
    );

  return (
    <div className="cart-page">
      <h2>🛒 Your Cart</h2>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.image || "https://via.placeholder.com/80"}
                alt=""
              />
              <div className="info">
                <h4>{item.name}</h4>
                <p className="unit">{item.unit}</p>
                <p className="price">
                  ₹{item.price} × {item.qty} ={" "}
                  <strong>₹{item.price * item.qty}</strong>
                </p>
              </div>
              <div className="qty-controls">
                <button onClick={() => updateQty(item._id, item.qty - 1)}>
                  −
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)}>
                  +
                </button>
              </div>
              <button
                className="remove"
                onClick={() => removeFromCart(item._id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Bill Details</h3>
          <div className="row">
            <span>Items Total</span>
            <span>₹{total}</span>
          </div>
          <div className="row">
            <span>Delivery Fee</span>
            <span className="free">FREE</span>
          </div>
          <div className="row total">
            <strong>To Pay</strong>
            <strong>₹{total}</strong>
          </div>
          <button className="checkout-btn" onClick={checkout}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}