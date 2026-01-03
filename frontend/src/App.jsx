import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollegeMain from "./pages/collegePages";
import Index from "./pages/employeePages";
import Trainer from "./pages/trainerPages";
import Exam from "./pages/examPages/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Toe from "./pages/pdfGenerators/Toe";
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
import Signup from "./pages/authPages/SignUp";
import AttendancePage from "./pages/attendancePages/AttendancePage";
import AttendanceAdminPage from "./pages/attendancePages/AttendanceAdminPage";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";



const AdminRoute = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauth");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Number(payload.vertical_id) === 1) {
        setStatus("allowed");
      } else {
        setStatus("forbidden");
      }
    } catch {
      setStatus("unauth");
    }
  }, []);

  if (status === "loading") return null;

  if (status === "unauth") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};



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
   <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/hrUpdate" element={<AttendanceAdminPage />} />


 
  <Route element={<PrivateRoute />}>
  <Route path="/register" element={<Signup />} />
  </Route>


 <Route element={<AdminRoute />}>
    <Route path="/admin" element={<Admin />} />
  </Route>



  </Routes>

    </Router>
  );
}

export default App;
