import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [location, setLocation] = useState("Detecting location...");
  const [loading, setLoading] = useState(true);

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    // Check if already saved
    const saved = localStorage.getItem("msmartLocation");
    if (saved) {
      setLocation(saved);
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setLocation("Location not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding using OpenStreetMap (free, no API key)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const addr = data.address;
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.state_district ||
            "Unknown";
          const area = addr.suburb || addr.neighbourhood || addr.road || "";
          const loc = area ? `${area}, ${city}` : city;

          setLocation(loc);
          localStorage.setItem("msmartLocation", loc);
        } catch (err) {
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }
        setLoading(false);
      },
      (error) => {
        // Fallback to Chandigarh if denied
        setLocation("Chandigarh");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          🛒 <strong>MSMART</strong> <span>Chandigarh</span>
        </Link>
      </div>

      <div className="nav-center">
        <div className="delivery-info">
          <span className="delivery-label">⚡ Delivery in 10 minutes</span>
          <span className="delivery-location">
            📍 {loading ? "Detecting..." : location} ▼
          </span>
        </div>
      </div>

      <div className="nav-right">
        {user?.role === "admin" && (
          <Link to="/admin" className="nav-btn admin-btn">
            👑 Admin
          </Link>
        )}
        {user && (
          <Link to="/orders" className="nav-btn">
            📦 Orders
          </Link>
        )}

        {user ? (
          <div className="user-menu">
            <span className="user-name">👤 {user.name}</span>
            <button
              className="logout-btn"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-btn login-btn">
            Login
          </Link>
        )}

        <Link to="/cart" className="cart-btn">
          🛒
          {count > 0 && (
            <>
              <span className="cart-count">{count}</span>
              <span className="cart-total">₹{total}</span>
            </>
          )}
        </Link>
      </div>
    </nav>
  );
}