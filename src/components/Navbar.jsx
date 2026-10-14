
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [location, setLocation] = useState("Detecting location...");
  const [loading, setLoading] = useState(true);

  const count = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

  useEffect(() => {
    let cancelled = false;

    const detectLocation = async () => {
      // Use the saved location only if it is not blank.
      const saved = localStorage.getItem("msmartLocation");

      if (saved && saved.trim()) {
        setLocation(saved);
        setLoading(false);
        return;
      }

      if (!navigator.geolocation) {
        setLocation("Chandigarh");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
            );

            if (!response.ok) {
              throw new Error("Location lookup failed");
            }

            const data = await response.json();
            const address = data.address || {};

            const city =
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              address.county ||
              address.state_district ||
              address.state ||
              "Chandigarh";

            const area =
              address.suburb ||
              address.neighbourhood ||
              address.residential ||
              address.quarter ||
              address.road ||
              "";

            const detectedLocation =
              area && area.toLowerCase() !== city.toLowerCase()
                ? `${area}, ${city}`
                : city;

            if (!cancelled) {
              setLocation(detectedLocation);
              localStorage.setItem("msmartLocation", detectedLocation);
            }
          } catch (error) {
            if (!cancelled) {
              setLocation("Chandigarh");
            }
          } finally {
            if (!cancelled) {
              setLoading(false);
            }
          }
        },
        () => {
          if (!cancelled) {
            setLocation("Chandigarh");
            setLoading(false);
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    };

    detectLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          <span className="logo-icon">🛒</span>
          <strong>MSMART</strong>
          <span className="logo-city">Chandigarh</span>
        </Link>
      </div>

      <div className="nav-center">
        <div className="delivery-info">
          <span className="delivery-label">
            ⚡ Delivery in 10 minutes
          </span>

          <span className="delivery-location" title={location}>
            📍 {loading ? "Detecting..." : location}
            <span className="location-arrow">▼</span>
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

        <Link to="/cart" className="cart-btn" aria-label={`Cart, ${count} items`}>
          <span className="cart-icon">🛒</span>

          {count > 0 && (
            <span className="cart-count">
              {count > 99 ? "99+" : count}
            </span>
          )}

          {count > 0 && (
            <span className="cart-total">₹{total.toFixed(0)}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}
