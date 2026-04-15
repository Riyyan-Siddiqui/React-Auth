// src/pages/Dashboard.tsx
import { useAuth } from "../context/authContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '20px'
        }}>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginTop: 0 }}>Welcome, {user?.name}! 🎉</h2>
          <div style={{ lineHeight: '1.8' }}>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>User ID:</strong> {user?.id}</p>
            {user?.role && <p><strong>Role:</strong> {user.role}</p>}
          </div>
        </div>

        <div style={{
          background: '#ecfdf5',
          border: '1px solid #10b981',
          padding: '15px',
          borderRadius: '6px',
          color: '#065f46'
        }}>
          <p style={{ margin: 0 }}>
            ✅ Your authentication is working correctly!
          </p>
          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
            <li>Access token is stored in memory</li>
            <li>Refresh token is in httpOnly cookie</li>
            <li>Protected route is working</li>
            <li>User session persists on page refresh</li>
          </ul>
        </div>
      </div>
    </div>
  );
}