import "./auth.css";
import { Link } from "react-router-dom";
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/auth";

export default function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try{
      await loginRequest(email, password);
      alert("Logged in Successfully")
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data.message || "Login Failed")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left */}
        <div className="auth-left">
          <h1>Login</h1>
          <p>Login to access your account</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p>{error}</p>}
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} placeholder="Enter your password" onChange={(e) => SetPassword(e.target.value)} />
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                Remember me
              </label>
              <span className="link">Forgot password?</span>
            </div>

            <button className="auth-btn">Login</button>

            <p className="switch-text">
              Don’t have an account?{" "}
              <span className="link">
                <Link to="/signup">Sign up </Link>
              </span>
            </p>
          </form>
        </div>

        {/* Right */}
        <div className="auth-right">
          <img src="/login.png" alt="Login" />
        </div>
      </div>
    </div>
  );
}
