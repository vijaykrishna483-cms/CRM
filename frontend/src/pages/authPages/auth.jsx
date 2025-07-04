import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall";
import { useNavigate } from "react-router-dom";
import { HiUser, HiMail, HiLockClosed, HiOfficeBuilding, HiBriefcase } from "react-icons/hi";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    vertical_id: "",
    position_id: "",
  });
  const [verticals, setVerticals] = useState([]);
  const [positions, setPositions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/auth/vertical/getall")
      .then(res => setVerticals(res.data.data || []))
      .catch(() => setVerticals([]));
    api.get("/auth/position/getall")
      .then(res => setPositions(res.data.data || []))
      .catch(() => setPositions([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/signup", form);
      if (res.data.status === "success") {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate('/login'), 1200);
        setForm({ name: "", email: "", password: "", vertical_id: "", position_id: "" });
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
          <p className="text-gray-500 mt-2">Register New employee and save their password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Vertical */}
          <div className="relative">
            <HiOfficeBuilding className="absolute top-3 left-3 text-[#6a54a6]" />
            <select
              name="vertical_id"
              value={form.vertical_id}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6a54a6] bg-gray-50"
            >
              <option value="">Select Vertical</option>
              {verticals.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Position */}
          <div className="relative">
            <HiBriefcase className="absolute top-3 left-3 text-[#6a54a6]" />
            <select
              name="position_id"
              value={form.position_id}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6a54a6] bg-gray-50"
            >
              <option value="">Select Position</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
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
