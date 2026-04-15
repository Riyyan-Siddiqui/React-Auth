// src/context/authContext.tsx
import { createContext, useContext, useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setAccessToken } from "../api/tokenService";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  login: (accessToken: string, userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true); 
  const initialized = useRef(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated on app load
  useEffect(() => {

    if (initialized.current) return; //for skipping duplicate call
    initialized.current = true;
    const initAuth = async () => {
      try {
        // Try to refresh token (refreshToken is in httpOnly cookie)
        console.log('🔄 Trying to refresh...');
        const refreshRes = await api.post("/auth/refresh");
        console.log('✅ Refresh response:', refreshRes.data);
        
        // Store the new access token
        if (refreshRes.data.accessToken) {
          setAccessToken(refreshRes.data.accessToken);
           console.log('✅ Token stored');
          
          // Get user data
          const userRes = await api.get("/auth/me");
          console.log('✅ User fetched:', userRes.data.user);
          setUser(userRes.data.user);
        }
      } catch (error: any) {
        // No valid session - user stays null

         if (error.response?.status === 429) {
          console.log("Rate limited during initAuth - keeping session");
          setAuthError("Too many requests. Try again in 1 min")
          return;
        }
        console.log("No active session");
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ✅ Listen for logout events from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setAccessToken(null);
      navigate("/login");
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [navigate]);

  // Login function - called after successful login/verification
  const login = (accessToken: string, userData: User) => {
    setAccessToken(accessToken);
    setUser(userData);
  };

  // Logout function
  const logout = async () => {
    try {
      // Call backend to clear refresh token cookie
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear frontend state regardless of backend response
      setAccessToken(null);
      setUser(null);
      navigate("/login");
    }
  };

  // Update user data (for profile updates, etc.)
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

//  Named export for the custom hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}