// src/auth/VerifyCode.tsx
import "./auth.css";
import { verifyCode, resendOTP } from "../api/auth";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/authContext';

export default function VerifyCode() {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const { verificationToken } = location.state || {};
  
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // ✅ Redirect if no verification token
  if (!verificationToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-left">
            <h1>Invalid Access</h1>
            <p>Please sign up first to verify your email.</p>
            <button 
              className="auth-btn" 
              onClick={() => navigate("/signup")}
            >
              Go to Signup
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // digits only

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move forward only if digit entered
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      (nextInput as HTMLInputElement)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      (prevInput as HTMLInputElement)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const otpCode = otp.join("");
    
    // Validate OTP
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    
    setLoading(true);

    try {
      const response = await verifyCode(otpCode, verificationToken);
      
      if (response.accessToken && response.user) {
        login(response.accessToken, response.user);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification Failed");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      // Focus first input
      const firstInput = document.getElementById('otp-0');
      (firstInput as HTMLInputElement)?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendLoading(true);
    
    try {
      await resendOTP(verificationToken);
      setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
      alert("New OTP sent to your email");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Verify Code</h1>
          <p>Enter the 6-digit code sent to your email</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="otp-container">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={loading}
                />
              ))}
            </div>

            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>

            <p className="switch-text">
              Didn't receive code?{" "}
              <span 
                className="link" 
                onClick={handleResend}
                style={{ 
                  pointerEvents: resendLoading ? 'none' : 'auto',
                  opacity: resendLoading ? 0.5 : 1 
                }}
              >
                {resendLoading ? "Resending..." : "Resend"}
              </span>
            </p>
          </form>
        </div>

        <div className="auth-right">
          <img src="/verify.png" alt="Verify Code" />
        </div>
      </div>
    </div>
  );
}