import "./auth.css";
import { verifyCode, resendOTP } from "../api/auth";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/authContext';

export default function VerifyCode() {

  const {setAccessToken} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const { verificationToken } = location.state || {};
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

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
    setLoading(true);

    try {
      const otpCode = otp.join(""); // Convert array to string
      const res = await verifyCode(otpCode, verificationToken); // Your API call
      if (res.accessToken) {
        setAccessToken(res.accessToken);
         navigate("/dashboard");
         alert("verification successful")
      }
    } catch (err: any) {
      setError(err.response?.data.message || "Verification Failed");
    } finally {
      setLoading(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendLoading(true);
    try {
      await resendOTP(verificationToken); // Your API call
      alert("OTP resent successfully");
    } catch (err: any) {
      setError(err.response?.data.message || "Failed to resend OTP");
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
                />
              ))}
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>

            <p className="switch-text">
              Didn’t receive code?{" "}
              <span className="link" onClick={handleResend}>
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
