import React, { useState, useEffect } from "react";
import api, { setAuthToken } from "../../libs/apiCall";
import { useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/signin", form);
      if (res.data.status === "success") {
        setMessage("Login successful!");
        const token = res.data.data.token;
        localStorage.setItem("token", token);
        setAuthToken(token);

        // Redirect based on role
        if (form.email === "manager@gmail.com") {
          navigate("/admin");
        } else {
          navigate("/"); // Or navigate("/dashboard") if needed
        }
      } else {
        setMessage(res.data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Error logging in");
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3f4f6] via-[#dce2f0] to-[#c5cae9] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#3f51b5]">Login</h2>
          <p className="text-sm text-gray-500">Access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <HiMail className="absolute top-3 left-3 text-blue-500 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <HiLockClosed className="absolute top-3 left-3 text-green-500 text-lg" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6a54a6] to-[#6a54a6] text-white font-semibold hover:from-[#6a54a6] hover:to-[#693fff] transition transform hover:scale-105"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <div
              className={`text-center font-medium mt-2 ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
