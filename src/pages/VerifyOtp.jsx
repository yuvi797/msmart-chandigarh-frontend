import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Agar email nahi aaya toh forgot-password pe bhejo
  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  // 60 second countdown
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) return setError("OTP must be 6 digits");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        email,
        otp,
        newPassword,
      });

      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    setResending(true);
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, {
        email,
      });
      setTimer(60);
      alert("✅ New OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
    setResending(false);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-form success-box">
          <div className="success-icon">✅</div>
          <h2>Password Reset!</h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <form onSubmit={submit} className="auth-form">
        <div className="auth-logo">⚡ MSMART</div>
        <h2>Enter OTP</h2>
        <p className="auth-subtitle">
          OTP sent to <strong>{email}</strong>
        </p>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          maxLength="6"
          className="otp-input"
          required
        />

        <input
          type="password"
          placeholder="New Password (min 6 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Reset Password"}
        </button>

        <div className="resend-row">
          {timer > 0 ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button
              type="button"
              className="resend-btn"
              onClick={resendOtp}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        <p>
          <Link to="/forgot-password">← Use different email</Link>
        </p>
      </form>
    </div>
  );
}