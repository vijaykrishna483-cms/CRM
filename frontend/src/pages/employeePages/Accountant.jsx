import React, { useEffect, useState } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
import usePageAccess from '../../components/useAccessPage';

const Accountant = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("accountantpage");

  const [reimbursements, setReimbursements] = useState([]);
  const [reimbursementss, setReimbursementss] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchReimbursements();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee/getallreviews');
      setReimbursements(res.data);
    } catch (err) {
      toast.error('Failed to fetch reimbursement reviews');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReimbursements = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/getreimbursments");
      setReimbursementss(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch reimbursements");
    } finally {
      setLoading(false);
    }
  };

  const statusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/employee/reimbursements/${id}/status`, { status: newStatus });
      toast.success('Status Updated');
      fetchReviews();
      fetchReimbursements();
    } catch (err) {
      toast.error('Error updating status');
      console.error('Error:', err);
    }
  };

  // Map reimbursement_id to status
  const statusMap = {};
  reimbursementss.forEach(item => {
    statusMap[item.reimbursement_id] = item.status;
  });

  // Helper to get color classes for select based on status
  const getStatusSelectClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300';
      case 'paid':
        return 'bg-green-50 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-50 text-red-800 border-red-300';
      default:
        return 'bg-white text-gray-700 border-gray-300';
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
        Reimbursement Management
      </h1>

      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#4f378a]">
            Reimbursement Reviews
          </h2>
          <button 
            onClick={() => {
              fetchReviews();
              fetchReimbursements();
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
        
        <div className="overflow-x-auto rounded-lg border text-left">
         <table className="min-w-full text-sm border-collapse border border-gray-300">
  <thead className="bg-gray-100 text-left text-gray-600">
    <tr>
      <th className="p-3 border border-gray-300">Reimb ID</th>
      {/* <th className="p-3 border border-gray-300">Employee ID</th> */}
      <th className="p-3 border border-gray-300">Amount</th>
      <th className="p-3 border border-gray-300">Approved By</th>
      <th className="p-3 border border-gray-300">Comment</th>
      <th className="p-3 border border-gray-300">Review Date</th>
      <th className="p-3 border border-gray-300">Status</th>
    </tr>
  </thead>
  <tbody>
    {reimbursements.map((row) => {
      const currentStatus = statusMap[row.reimbursement_id] || '';
      return (
        <tr key={row.id} className="border-t hover:bg-gray-50">
          <td className="p-3 border border-gray-300">{row.reimbursement_id}</td>
          <td className="p-3 border border-gray-300">₹{row.reimbursement_amount}</td>
          <td className="p-3 border border-gray-300">{row.approved_by}</td>
          <td className="p-3 max-w-xs border border-gray-300">{row.review_comment}</td>
          <td className="p-3 border border-gray-300">
            {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}
          </td>
          <td className="p-3 border border-gray-300">
            <select
              name="status"
              value={currentStatus}
              onChange={(e) => {
                const newStatus = e.target.value;
                statusUpdate(row.reimbursement_id, newStatus);
              }}
              className={`border rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${getStatusSelectClass(currentStatus)}`}
              disabled={loading}
            >
              <option value="">Select Status</option>
              <option value="approved">approved</option>
              <option value="paid">paid</option>
              <option value="rejected">rejected</option>
            </select>
          </td>
        </tr>
      )
    })}
    {reimbursements.length === 0 && !loading && (
      <tr>
        <td colSpan="7" className="p-3 text-center text-gray-400 border border-gray-300">
          No reimbursement reviews found
        </td>
      </tr>
    )}
    {loading && (
      <tr>
        <td colSpan="7" className="p-3 text-center border border-gray-300">
          Loading reimbursement data...
        </td>
      </tr>
    )}
  </tbody>
</table>

        </div>
      </div>
    </div>
  );
};

export default Accountant;
