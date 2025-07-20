import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall.js";
import usePageAccess from "../../components/useAccessPage.jsx";

// Helper to format time as "HH:MM AM/PM"
function formatTime(timeStr) {
  if (!timeStr) return "-";
  let date;
  if (timeStr.includes("T")) {
    date = new Date(timeStr);
  } else {
    date = new Date(`1970-01-01T${timeStr}Z`);
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

const MonthlyRecord = () => {
  const { allowed, loading: loadingg } = usePageAccess("attendanceUpdate");

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/attendance/month", {
          params: { month },
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [month, token]);

  // Utility to normalize string for search
  const normalize = (str) => (str || "").toLowerCase().trim();
  const searchLower = normalize(search);

  // Filter, then sort so search hits appear at the top,
  // then sort each group by most recent date.
  const sortedRecords = [...records]
    .filter(
      (rec) =>
        !searchLower ||
        normalize(rec.name).includes(searchLower) ||
        normalize(rec.employee_id).includes(searchLower)
    )
    .sort((a, b) => {
      if (searchLower) {
        const aMatch =
          normalize(a.name).includes(searchLower) ||
          normalize(a.employee_id).includes(searchLower);
        const bMatch =
          normalize(b.name).includes(searchLower) ||
          normalize(b.employee_id).includes(searchLower);
        if (aMatch !== bMatch) return aMatch ? -1 : 1;
      }
      return new Date(b.attendance_date) - new Date(a.attendance_date);
    });

  // Access denial UI
  if (!allowed && !loadingg)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center bg-white px-8 py-10 ">
          <svg
            className="w-14 h-14 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="#fee2e2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9l-6 6m0-6l6 6"
              stroke="red"
              strokeWidth="2"
            />
          </svg>
          <h2 className="text-2xl font-bold text-[#6750a4] mb-2">Access Denied</h2>
          <p className="text-gray-600 text-center mb-4">
            You do not have permission to view this page.
            <br />
            Please contact the administrator if you believe this is a mistake.
          </p>
          <button
            className="mt-2 px-5 py-2 rounded-lg bg-[#6750a4] text-white font-semibold hover:bg-[#01291f] transition"
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );

  if (loadingg) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-r from-blue-50 to-indigo-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Attendance Records</h2>
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-4xl">
        <label htmlFor="month" className="font-semibold text-gray-700">Select Month:</label>
        <input
          type="month"
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-1 text-gray-700 shadow-sm"
        />
        <input
          type="text"
          placeholder="Search by Name or Employee ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1 text-gray-700 shadow-sm w-64"
          style={{ minWidth: 200 }}
        />
      </div>
      {loading ? (
        <div className="text-blue-600 font-medium">Loading records...</div>
      ) : error ? (
        <div className="text-red-600 font-medium">{error}</div>
      ) : sortedRecords.length > 0 ? (
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="py-2 px-3 rounded-l-lg">Date</th>
                  <th className="py-2 px-3">Employee Name</th>
                  <th className="py-2 px-3">Employee ID</th>
                  <th className="py-2 px-3">Check In</th>
                  <th className="py-2 px-3">Lunch In</th>
                  <th className="py-2 px-3">Lunch Out</th>
                  <th className="py-2 px-3">Check Out</th>
                  <th className="py-2 px-3">Valid</th>
                  <th className="py-2 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className={`${
                      rec.is_valid
                        ? "bg-green-50 border-l-4 border-green-400"
                        : "bg-red-50 border-l-4 border-red-400"
                    } transition-all`}
                  >
                    <td className="py-2 px-3 font-semibold text-gray-800">
                      {new Date(rec.attendance_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2 px-3">{rec.name}</td>
                    <td className="py-2 px-3">{rec.employee_id}</td>
                    <td className="py-2 px-3">{formatTime(rec.check_in)}</td>
                    <td className="py-2 px-3">{formatTime(rec.lunch_in)}</td>
                    <td className="py-2 px-3">{formatTime(rec.lunch_out)}</td>
                    <td className="py-2 px-3">{formatTime(rec.check_out)}</td>
                    <td className="py-2 px-3 text-center">
                      {rec.is_valid ? (
                        <span className="text-green-600 font-semibold">✔</span>
                      ) : (
                        <span className="text-red-600 font-semibold">✖</span>
                      )}
                    </td>
                    <td className="py-2 px-3">{rec.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">No records found for this month.</div>
      )}
    </div>
  );
};

export default MonthlyRecord;
