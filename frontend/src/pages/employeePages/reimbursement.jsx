import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall";
import { toast } from "react-toastify";
import usePageAccess from "../../components/useAccessPage";
const Reimbursement = () => {
  // Reimbursement state

  
  const { allowed, loading: permissionLoading } = usePageAccess("reimbursementrequest");


  const [reimbursementInfo, setReimbursementInfo] = useState({
    date: "",
    employee_id: "",
    reimbursement_id: "",
    duration: "",
    from_date: "",
    to_date: "",
    location: "",
    program: "",
    word_link: "",
    excel_link: "",
    status: "", // Default status
  });

  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const fetchReimbursements = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee/getreimbursments");
      setReimbursements(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch reimbursements");
    } finally {
      setLoading(false);
    }
  };

  const handleReimbursementChange = (e) => {
    setReimbursementInfo({
      ...reimbursementInfo,
      [e.target.name]: e.target.value,
    });
  };

function getNextReimbursementCode(existingCodes) {
  const numbers = existingCodes
    .map(code => {
      const match = code && code.match(/^REIMB(\d{2})$/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter(num => num !== null);

  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNum = max + 1;
  return `REIMB${nextNum.toString().padStart(2, "0")}`;
}
// Some code that uses 'open' here (e.g., in a useEffect or function)
const [open, setOpen] = useState(true);


useEffect(() => {
  if (open) {
    const codes = reimbursements.map(r => r.reimbursement_id);
    const nextCode = getNextReimbursementCode(codes);
    setReimbursementInfo(info => ({
      ...info,
      reimbursement_id: nextCode,
    }));
  }
}, [reimbursements, open]);

  const handleAddReimbursement = async () => {
    setLoading(true);
    try {
      await api.post("/employee/addreimbursment", reimbursementInfo);
      toast.success("Reimbursement added successfully!");
      setReimbursementInfo({
        date: "",
        employee_id: "",
        reimbursement_id: "",
        duration: "",
        from_date: "",
        to_date: "",
        location: "",
        program: "",
        word_link: "",
        excel_link: "",
        status: "",
      });
      await fetchReimbursements();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error adding reimbursement");
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
        Reimbursement Management
      </h1>


      <div className="flex flex-wrap gap-4 bg-transparent justify-center  rounded-2xl px-4 py-2 mb-8">
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
          Add
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
          View
        </button>
      </div>

{open? <>  <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">
          Add New Reimbursement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col text-left">
            <label htmlFor="employee_id" className="mb-1 text-gray-600 text-sm">
              Employee ID
            </label>
            <input
              id="employee_id"
              name="employee_id"
              placeholder="Employee ID"
              value={reimbursementInfo.employee_id}
              onChange={handleReimbursementChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label
              htmlFor="reimbursement_id"
              className="mb-1 text-gray-600 text-sm"
            >
              Reimbursement ID
            </label>
         <input
  id="reimbursement_id"
  name="reimbursement_id"
  placeholder="Reimbursement ID"
  value={reimbursementInfo.reimbursement_id}
  onChange={handleReimbursementChange}
  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
  readOnly
/>

          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="date" className="mb-1 text-gray-600 text-sm">
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={reimbursementInfo.date}
              onChange={handleReimbursementChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="duration" className="mb-1 text-gray-600 text-sm">
              Duration (days)
            </label>
            <input
              id="duration"
              name="duration"
              placeholder="Duration (days)"
              value={reimbursementInfo.duration}
              onChange={handleReimbursementChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="from_date" className="mb-1 text-gray-600 text-sm">
              From Date
            </label>
            <input
              id="from_date"
              type="date"
              name="from_date"
              value={reimbursementInfo.from_date}
              onChange={handleReimbursementChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="to_date" className="mb-1 text-gray-600 text-sm">
              To Date
            </label>
            <input
              id="to_date"
              type="date"
              name="to_date"
              value={reimbursementInfo.to_date}
              onChange={handleReimbursementChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="location" className="mb-1 text-gray-600 text-sm">
              Location
            </label>
            <input
              id="location"
              name="location"
              placeholder="Location"
              value={reimbursementInfo.location}
              onChange={handleReimbursementChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="program" className="mb-1 text-gray-600 text-sm">
              Program
            </label>
            <input
              id="program"
              name="program"
              placeholder="Program"
              value={reimbursementInfo.program}
              onChange={handleReimbursementChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="word_link" className="mb-1 text-gray-600 text-sm">
              Word Link
            </label>
            <input
              id="word_link"
              name="word_link"
              placeholder="Word Link"
              value={reimbursementInfo.word_link}
              onChange={handleReimbursementChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="excel_link" className="mb-1 text-gray-600 text-sm">
              Excel Link
            </label>
            <input
              id="excel_link"
              name="excel_link"
              placeholder="Excel Link"
              value={reimbursementInfo.excel_link}
              onChange={handleReimbursementChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleAddReimbursement}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Reimbursement"}
        </button>
      </div> 
      
      
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
        <table className="w-full text-sm border-collapse border border-gray-300">
  <thead className="text-gray-600 bg-gray-100 border-b">
    <tr>
      <th className="p-2 text-left border border-gray-300">Date</th>
      <th className="p-2 text-left border border-gray-300">Employee ID</th>
      <th className="p-2 text-left border border-gray-300">Reimbursement ID</th>
      <th className="p-2 text-left border border-gray-300">Program</th>
      <th className="p-2 text-left border border-gray-300">Location</th>
      <th className="p-2 text-left border border-gray-300">Duration</th>
      <th className="p-2 text-left border border-gray-300">Word Link</th>
      <th className="p-2 text-left border border-gray-300">Excel Link</th>
      <th className="p-2 text-left border border-gray-300">Status</th>
    </tr>
  </thead>
  <tbody>
    {reimbursements.map((reimb) => (
      <tr
        key={reimb.id}
        className="hover:bg-gray-50 border-t text-left"
      >
        <td className="p-2 border border-gray-300">
          {new Date(reimb.date).toLocaleDateString()}
        </td>
        <td className="p-2 border border-gray-300">{reimb.employee_id}</td>
        <td className="p-2 border border-gray-300">{reimb.reimbursement_id}</td>
        <td className="p-2 border border-gray-300">{reimb.program}</td>
        <td className="p-2 border border-gray-300">{reimb.location}</td>
        <td className="p-2 border border-gray-300">{reimb.duration} days</td>
        <td className="p-2 border border-gray-300">
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
            <span className="text-gray-400 text-xs">No document</span>
          )}
        </td>
        <td className="p-2 border border-gray-300">
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
            <span className="text-gray-400 text-xs">No document</span>
          )}
        </td>
        <td className="p-2 border border-gray-300">
          {reimb.status === 'requested' && (
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">Requested</span>
          )}
          {reimb.status === 'pending' && (
            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">Pending</span>
          )}
          {reimb.status === 'paid' && (
            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Paid</span>
          )}
          {reimb.status === 'rejected' && (
            <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Rejected</span>
          )}
        </td>
      </tr>
    ))}
    {reimbursements.length === 0 && (
      <tr>
        <td colSpan="9" className="p-2 text-center text-gray-400 border border-gray-300">
          No reimbursements found
        </td>
      </tr>
    )}
  </tbody>
</table>

        )}
      </div></> :<>

      
      
      
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
       <table className="w-full text-sm border-collapse border border-gray-300">
  <thead className="text-gray-600 bg-gray-100 border-b">
    <tr>
      <th className="p-2 text-left border border-gray-300">Date</th>
      <th className="p-2 text-left border border-gray-300">Employee ID</th>
      <th className="p-2 text-left border border-gray-300">Reimbursement ID</th>
      <th className="p-2 text-left border border-gray-300">Program</th>
      <th className="p-2 text-left border border-gray-300">Location</th>
      <th className="p-2 text-left border border-gray-300">Duration</th>
      <th className="p-2 text-left border border-gray-300">Word Link</th>
      <th className="p-2 text-left border border-gray-300">Excel Link</th>
      <th className="p-2 text-left border border-gray-300">Status</th>
    </tr>
  </thead>
  <tbody>
    {reimbursements.map((reimb) => (
      <tr
        key={reimb.id}
        className="hover:bg-gray-50 border-t text-left"
      >
        <td className="p-2 border border-gray-300">
          {new Date(reimb.date).toLocaleDateString()}
        </td>
        <td className="p-2 border border-gray-300">{reimb.employee_id}</td>
        <td className="p-2 border border-gray-300">{reimb.reimbursement_id}</td>
        <td className="p-2 border border-gray-300">{reimb.program}</td>
        <td className="p-2 border border-gray-300">{reimb.location}</td>
        <td className="p-2 border border-gray-300">{reimb.duration} days</td>
        <td className="p-2 border border-gray-300">
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
            <span className="text-gray-400 text-xs">No document</span>
          )}
        </td>
        <td className="p-2 border border-gray-300">
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
            <span className="text-gray-400 text-xs">No document</span>
          )}
        </td>
        <td className="p-2 border border-gray-300">
          {reimb.status === 'requested' && (
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">Requested</span>
          )}
          {reimb.status === 'pending' && (
            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">Pending</span>
          )}
          {reimb.status === 'paid' && (
            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Paid</span>
          )}
          {reimb.status === 'rejected' && (
            <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">Rejected</span>
          )}
        </td>
      </tr>
    ))}
    {reimbursements.length === 0 && (
      <tr>
        <td colSpan="9" className="p-2 text-center text-gray-400 border border-gray-300">
          No reimbursements found
        </td>
      </tr>
    )}
  </tbody>
</table>

        )}
      </div>
        </>}

    
    </div>
  );
};

export default Reimbursement;
