import "./auth.css";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import PasswordField from "../components/ui/PasswordField";

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Password do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        confirmPassword,
        newPassword,
      });

      alert("Password reset successful! Please login with your new password.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Set New Password</h1>
          <p>Create a strong new password</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <PasswordField
                label="New Password"
                state={newPassword}
                setState={setNewPassword}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <PasswordField
                label="Confirm Password"
                state={confirmPassword}
                setState={setConfirmPassword}
                disabled={loading}
              />
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="switch-text">
              Remember your password?{" "}
              <Link to="/login" className="link">
                Login
              </Link>
            </p>
          </form>
          {error && <p>{error}</p>}
        </div>

        <div className="auth-right">
          <img className="auth-img" src="/set-pwd-img.jpg" alt="Set Password" />
        </div>
      </div>
    </div>
  );
}
