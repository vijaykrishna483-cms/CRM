import React, { useEffect, useState } from "react";
import api from "../../libs/apiCall";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [roleAccess, setRoleAccess] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [positions, setPositions] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
  vertical_name: "",
  position_name: "",
  page_id: "",
});

  const [formMsg, setFormMsg] = useState("");

  const navigate = useNavigate();

  // Fetch verticals, positions, pages, and role access entries
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vertRes, posRes, pageRes, accessRes] = await Promise.all([
          api.get("/auth/vertical/getall"),
          api.get("/auth/position/getall"),
          api.get("/auth/page/getall"),
          api.get("/auth/access/getall"),
        ]);
        setVerticals(vertRes.data.data || []);
        setPositions(posRes.data.data || []);
        setPages(pageRes.data.data || []);
        setRoleAccess(accessRes.data.data || []);
        setError("");
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  setFormMsg("");
  try {
    // Map names to objects
    const vertical = verticals.find(v => v.name === form.vertical_name);
    const position = positions.find(p => p.name === form.position_name);

    const payload = {
      vertical_id: vertical?.id || "",
      position_id: position?.id || "",
      page_id: form.page_id,
    };

    const res = await api.post("/auth/access/add", payload);
    setFormMsg(res.data.message);

    // Refresh the list
    const updated = await api.get("/auth/access/getall");
    setRoleAccess(updated.data.data);

    // Reset form fields
    setForm({ vertical_name: "", position_name: "", page_id: "" });
  } catch (err) {
    setFormMsg(
      err.response?.data?.message || "Failed to add role access entry"
    );
  }
};


  const deleteRoleAccess = async (id) => {
    try {
      await api.delete(`/auth/access/delete/${id}`);
      // Refresh the list after deletion
      const updated = await api.get("/auth/access/getall");
      setRoleAccess(updated.data.data);
    } catch (err) {
      setFormMsg("Failed to delete role access entry");
      console.error("Failed to delete role access entry", err);
    }
  };

// Filtering logic based on form selection
const filteredRoleAccess = roleAccess.filter(entry => {
  const verticalMatch = form.vertical_name ? entry.vertical_name === form.vertical_name : true;
  const positionMatch = form.position_name ? entry.position_name === form.position_name : true;
  return verticalMatch && positionMatch;
});






  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e7f6f2] via-[#6750a4]/70 to-[#6750a4]/100 py-10 px-2">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#6750a4] text-white rounded-full p-3 shadow-md">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#6750a4] tracking-tight">
                Role Access Admin
              </h1>
              <p className="text-gray-600 text-base">
                Manage which roles and positions can access specific pages.
              </p>
            </div>
          </div>
        </div>

        {/* Register Employee Button */}
        <div className="flex justify-between mb-6 w-full ">
                  <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-[#fff] text-[#6750a4] px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#543c85] transition"
          >
            
            Go to Home
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 bg-[#6750a4] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#543c85] transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Employee
          </button>
        </div>

        {/* Add Role Access Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 shadow-xl rounded-2xl p-8 mb-10 border border-gray-200"
        >
          <h3 className="text-xl font-bold mb-6 text-[#6750a4] flex items-center gap-2">
            <svg
              className="w-6 h-6 text-[#6750a4]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Role Access
          </h3>
          <div className="flex flex-wrap gap-6 mb-4">
            {/* Vertical Select */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#6750a4]">
                Vertical
              </label>
             {/* Vertical Select */}
<select
  name="vertical_name"
  value={form.vertical_name}
  onChange={handleChange}
  required
  className="border rounded-lg px-3 py-2 w-48 focus:border-[#6750a4] focus:ring-2 focus:ring-[#6750a4] bg-gray-50"
>
  <option value="">Select Vertical</option>
  {verticals.map((v) => (
    <option key={v.id} value={v.name}>
      {v.name}
    </option>
  ))}
</select>

{/* Position Select */}

            </div>
            {/* Position Select */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#6750a4]">
                Position
              </label>
             <select
  name="position_name"
  value={form.position_name}
  onChange={handleChange}
  required
  className="border rounded-lg px-3 py-2 w-48 focus:border-[#6750a4] focus:ring-2 focus:ring-[#6750a4] bg-gray-50"
>
  <option value="">Select Position</option>
  {positions.map((p) => (
    <option key={p.id} value={p.name}>
      {p.name}
    </option>
  ))}
</select>

            </div>
            {/* Page Select */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#6750a4]">Page</label>
              <select
                name="page_id"
                value={form.page_id}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 w-48 focus:border-[#6750a4] focus:ring-2 focus:ring-[#6750a4] bg-gray-50"
              >
                <option value="">Select Page</option>
                {pages.map((pg) => (
                  <option key={pg.id} value={pg.id}>
                    {pg.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-[#6750a4] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#543c85] transition"
              >
                Add
              </button>
            </div>
          </div>
          {formMsg && (
            <div
              className={`text-sm mt-2 font-medium ${
                formMsg.toLowerCase().includes("fail")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {formMsg}
            </div>
          )}
        </form>

       
   


        {/* List of Role Access Entries */}
        <div className="bg-white/95 shadow-xl rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-[#6750a4]">
            All Role Access Entries
          </h3>
          {loading ? (
            <div className="flex items-center gap-2 text-[#6750a4]">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#6750a4"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="#6750a4"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span>Loading...</span>
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg text-sm">
                <thead className="bg-[#6750a4]/90 text-white">
                  <tr>
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Vertical</th>
                    <th className="py-2 px-4 border">Position</th>
                    <th className="py-2 px-4 border">Page</th>
                    <th className="py-2 px-4 border">Access To</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoleAccess.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-gray-500"
                      >
                        No entries found.
                      </td>
                    </tr>
                  ) : (
                    filteredRoleAccess.map((entry) => (
                      <tr key={entry.id} className="hover:bg-[#ede7f6] transition">
                        <td className="py-2 px-4 border">{entry.id}</td>
                        <td className="py-2 px-4 border">
                          {entry.vertical_name}
                        </td>
                        <td className="py-2 px-4 border">
                          {entry.position_name}
                        </td>
                        <td className="py-2 px-4 border">{entry.page_name}</td>
                        <td className="py-2 px-4 border">{entry.component}</td>
                        <td className="py-2 px-4 border text-center">
                          <button
                            onClick={() => deleteRoleAccess(entry.id)}
                            className="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded transition border border-red-100 bg-red-50 hover:bg-red-100"
                            title="Delete"
                          >
                            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
