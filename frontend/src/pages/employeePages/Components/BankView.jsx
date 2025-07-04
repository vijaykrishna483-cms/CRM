import React from 'react';
import usePageAccess from '../../../components/useAccessPage';

const BankView = ({
  bankData,
  loading,
  handleEdit,
  handleDelete
}) => {
  // Hook must be called here, not inside return!
  const { allowed, loading: permissionLoading } = usePageAccess("employeebankdetailsviewer");

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
  <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
    <h3 className="text-sm font-semibold mb-4 text-[#4f378a]">Bank Details Entries</h3>
    {loading ? (
      <p className="text-center py-4">Loading bank details...</p>
    ) : (
      <table className="w-full text-sm border-collapse">
        <thead className="text-gray-600 bg-gray-100 border-b">
          <tr>
            <th className="p-2 text-left">Employee ID</th>
            <th className="p-2 text-left">Employee Name</th>
            <th className="p-2 text-left">Account Number</th>
            <th className="p-2 text-left">Bank Name</th>
            <th className="p-2 text-left">IFSC</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bankData.map((bank) => (
            <tr key={bank.id} className="hover:bg-gray-50 border-t text-left">
              <td className="p-2">{bank.employee_id}</td>
              <td className="p-2">{bank.employee_name}</td>
              <td className="p-2">{bank.bank_account_number}</td>
              <td className="p-2">{bank.bank_name}</td>
              <td className="p-2">{bank.branch_ifsc}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(bank)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(bank.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {bankData.length === 0 && (
            <tr>
              <td colSpan="6" className="p-2 text-center text-gray-400">
                No bank details found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
); 
}

export default BankView;
