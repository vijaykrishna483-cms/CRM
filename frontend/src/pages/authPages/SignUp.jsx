import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  HiUser,
  HiMail,
  HiLockClosed,
} from "react-icons/hi";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    vertical_id: "",
    position_id: "",
    employee_id: "",
  });

  const [verticals, setVerticals] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [designation, setDesignation] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/auth/vertical/getall")
      .then(res => setVerticals(res.data.data || []))
      .catch(() => setVerticals([]));

    api.get("/auth/position/getall")
      .then(res => setPositions(res.data.data || []))
      .catch(() => setPositions([]));
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee');
      setEmployeeData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleEmployeeSelect = (selectedOption) => {
    if (!selectedOption) {
        setForm({
            ...form,
            name: "",
            email: "",
            vertical_id: "",
            position_id: "",
            employee_id: "",
        });
        setDesignation("");
        setPosition("");
        return;
    }

    const emp = employeeData.find(emp => emp.employee_id === selectedOption.value);

    setForm((prev) => ({
        ...prev,
        name: emp?.employee_name || "",
        email: emp?.personal_email || "",
        vertical_id: emp?.designation || "",
        position_id: emp?.position || "",
        employee_id: emp?.employee_id || "",
    }));

    const verticalMatch = verticals.find(v => v.id === Number(emp?.designation));
    const positionMatch = positions.find(p => p.id === Number(emp?.position));

    setDesignation(verticalMatch?.name || "");
    setPosition(positionMatch?.name || "");
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      console.log(form)

      const res = await api.post("/auth/signup", form);
      if (res.data.status === "success") {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate('/login'), 1200);
        setForm({
          name: "",
          email: "",
          password: "",
          vertical_id: "",
          position_id: "",
          employee_id: "",
        });
        setDesignation("");
        setPosition("");
      } else {
        setMessage(res.data.message || "Signup failed");
      }
    } catch (err) {
      setMessage("Error signing up");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#e3e7f1] to-[#c9d6ff] px-4">
      <div className="w-full max-w-lg p-10 bg-white rounded-3xl shadow-xl border border-gray-200 transition-all">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-[#6a54a6]">Register New Employee</h1>
          <p className="text-gray-500 mt-2">Register a new employee and save their password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee ID Select */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Select Employee ID</label>
            <Select
              options={employeeData.map(emp => ({
                value: emp.employee_id,
                label: `${emp.employee_id} - ${emp.employee_name}`,
              }))}
              onChange={handleEmployeeSelect}
              placeholder="Search or select employee"
              className="basic-single"
              classNamePrefix="select"
              isClearable
            />
          </div>

          {/* Name */}
          <div className="relative">
            <HiUser className="absolute top-3 left-3 text-[#6a54a6]" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6a54a6] bg-gray-50"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <HiMail className="absolute top-3 left-3 text-[#6a54a6]" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6a54a6] bg-gray-50"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <HiLockClosed className="absolute top-3 left-3 text-[#6a54a6]" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6a54a6] bg-gray-50"
            />
          </div>

          {/* Display Designation and Position */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Designation (Vertical)</label>
              <div className="mt-1 p-3 rounded-xl border border-gray-300 bg-gray-100">{designation || "-"}</div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <div className="mt-1 p-3 rounded-xl border border-gray-300 bg-gray-100">{position || "-"}</div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6a54a6] to-[#6a54a6] text-white font-bold text-lg shadow-md hover:from-[#5a52e8] hover:to-[#6a4fe2] transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Message */}
          {message && (
            <div className={`text-center font-medium mt-2 ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
