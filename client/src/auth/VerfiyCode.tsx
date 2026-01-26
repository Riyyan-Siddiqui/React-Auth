import "./auth.css";

export default function VerifyCode() {
  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-left">
          <h1>Verify Code</h1>
          <p>Enter the 6-digit code sent to your email</p>

          <form className="auth-form">

            <div className="otp-container">
              <input maxLength={1} />
              <input maxLength={1} />
              <input maxLength={1} />
              <input maxLength={1} />
              <input maxLength={1} />
              <input maxLength={1} />
            </div>

            <button className="auth-btn">Verify</button>

            <p className="switch-text">
              Didn’t receive code? <span className="link">Resend</span>
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
