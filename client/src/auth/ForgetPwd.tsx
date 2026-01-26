import "./auth.css";

export default function ForgetPassword() {
  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-left">
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a verification code</p>

          <form className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <button className="auth-btn">Send Code</button>

            <p className="switch-text">
              Back to <span className="link">Login</span>
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
