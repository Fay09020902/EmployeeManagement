import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterWithToken from "./components/Register/RegisterForm"; // adjust path as needed
import SignIn from "./components/SignIn/SignIn";
import UpdatePassword from "./components/SignIn/UpdatePassword";
import ForgetPassword from "./components/SignIn/ForgotPassword";
import Layout from "./components/Layout";
import HRDashboard from "./components/HRDashboard/HRDashboard";

function App() {
  useEffect(() => {
    fetch('http://localhost:5000/api')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<div>Hello</div>} />
        <Route path="/register/:token" element={<RegisterWithToken />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/hr/dashboard' element={<HRDashboard />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path='/update-password/:token' element={<UpdatePassword />} />
        </Route>
      </Routes>
  );
}

export default App;
