import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginRequest } from "../api/auth";
import { useAuth } from "../context/authContext";
import PasswordField from "../components/ui/PasswordField";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginRequest(email, password);

      // ✅ Normal login (email verified)
      if (response.user && response.accessToken) {
        login(response.accessToken, response.user);
        navigate("/");
      }
    } catch (err: any) {
      // ✅ Check if email verification required
      if (err.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setShowVerificationMessage(true);

        // Redirect to verify page with token
        setTimeout(() => {
          navigate("/verify-code", {
            state: { verificationToken: err.response.data.verificationToken },
          });
        }, 2000);
        return;
      }

      // Regular error
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Login</h1>
          <p>Login to access your account</p>

          {showVerificationMessage && (
            <div
              style={{
                padding: "15px",
                background: "#fef3c7",
                border: "1px solid #fbbf24",
                borderRadius: "6px",
                marginBottom: "15px",
                color: "#92400e",
              }}
            >
              📧 Email not verified! We've sent you a new code. Redirecting...
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <PasswordField 
                label= "Password"
                state = {password}
                setState = {setPassword}
                placeholder="Enter your password"
              />
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="/forget-password" className="link">
                Forgot password?
              </Link>
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="switch-text">
              Don't have an account?{" "}
              <Link to="/signup" className="link">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <div className="auth-right">
          <img className="auth-img" src="/login-img.jpg" alt="Login" />
        </div>
      </div>
    </div>
  );
}
