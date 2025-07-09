import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollegeMain from "./pages/collegePages";
import Index from "./pages/employeePages";
import Trainer from "./pages/trainerPages";
import Exam from "./pages/examPages/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import DocxForm from "./pages/pdfGenerators/Payslip";
import Toe from "./pages/pdfGenerators/Toe";
import Signup from "./pages/authPages/auth";
import Login from "./pages/authPages/login";
import PrivateRoute from "./components/privateRoute";
import Admin from "./pages/adminPanel/admin";
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from "react";
import ZipUploader from "./pages/pdfGenerators/TDS";
import Invoice from "./pages/pdfGenerators/invoice";
import Payslip from "./pages/pdfGenerators/Payslip";
import Tef from "./pages/pdfGenerators/Tef";


function App() {
  
useEffect(() => {

  AOS.init({ duration: 800, once: true });
}, []);


  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

     <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/employee" element={<Index />} />
  <Route path="/trainer" element={<Trainer />} />
  <Route path="/exam" element={<Exam />} />
  <Route path="/payslip" element={<Payslip />} />
  <Route path="/invoice" element={<Invoice />} />
  <Route path="/toe" element={<Toe />} />
  <Route path="/tef" element={<Tef />} />
  <Route path="/college" element={<CollegeMain />} />
  <Route path="/tds" element={<ZipUploader />} />
  <Route element={<PrivateRoute />}>
  <Route path="/register" element={<Signup />} />
  </Route>
  <Route element={<PrivateRoute />}>
  <Route path="/admin" element={<Admin />} />
  </Route>
  </Routes>

    </Router>
  );
}

export default App;
