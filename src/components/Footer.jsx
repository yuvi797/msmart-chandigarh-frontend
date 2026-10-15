import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="msmart-footer">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            🛒 <strong>MSMART</strong>
          </div>
          <p className="footer-tagline">
            Chandigarh's most trusted online grocery shop. Fresh products
            delivered in 10 minutes.
          </p>
          <div className="footer-badges">
            <span className="fbadge">⚡ 10 Min Delivery</span>
            <span className="fbadge">🥬 Farm Fresh</span>
          </div>
        </div>

        {/* Shop Info Column */}
        <div className="footer-col">
          <h4>🏪 Visit Our Shop</h4>
          <p className="footer-address">
            <strong>MSMART Chandigarh</strong>
            <br />
            Sector 48B, Burail
            <br />
            Chandigarh, 160047
            <br />
            India
          </p>
        </div>

        {/* Contact Column */}
        <div className="footer-col">
          <h4>📞 Contact Us</h4>
          <ul className="footer-contact">
            <li>
              <a href="mailto:msmartchandigarh@gmail.com">
                ✉️ msmartchandigarh@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
              >
                💬 WhatsApp Order
              </a>
            </li>
            <li>
              <a href="tel:+917973155164">📱 +91  7973155164</a>
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col">
          <h4>🔗 Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">My Cart</Link>
            </li>
            <li>
              <Link to="/orders">My Orders</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} <strong>MSMART Chandigarh</strong> —
          All rights reserved.
        </p>
        <p className="footer-credit">
          Made with ❤️ in Chandigarh | Sector 48B, Burail
        </p>
      </div>
    </footer>
  );
}