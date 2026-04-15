import "./auth.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";



export default function ForgetPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try{
      await api.post("/auth/forget-password",
        {
          email: email
        }
      );
      setSuccess(true);
    } catch(err: any){
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (success){
     return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-left">
            <h1>Check Your Email</h1>
            <p>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
              The link will expire in 1 hour. If you don't see the email, check your spam folder.
            </p>
            <Link to="/login" className="link" style={{ marginTop: "20px", display: "block" }}>
              Back to Login
            </Link>
          </div>
          <div className="auth-right">
            <img src="/email-sent.png" alt="Email Sent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-left">
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a verification code</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required disabled={loading}/>
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {error && <p>{error}</p>}

            <p className="switch-text">
              Back to <Link to="/login" className="link">
                Login
              </Link>
            </p>
          </form>
        </div>

        <div className="auth-right">
          <img src="/forgot.png" alt="Forgot Password" />
        </div>

      </div>
    </div>
  );
}
