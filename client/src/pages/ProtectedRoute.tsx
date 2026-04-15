// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, authError} = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (authError) {
    return <div>
      {authError}
    </div>
  }


  // Redirect to login if not authenticated
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated - render children
  return <>{children}</>;
}
