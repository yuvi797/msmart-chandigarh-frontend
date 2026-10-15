import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );

      // Success - OTP page pe bhejo
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form onSubmit={submit} className="auth-form">
        <div className="auth-logo">⚡ MSMART</div>
        <h2>Forgot Password?</h2>
        <p className="auth-subtitle">
          Enter your registered email. We'll send you a 6-digit OTP.
        </p>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p>
          Remember password? <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}