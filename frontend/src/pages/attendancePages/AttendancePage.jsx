import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall.js";
import { FaSignInAlt, FaSignOutAlt, FaCalendarAlt, FaUtensils, FaCoffee } from "react-icons/fa";
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'

const AttendancePage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Daily Records States
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // Auth
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold bg-red-100 rounded-md max-w-md mx-auto mt-20">
        Error: User not logged in
      </div>
    );
  }
const fetchRecords = async () => {
  setRecordsLoading(true);
  setRecordsError("");

  try {
    const monthParam = `${month}-01`;
    const res = await api.get("/attendance/summary", {
      params: { month: monthParam },
      headers: { Authorization: `Bearer ${token}` },
    });
    setRecords(res.data || []);
  } catch (err) {
    setRecordsError(err.response?.data?.message || "Failed to fetch records.");
  } finally {
    setRecordsLoading(false);
  }
};

useEffect(() => {
  fetchRecords();
}, [month, token]);


  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (err) => {
            reject("Location access denied");
          },
          { timeout: 10000 }
        );
      }
    });
  };

  // Check In
  const handleCheckIn = async () => {
    setLoading(true);
    setMessage("Requesting location...");
    try {
      const coords = await getLocation();
      const response = await api.post(
        "/attendance/checkin",
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
 await fetchRecords();
       setMessage(response.data.message || "Checked in successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Check-in failed. Try again.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Check Out
  const handleCheckOut = async () => {
    setLoading(true);
    setMessage("Processing check-out...");
    try {
      const response = await api.post(
        "/attendance/checkout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       await fetchRecords();
      setMessage(response.data.message || "Checked out successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Check-out failed. Try again.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Lunch In
  const handleLunchIn = async () => {
    setLoading(true);
    setMessage("Marking lunch-in...");
    try {
      const response = await api.post(
        "/attendance/lunchin",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
 await fetchRecords();
       setMessage(response.data.message || "Lunch-in marked successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Lunch-in failed. Try again.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Lunch Out
  const handleLunchOut = async () => {
    setLoading(true);
    setMessage("Marking lunch-out...");
    try {
      const response = await api.post(
        "/attendance/lunchout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       await fetchRecords();
      setMessage(response.data.message || "Lunch-out marked successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Lunch-out failed. Try again.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    let date;
    if (timeStr.includes("T")) {
      date = new Date(timeStr);
    } else {
      date = new Date(`1970-01-01T${timeStr}Z`);
    }
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8 flex flex-col pt-30 items-center justify-center gap-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-md">Employee Attendance</h1>

        {/* Check In/Out + Lunch In/Out Buttons */}
        {loading ? (
          <div className="text-blue-700 font-semibold text-lg animate-pulse">Processing...</div>
        ) : (
        <div className="flex flex-wrap justify-center items-center gap-0 w-full max-w-2xl mx-auto bg-white rounded-lg shadow divide-x divide-gray-200 overflow-hidden">
  <button
    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white hover:bg-green-700 transition"
    onClick={handleCheckIn}
    disabled={loading}
  >
    <FaSignInAlt size={18} />
    Check In
  </button>
  <button
    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500 text-white hover:bg-yellow-600 transition"
    onClick={handleLunchIn}
    disabled={loading}
  >
    <FaUtensils size={18} />
    Lunch In
  </button>
  <button
    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-yellow-700 text-white hover:bg-yellow-800 transition"
    onClick={handleLunchOut}
    disabled={loading}
  >
    <FaCoffee size={18} />
    Lunch Out
  </button>
  <button
    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white hover:bg-blue-700 transition"
    onClick={handleCheckOut}
    disabled={loading}
  >
    <FaSignOutAlt size={18} />
    Check Out
  </button>
</div>

        )}

        {message && (
          <div className="mt-4 p-2 text-center text-sm bg-white border border-gray-300 rounded text-gray-700 max-w-md shadow">
            {message}
          </div>
        )}

        {/* Monthly Daily Records Section */}
        <div className="w-full max-w-3xl mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-500" />
              Monthly Records
            </h2>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded px-3 py-1 text-gray-700 shadow-sm"
            />
          </div>

          {recordsLoading ? (
            <div className="text-blue-600 font-medium">Loading records...</div>
          ) : recordsError ? (
            <div className="text-red-600 font-medium">{recordsError}</div>
          ) : records.length > 0 ? (
            <div className="flex flex-col gap-4">
              {records.map((rec) => {
                const dateObj = new Date(rec.attendance_date);
                const dateStr = dateObj.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const weekDay = dateObj.toLocaleDateString("en-GB", {
                  weekday: "long",
                });

                return (
                  <div
                    key={rec.id}
                    className={`${
                      rec.is_valid ? "bg-green-100" : "bg-red-100"
                    } rounded-xl shadow-md p-5 border-l-4 border-indigo-500 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="mb-4 sm:mb-0 mr-6">
                      <div className="text-2xl font-bold text-gray-800">{dateStr}</div>
                      <div className="text-sm text-gray-500">{weekDay}</div>
                    </div>
                 <div className="flex-1">
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
    <div>
      <dt className="font-medium text-gray-500">Check In:</dt>
      <dd className="text-black">{formatTime(rec.check_in)}</dd>
    </div>
    <div>
      <dt className="font-medium text-gray-500">Lunch In:</dt>
      <dd className="text-black">{formatTime(rec.lunch_in)}</dd>
    </div>
    <div>
      <dt className="font-medium text-gray-500">Lunch Out:</dt>
      <dd className="text-black">{formatTime(rec.lunch_out)}</dd>
    </div>
    <div>
      <dt className="font-medium text-gray-500">Check Out:</dt>
      <dd className="text-black">{formatTime(rec.check_out)}</dd>
    </div>
    <div>
      <dt className="font-medium text-gray-500">Status:</dt>
      <dd>
        {rec.is_valid ? (
          <span className="text-green-600 font-semibold">Verified</span>
        ) : (
          <span className="text-red-600 font-semibold">Found Scam</span>
        )}
      </dd>
    </div>
    <div>
      <dt className="font-medium text-gray-500">Remarks:</dt>
      <dd className="text-black">{rec.remarks || "-"}</dd>
    </div>
  </dl>
</div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-center">
              No records available for this month.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AttendancePage;
