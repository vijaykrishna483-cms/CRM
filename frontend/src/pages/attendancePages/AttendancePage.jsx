import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall.js"; // Your axios instance
import { FaSignInAlt, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa";
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

  // Authentication check
  if (!token) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold bg-red-100 rounded-md max-w-md mx-auto mt-20">
        Error: User not logged in
      </div>
    );
  }

  // Fetch daily records whenever month changes
  useEffect(() => {
    const fetchRecords = async () => {
      setRecordsLoading(true);
      setRecordsError("");
      try {
        // Convert YYYY-MM to YYYY-MM-01 for API
        const monthParam = `${month}-01`;
        const res = await api.get("/attendance/summary", {
          params: { month: monthParam },
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(res.data || []);
      } catch (err) {
        setRecordsError(
          err.response?.data?.message || "Failed to fetch records."
        );
      } finally {
        setRecordsLoading(false);
      }
    };
    fetchRecords();
  }, [month, token]);

  // Get GPS location
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
      setMessage(response.data.message || "Checked in successfully");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Check-in failed. Try again.";
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
      setMessage(response.data.message || "Checked out successfully");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Check-out failed. Try again.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Format time to show AM/PM
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
      <Navbar/> 
      <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-md">
          Employee Attendance
        </h1>

        {/* Check In/Out Buttons */}
        {loading ? (
          <div className="text-blue-700 font-semibold text-lg animate-pulse">
            Processing...
          </div>
        ) : (
          <div className="flex gap-6">
            <button
              className="flex items-center gap-3 px-8 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={handleCheckIn}
              disabled={loading}
            >
              <FaSignInAlt size={20} />
              Check In
            </button>
            <button
              className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={handleCheckOut}
              disabled={loading}
            >
              <FaSignOutAlt size={20} />
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
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
                      <div>
                        <span className="font-medium text-gray-500">Check In:</span>{" "}
                        <span className="text-black">
                          {formatTime(rec.check_in)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Check Out:</span>{" "}
                        <span className="text-black">
                          {formatTime(rec.check_out)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Status:</span>{" "}
                        {rec.is_valid ? (
                          <span className="text-green-600 font-semibold">verified</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Found Scam</span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Remarks:</span>{" "}
                        <span className="text-black">{rec.remarks || "-"}</span>
                      </div>
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
      <Footer/>
    </>
  );
};

export default AttendancePage;
