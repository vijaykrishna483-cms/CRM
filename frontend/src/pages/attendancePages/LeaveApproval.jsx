import React, { useEffect, useState } from "react";
import api from "../../libs/apiCall.js";
import usePageAccess from "../../components/useAccessPage.jsx";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

const UPDATER_OPTIONS = [
  { value: "HR", label: "HR" },
  { value: "CEO", label: "CEO" },
  { value: "Manager", label: "Manager" },
  // Add more roles as needed
];

const THEME = "#6750a4";

const LeaveApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editFields, setEditFields] = useState({}); // { [id]: { status, comment, status_updater } }
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { allowed, loading: loadingg } = usePageAccess("attendanceUpdate");

  const token = localStorage.getItem("token");

  // Fetch all leave requests (admin/HR view)
  useEffect(() => {
    if (!token) return;
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/leave/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch leave requests."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  // Handle status, comment, or status_updater change in local state
  const handleFieldChange = (id, field, value) => {
    setEditFields((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Submit status/comment/status_updater update
  const handleUpdate = async (id) => {
    setUpdatingId(id);
    setMessage("");
    setError("");
    const { status, comment, status_updater } = editFields[id] || {};
    if (!status) {
      setError("Status is required.");
      setUpdatingId(null);
      return;
    }
    if (!status_updater) {
      setError("Status updater is required.");
      setUpdatingId(null);
      return;
    }
    try {
      const res = await api.patch(
        `/leave/update/${id}`,
        { status, comment, status_updater },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, ...res.data.leave_request } : req
        )
      );
      setMessage("Leave request updated.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update leave request."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter and search logic
  const filteredRequests = requests.filter((req) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      req.employee_id.toLowerCase().includes(search) ||
      req.reason.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


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
          <h2 className="text-2xl font-bold text-[#6750a4] mb-2">
            Access Denied
          </h2>
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
    <div className="max-w-4xl mx-auto p-4">
      <h2
        className="text-3xl font-extrabold mb-4 text-center drop-shadow"
        style={{ color: THEME }}
      >
        Leave Approvals
      </h2>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by Employee ID or Reason"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
        >
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div className="text-green-600 font-medium text-center mb-2">
          {message}
        </div>
      )}
      {error && (
        <div className="text-red-600 font-medium text-center mb-2">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-4 border border-[#ece6f6]">
        {loading ? (
          <div className="text-[#6750a4] font-medium text-center">Loading...</div>
        ) : filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{ background: "#f3e6f1" }}>
                  <th className="p-2 font-semibold text-[#6750a4]">Date</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Employee ID</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Reason</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Comment</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Status</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Status Updated By</th>
                  <th className="p-2 font-semibold text-[#6750a4]">Edit</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="text-center border-b last:border-0 hover:bg-[#f7f3fa] transition"
                  >
                    <td className="p-2">
                      {new Date(req.date_of_leave).toLocaleDateString()}
                    </td>
                    <td className="p-2">{req.employee_id}</td>
                    <td className="p-2">{req.reason}</td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-32"
                        value={
                          editFields[req.id]?.comment !== undefined
                            ? editFields[req.id].comment
                            : req.comment || ""
                        }
                        onChange={(e) =>
                          handleFieldChange(req.id, "comment", e.target.value)
                        }
                        placeholder="Add comment"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        className="border rounded px-2 py-1"
                        value={
                          editFields[req.id]?.status || req.status || "Pending"
                        }
                        onChange={(e) =>
                          handleFieldChange(req.id, "status", e.target.value)
                        }
                        style={{
                          color:
                            (editFields[req.id]?.status || req.status) ===
                            "Approved"
                              ? "green"
                              : (editFields[req.id]?.status || req.status) ===
                                "Rejected"
                              ? "red"
                              : THEME,
                        }}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-2">
                      <select
                        className="border rounded px-2 py-1"
                        value={
                          editFields[req.id]?.status_updater ||
                          req.status_updater ||
                          ""
                        }
                        onChange={(e) =>
                          handleFieldChange(req.id, "status_updater", e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select updater
                        </option>
                        {UPDATER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
               
                    <td className="p-2">
                      <button
                        onClick={() => handleUpdate(req.id)}
                        className="bg-[#6750a4] text-white px-3 py-1 rounded hover:bg-[#543b8c] transition"
                        disabled={updatingId === req.id}
                      >
                        {updatingId === req.id ? "Saving..." : "Save"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            No leave requests found.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApproval;
