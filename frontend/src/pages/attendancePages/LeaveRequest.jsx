import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall.js";

const THEME = "#6750a4";

const LeaveRequest = () => {
  const token = localStorage.getItem("token");

  const [date_of_leave, setDateOfLeave] = useState("");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch leave requests
  useEffect(() => {
    if (!token) return;
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/leave/byId", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch leave requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  // Add leave request
  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!date_of_leave || !reason) {
      setError("Date of leave and reason are required.");
      return;
    }
    try {
      const res = await api.post(
        "/leave/request",
        { date_of_leave, reason, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests([res.data.leave_request, ...requests]);
      setMessage("Leave request submitted.");
      setDateOfLeave("");
      setReason("");
      setComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request.");
    }
  };

  // Delete leave request
  const handleDelete = async (id) => {
    setMessage("");
    setError("");
    try {
      await api.delete(`/leave/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter((req) => req.id !== id));
      setMessage("Leave request deleted.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete leave request.");
    }
  };

  if (!token) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold bg-red-100 rounded-md max-w-md mx-auto mt-20">
        Error: User not logged in
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2
        className="text-3xl font-extrabold mb-4 text-center drop-shadow"
        style={{ color: THEME }}
      >
        Leave Request
      </h2>
      <form
        onSubmit={handleAdd}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col gap-5 border border-[#ece6f6]"
      >
        <div>
          <label className="block font-semibold mb-1 text-[#6750a4]">Date of Leave</label>
          <input
            type="date"
            value={date_of_leave}
            onChange={(e) => setDateOfLeave(e.target.value)}
            className="border border-[#d1c4e9] rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-[#6750a4]">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border border-[#d1c4e9] rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-[#6750a4]">Comment (optional)</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border border-[#d1c4e9] rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
          />
        </div>
        <button
          type="submit"
          className="bg-[#6750a4] text-white rounded-xl px-6 py-2 font-bold hover:bg-[#543b8c] transition shadow"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
        {message && <div className="text-green-600 font-medium">{message}</div>}
        {error && <div className="text-red-600 font-medium">{error}</div>}
      </form>

      <h3
        className="text-xl font-bold mb-3 text-center"
        style={{ color: THEME }}
      >
        Your Leave Requests
      </h3>
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-[#ece6f6]">
        {loading ? (
          <div className="text-[#6750a4] font-medium text-center">Loading...</div>
        ) : requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: "#f3e6f1" }}>
                  <th className="p-2 font-semibold text-[#6750a4]">Date</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Reason</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Comment</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Status</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Status Updated By</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="text-center border-b last:border-0 hover:bg-[#f7f3fa] transition"
                  >
                    <td className="p-2">{new Date(req.date_of_leave).toLocaleDateString()}</td>
                    <td className="p-2">{req.reason}</td>
                    <td className="p-2">{req.comment || "-"}</td>
                    <td className="p-2">
                      <span
                        className={
                          req.status === "Approved"
                            ? "text-green-600 font-bold"
                            : req.status === "Rejected"
                            ? "text-red-600 font-bold"
                            : "text-[#6750a4] font-bold"
                        }
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-2">{req.status_updater || "-"}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500 text-center">No leave requests found.</div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequest;
