import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgetPassword from "./auth/ForgetPwd";
import SetPassword from "./auth/SetPwd";
import VerifyCode from "./auth/VerfiyCode";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <main className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<h1>No Path Found</h1>} />
      </Routes>
    </main>
  );
};

export default App;
