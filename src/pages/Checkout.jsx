import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");
  const [orderId, setOrderId] = useState("");

  const upiId = import.meta.env.VITE_UPI_ID || "msmartchandigarh@upi";
  const shopName = import.meta.env.VITE_SHOP_NAME || "MSMART Chandigarh";
  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";

  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(shopName)}&am=${total}&cu=INR&tn=${encodeURIComponent(`Order ${orderId || "MSMART"}`)}`;

  const placeOrder = async () => {
    if (!address || !phone) {
      return alert("Please fill address and phone");
    }

    setLoading(true);
    try {
      const items = cart.map((c) => ({
        product: c._id,
        name: c.name,
        price: c.price,
        qty: c.qty,
      }));

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        { items, address, phone, totalAmount: total },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setOrderId(res.data._id);
      setStep("payment");
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
    setLoading(false);
  };

  const generateWhatsAppMessage = (paymentMethod) => {
    const productsText = cart
      .map((item) => `• ${item.name} × ${item.qty} = ₹${item.price * item.qty}`)
      .join("\n");

    return [
      "🛒 *NEW ORDER* 🛒",
      "",
      `*Order ID:* #${orderId ? orderId.slice(-6).toUpperCase() : "NEW"}`,
      "",
      "*--- ITEMS ---*",
      productsText || "No items",
      "",
      "*--- DETAILS ---*",
      `💰 *Total Amount:* ₹${total}`,
      `💳 *Payment Mode:* ${paymentMethod}`,
      "",
      "📍 *Delivery Address:*",
      address,
      "",
      `📞 *Phone:* ${phone}`,
      `👤 *Customer:* ${user?.name || "Customer"}`,
      "",
      "_Thank you for ordering from MSMART!_",
    ].join("\n");
  };

  const sendOnWhatsApp = (paymentMethod) => {
    const msg = generateWhatsAppMessage(paymentMethod);
    const encodedMessage = encodeURIComponent(msg);
    const whatsappNumber = waNumber.replace(/\D/g, "");
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank",
      "noopener,noreferrer"
    );
    clearCart();
    setTimeout(() => {
      alert("✅ Order placed!");
      navigate("/");
    }, 500);
  };

  const skipPayment = () => {
    sendOnWhatsApp("Cash on Delivery 💵");
  };

  if (step === "form") {
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
                <span>{c.name} × {c.qty}</span>
                <span>₹{c.price * c.qty}</span>
              </div>
            ))}
            <div className="row total">
              <strong>Total</strong>
              <strong>₹{total}</strong>
            </div>
            <button className="order-btn" onClick={placeOrder} disabled={loading}>
              {loading ? "Placing..." : "Proceed to Payment →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="payment-modal">
        <div className="payment-header">
          <span className="payment-icon">💳</span>
          <h2>Pay ₹{total}</h2>
          <p>Scan QR to pay via any UPI app</p>
        </div>

        <div className="qr-container">
          <QRCode value={upiLink} size={220} bgColor="#FFFFFF" fgColor="#1B5E20" level="H" />
        </div>

        <div className="upi-apps">
          <span>📱 Works with:</span>
          <div className="app-icons">
            <span>GPay</span>
            <span>PhonePe</span>
            <span>Paytm</span>
            <span>BHIM</span>
          </div>
        </div>

        <div className="payment-info">
          <div className="info-row">
            <span>UPI ID:</span>
            <strong>{upiId}</strong>
          </div>
          <div className="info-row">
            <span>Amount:</span>
            <strong>₹{total}</strong>
          </div>
        </div>

        <button className="whatsapp-btn" onClick={() => sendOnWhatsApp("UPI Paid ✅")}>
          ✅ Paid — Send Order on WhatsApp
        </button>

        <button className="cod-btn" onClick={skipPayment}>
          💵 Cash on Delivery (WhatsApp)
        </button>

        <button className="back-btn" onClick={() => setStep("form")}>
          ← Back to Checkout
        </button>
      </div>
    </div>
  );
}
