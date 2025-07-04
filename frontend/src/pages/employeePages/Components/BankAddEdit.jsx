import React from 'react';
import usePageAccess from '../../../components/useAccessPage';

const BankAddEdit = ({
  bankInfo,
  handleChange,
  handleAddOrUpdate,
  loading,
  editId,
  employeeNames
}) => {
  // Hook must be called here, not inside return!
  const { allowed, loading: permissionLoading } = usePageAccess("employeebankdetailseditor");



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
  <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
    <h2 className="text-lg font-semibold text-[#4f378a]">
      {editId ? 'Edit Bank Details' : 'Add New Bank Details'}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col text-left">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Employee ID
          {bankInfo.employee_id && employeeNames[bankInfo.employee_id] && (
            <p className="mt-1 text-xs text-green-500">
              Employee: {employeeNames[bankInfo.employee_id]}
            </p>
          )}
        </label>
        <input
          name="employee_id"
          placeholder="Employee ID"
          value={bankInfo.employee_id}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col text-left">
        <label className="text-sm font-medium text-gray-700 mb-1">Account Number</label>
        <input
          name="bank_account_number"
          placeholder="Account Number"
          value={bankInfo.bank_account_number}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col text-left">
        <label className="text-sm font-medium text-gray-700 mb-1">Bank Name</label>
        <input
          name="bank_name"
          placeholder="Bank Name"
          value={bankInfo.bank_name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col text-left">
        <label className="text-sm font-medium text-gray-700 mb-1">Branch Name</label>
        <input
          name="branch_name"
          placeholder="Branch Name"
          value={bankInfo.branch_name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col text-left">
        <label className="text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
        <input
          name="branch_ifsc"
          placeholder="IFSC Code"
          value={bankInfo.branch_ifsc}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col text-left">
        <label className="text-sm font-medium text-gray-700 mb-1">MMID</label>
        <input
          name="mmid"
          placeholder="MMID"
          value={bankInfo.mmid}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col text-left">
        <label className="text-sm font-medium text-gray-700 mb-1">VPA (UPI ID)</label>
        <input
          name="vpa"
          placeholder="VPA (UPI ID)"
          value={bankInfo.vpa}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>
    </div>
    <button
      onClick={handleAddOrUpdate}
      className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
      disabled={loading}
    >
      {loading
        ? editId
          ? 'Updating...'
          : 'Adding...'
        : editId
          ? 'Update Bank Details'
          : 'Add Bank Details'}
    </button>
  </div>
); }

export default BankAddEdit;
