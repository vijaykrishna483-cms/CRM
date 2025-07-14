import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall.js";
import usePageAccess from "../../components/useAccessPage.jsx";

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

const DailyRecords = () => {

  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState(""); // <-- search state

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      setMessage("");
      try {
        const res = await api.get("/attendance/", {
          params: { date },
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
  }, [date, token]);

  const handleValidityChange = (id, isValid) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, is_valid: isValid } : rec))
    );
  };

  const handleRemarksChange = (id, remarks) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, remarks } : rec))
    );
  };

  const handleUpdate = async (id) => {
    const record = records.find((rec) => rec.id === id);
    if (!record) return;
    setMessage("");
    try {
      await api.patch(
        `/attendance/${id}`,
        { is_valid: record.is_valid, remarks: record.remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Record updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update record.");
    }
  };

  if (!token) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold bg-red-100 rounded-md max-w-md mx-auto mt-20">
        Error: User not logged in
      </div>
    );
  }

 

  // Filter records by employee name or employee id (case-insensitive)
  const filteredRecords = records.filter((rec) => {
    const searchLower = search.toLowerCase();
    return (
      rec.name?.toLowerCase().includes(searchLower) ||
      String(rec.employee_id || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <>
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
          <label htmlFor="date" className="font-semibold text-gray-700">Select Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-1 text-gray-700 shadow-sm"
          />

          {/* Search Bar */}
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
        ) : filteredRecords.length > 0 ? (
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="py-2 px-3 rounded-l-lg">Employee Name</th>
                    <th className="py-2 px-3">Employee ID</th>
                    <th className="py-2 px-3">Check In</th>
                    <th className="py-2 px-3">Check Out</th>
                    <th className="py-2 px-3">Valid</th>
                    <th className="py-2 px-3">Remarks</th>
                    <th className="py-2 px-3 rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec) => (
                    <tr
                      key={rec.id}
                      className={`${
                        rec.is_valid
                          ? "bg-green-50 border-l-4 border-green-400"
                          : "bg-red-50 border-l-4 border-red-400"
                      } transition-all`}
                    >
                      <td className="py-2 px-3 font-semibold text-gray-800">{rec.name}</td>
                      <td className="py-2 px-3">{rec.employee_id}</td>
                      <td className="py-2 px-3">{formatTime(rec.check_in)}</td>
                      <td className="py-2 px-3">{formatTime(rec.check_out)}</td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={rec.is_valid}
                          onChange={(e) => handleValidityChange(rec.id, e.target.checked)}
                          className="accent-green-600 w-5 h-5"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={rec.remarks || ""}
                          onChange={(e) => handleRemarksChange(rec.id, e.target.value)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleUpdate(rec.id)}
                          className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 transition font-semibold shadow"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No records found for this date.</div>
        )}
        {message && (
          <div className="mt-4 p-2 text-center text-sm bg-white border border-gray-300 rounded text-gray-700 max-w-md shadow">
            {message}
          </div>
        )}
      </>
    </div>
  );
};

export default DailyRecords;
