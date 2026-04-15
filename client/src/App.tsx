import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgetPassword from "./auth/ForgetPwd";
import SetPassword from "./auth/SetPwd";
import VerifyCode from "./auth/VerfiyCode";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  return (
    <main className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<SetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h1>No Path Found</h1>} />
      </Routes>
    </main>
  );
};

export default App;
