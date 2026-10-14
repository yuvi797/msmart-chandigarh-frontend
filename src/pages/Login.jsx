import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError(
      "Google sign-in is not configured yet. Please use email and password."
    );
  };

  return (
    <main className="auth-page">
      <div className="auth-layout">

        {/* Left: Grocery visual */}
        <section className="auth-visual">
          <img
            className="auth-grocery-image"
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85"
            alt="Fresh vegetables and groceries"
          />

          <div className="auth-visual-overlay" />

          <div className="auth-visual-content">
            <div className="auth-visual-brand">
              <span className="auth-visual-logo">MS</span>
              <span>MSmart Chandigarh</span>
            </div>

            <div className="auth-visual-copy">
              <span className="auth-eyebrow">
                FRESHNESS AT YOUR DOORSTEP
              </span>

              <h2>
                Fresh groceries.
                <br />
                Better everyday.
              </h2>

              <p>
                Your everyday essentials, fresh picks and
                favourite groceries — all in one place.
              </p>

              <div className="auth-benefits">
                <div className="auth-benefit">
                  <span className="auth-benefit-dot" />
                  Fresh products for your home
                </div>

                <div className="auth-benefit">
                  <span className="auth-benefit-dot" />
                  Convenient online shopping
                </div>

                <div className="auth-benefit">
                  <span className="auth-benefit-dot" />
                  Simple and secure checkout
                </div>
              </div>
            </div>

            <p className="auth-visual-footer">
              Your neighbourhood grocery store, online.
            </p>
          </div>
        </section>

        {/* Right: Login form */}
        <section className="auth-form-panel">
          <div className="auth-card">

            <div className="auth-brand">
              <div className="auth-logo-icon">MS</div>

              <div>
                <h1>MSmart</h1>
                <span>Fresh groceries. Fast delivery.</span>
              </div>
            </div>

            <div className="auth-heading">
              <h2>Welcome</h2>
              <p>Sign in to continue shopping with MSmart</p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="button"
              className="google-button"
              onClick={handleGoogleLogin}
            >
              <svg
                className="google-icon"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.56 13.22l7.98 6.19C13.43 13.72 18.27 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.96 46.98 31.77 46.98 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M11.54 28.59A14.4 14.4 0 0 1 10.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 1 24c0 3.87.93 7.52 2.56 10.78l7.98-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-5.73 0-10.57-4.22-12.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>

              Continue with Google
            </button>

            <div className="auth-divider">
              <span>OR CONTINUE WITH EMAIL</span>
            </div>

            <form onSubmit={submit}>
              <div className="input-group">
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <div className="password-header">
                  <label htmlFor="password">Password</label>

                  <Link to="/forgot-password">
                    Forgot password?
                  </Link>
                </div>

                <div className="password-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="remember-row">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="auth-register">
              Don't have an account?{" "}
              <Link to="/register">Create account</Link>
            </p>

            <div className="auth-support">
              Need help?{" "}
              <a href="mailto:msmartchandigarh@gmail.com">
                msmartchandigarh@gmail.com
              </a>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
