import { useEffect, useState } from "react";
import { getMe } from "../api/user";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "../api/auth";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try{
      const res = await logoutRequest();
      alert(res.message ||"Logged Out successfully");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data.message || "Logout Failed");
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch (err: any) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      <button onClick={handleLogout}>Logout</button>
      {error && <p>{error}</p>}
    </div>
  );
}
