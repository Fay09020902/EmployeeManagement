import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterWithToken from "./components/Register/RegisterForm"; // adjust path as needed
import SignIn
 from "./components/SignIn/SignIn";
function App() {
  useEffect(() => {
    fetch('http://localhost:5000/api')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
      <Routes>
        <Route path="/" element={<div>Hello</div>} />
        <Route path="/register" element={<RegisterWithToken />} />
        <Route path='/signin' element={<SignIn />} />
      </Routes>
  );
}

export default App;
