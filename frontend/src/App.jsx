import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CollegeMain from './pages/collegePages';
import Index from './pages/employeePages';
import Trainer from './pages/trainerPages';
import Exam from './pages/examPages/index';

// ✅ Import ToastContainer and CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      {/* ✅ ToastContainer should be at the root level */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/college" element={<CollegeMain />} />
        <Route path="/employee" element={<Index />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
