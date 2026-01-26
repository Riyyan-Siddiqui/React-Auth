import "./auth.css";
import api from "axios";
import { signupRequest } from "../api/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactFormState } from "react-dom/client";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password do not match");
      return;
    }

    setLoading(true);

    try {
      await signupRequest(name, email, password);
      alert("Signed Up successfully");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data.message || "Failed to Sign Up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left */}
        <div className="auth-left">
          <h1>Create Account</h1>
          <p>Sign up to get started</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button className="auth-btn" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
            {error && <p>{error}</p>}

            <p className="switch-text">
              Already have an account? <span className="link">Login</span>
            </p>
          </form>
        </div>

        {/* Right */}
        <div className="auth-right">
          <img src="/signup.png" alt="Signup" />
        </div>
      </div>
    </div>
  );
}
