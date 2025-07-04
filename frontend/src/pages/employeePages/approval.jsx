import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall";
import { toast } from "react-toastify";
import usePageAccess from "../../components/useAccessPage";

const Approval = () => {

  const { allowed, loading: permissionLoading } = usePageAccess("reimbursementapproval");


  const [reviewInfo, setReviewInfo] = useState({
    reimbursement_id: "",
    review_comment: "",
    reimbursement_amount: "",
    approved_by: "",
  });
  const [status, SetStatus] = useState("");
  const [reimbursements, setReimbursements] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch reimbursements
  const fetchReimbursements = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/getreimbursments");
      const reim=res.data.filter(item => item.status === "requested");
      setReimbursements(reim || []);
      
    } catch (err) {
      toast.error("Failed to fetch reimbursements");
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/getallreviews");
      setReviews(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch reimbursement reviews");
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee');
      setEmployeeData(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReimbursements();
    fetchReviews();
    fetchEmployees();
  }, []);

  // Map employee_id to employee_name for quick lookup
  const employeeNameMap = {};
  employeeData.forEach(emp => {
    employeeNameMap[emp.employee_id] = emp.employee_name; // Adjust field names as per your API
  });

  const handleChange = (e) => {
    setReviewInfo({ ...reviewInfo, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = async (reimbursement_id) => {
    setLoading(true);
    try {
      // Submit review data
      await api.post("/employee/addreview", {
        ...reviewInfo,
      });

      // Update reimbursement status
      await api.patch(`/employee/reimbursements/${reimbursement_id}/status`, {
        status,
      });

      toast.success("Review submitted successfully!");

      // Reset form
      setReviewInfo({
        reimbursement_id: "",
        review_comment: "",
        reimbursement_amount: "",
        approved_by: "",
      });

      // Reset status dropdown
      SetStatus("");

      await fetchReviews();
      await fetchReimbursements();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error submitting review");
    } finally {
      setLoading(false);
    }
  };
      if (!allowed && !permissionLoading) return (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="flex flex-col items-center bg-white px-8 py-10 ">
      <svg
        className="w-14 h-14 text-red-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2" />
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
        You do not have permission to view this page.<br />
        Please contact the administrator if you believe this is a mistake.
      </p>
      <button
        className="mt-2 px-5 py-2 rounded-lg bg-[#6750a4] text-white font-semibold hover:bg-[#01291f] transition"
        onClick={() => window.location.href = "/"}
      >
        Go to Home
      </button>
    </div>
  </div>
);
  if (permissionLoading) return <div>Loading...</div>;  

  
  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 ">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">
        Reimbursement Approval System
      </h1>

      <div className="flex flex-wrap gap-4 bg-transparent justify-center rounded-2xl px-4 py-2 mb-8">
        <button
          onClick={() => setOpen(true)}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
            ${
              open
                ? "bg-[#6750a4] text-white shadow font-semibold scale-105"
                : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"
            }
          `}
          style={{
            minWidth: "140px",
            boxShadow: open ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          Add Review
        </button>

        <button
          onClick={() => setOpen(false)}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
            ${
              open
                ? "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"
                : "bg-[#6750a4] text-white shadow font-semibold scale-105"
            }
          `}
          style={{
            minWidth: "140px",
            boxShadow: open ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          View Lists
        </button>
      </div>

      {open ? (
        <>
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">
              Submit Reimbursement Review
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reimbursement ID
                </label>
                <input
                  name="reimbursement_id"
                  placeholder="Reimbursement ID"
                  value={reviewInfo.reimbursement_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approved By
                </label>
                <input
                  name="approved_by"
                  placeholder="Approver Name"
                  value={reviewInfo.approved_by}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Comment
                </label>
                <textarea
                  name="review_comment"
                  placeholder="Add review comments..."
                  value={reviewInfo.review_comment}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reimbursement Amount (₹)
                </label>
                <input
                  type="number"
                  name="reimbursement_amount"
                  placeholder="Amount"
                  value={reviewInfo.reimbursement_amount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => SetStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select Status</option>
                  <option value="pending">pending</option>
                  <option value="rejected">rejected</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => handleSubmitReview(reviewInfo.reimbursement_id)}
              className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
          {/* Reviews Table */}
          <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#4f378a]">
                Reimbursement Reviews
              </h2>
              <button
                onClick={fetchReviews}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Refresh Reviews
              </button>
            </div>
            {loading ? (
              <p className="text-center py-4">Loading reviews...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="text-gray-600 bg-gray-100 border-b">
                    <tr>
                      <th className="p-2 text-left">Reimbursement ID</th>
                      <th className="p-2 text-left">Amount</th>
                      <th className="p-2 text-left">Approved By</th>
                      <th className="p-2 text-left">Comments</th>
                      <th className="p-2 text-left">Review Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr
                        key={review.id}
                        className="hover:bg-gray-50 border-t text-left"
                      >
                        <td className="p-2">{review.reimbursement_id}</td>
                        <td className="p-2">₹{review.reimbursement_amount}</td>
                        <td className="p-2">{review.approved_by}</td>
                        <td
                          className="p-2 max-w-xs truncate"
                          title={review.review_comment}
                        >
                          {review.review_comment}
                        </td>
                        <td className="p-2">
                          {review.created_at
                            ? new Date(review.created_at).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-2 text-center text-gray-400"
                        >
                          No reimbursement reviews found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-[#4f378a]">
                Reimbursement Entries
              </h3>
              <button
                onClick={fetchReimbursements}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Refresh
              </button>
            </div>
            {loading ? (
              <p className="text-center py-4">Loading reimbursements...</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead className="text-gray-600 bg-gray-100 border-b">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Employee ID</th>
                    <th className="p-2 text-left">Employee Name</th> {/* New column */}
                    <th className="p-2 text-left">Reimbursement ID</th>
                    <th className="p-2 text-left">Duration</th>
                    <th className="p-2 text-left">Location</th>
                    <th className="p-2 text-left">Program</th>
                    <th className="p-2 text-left">Word Link</th>
                    <th className="p-2 text-left">Excel Link</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reimbursements.map((reimb) => (
                    <tr
                      key={reimb.id}
                      className="hover:bg-gray-50 border-t text-left"
                    >
                      <td className="p-2">
                        {reimb.date
                          ? new Date(reimb.date).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="p-2">{reimb.employee_id}</td>
                      <td className="p-2">{employeeNameMap[reimb.employee_id] || "N/A"}</td>
                      <td className="p-2">{reimb.reimbursement_id}</td>
                      <td className="p-2">{reimb.duration} days</td>
                      <td className="p-2">{reimb.location}</td>
                      <td className="p-2">{reimb.program}</td>
                      <td className="p-2">
                        {reimb.word_link ? (
                          <a
                            href={reimb.word_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-xs"
                          >
                            View Word
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No document
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        {reimb.excel_link ? (
                          <a
                            href={reimb.excel_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-xs"
                          >
                            View Excel
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No document
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        {reimb.status === "requested" && (
                          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                            Requested
                          </span>
                        )}
                        {reimb.status === "pending" && (
                          <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                            Pending
                          </span>
                        )}
                        {reimb.status === "paid" && (
                          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                            Paid
                          </span>
                        )}
                        {reimb.status === "rejected" && (
                          <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reimbursements.length === 0 && (
                    <tr>
                      <td colSpan="10" className="p-2 text-center text-gray-400">
                        No reimbursements found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Approval;
