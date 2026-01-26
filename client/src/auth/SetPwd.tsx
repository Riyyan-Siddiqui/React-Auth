
import "./auth.css";

export default function SetPassword() {
  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-left">
          <h1>Set New Password</h1>
          <p>Create a strong new password</p>

          <form className="auth-form">
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="New password" />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm password" />
            </div>

            <button className="auth-btn">Update Password</button>

            <p className="switch-text">
              Back to <span className="link">Login</span>
            </p>
          </form>
        </div>

        <div className="auth-right">
          <img src="/reset.png" alt="Set Password" />
        </div>

      </div>
    </div>
  );
}
