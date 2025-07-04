import React from 'react';
import usePageAccess from '../../../components/useAccessPage';
const fields = [
  { label: 'Employee ID', name: 'employee_id' },
  { label: 'Name', name: 'employee_name' },
  { label: 'Vertical', name: 'designation' },
  { label: 'Position', name: 'position' },
  { label: 'Aadhar Number', name: 'aadhar_number' },
  { label: 'PAN ID', name: 'pan_id' },
  { label: 'Personal Contact', name: 'personal_contact' },
  { label: 'Address', name: 'address' },
  { label: 'Office Contact', name: 'office_contact' },
  { label: 'Personal Email', name: 'personal_email' },
  { label: 'Office Email', name: 'office_email' },
  { label: 'Salary', name: 'salary' },
];

const EmployeeAddEdit = ({
  employeeInfo,
  handleChange,
  handleAddOrUpdate,
  loading,
  editId,
}) => {
  // Hook must be called here, not inside return!
  const { allowed, loading: permissionLoading } = usePageAccess("employeedataeditor");

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
        {editId ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map(({ label, name }) => (
          <div key={name} className="flex flex-col text-left">
            <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
            {name === 'designation' ? (
              <select
                id={name}
                name={name}
                value={employeeInfo[name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Vertical</option>
                <option value="operations">Operations</option>
                <option value="accounts">Accounts</option>
                <option value="marketing">Marketing</option>
                <option value="lms">LMS</option>
                <option value="hr">HR</option>
                <option value="backend">Backend</option>
                <option value="ceo">CEO</option>
              </select>
            ) : name === 'position' ? (
              <select
                id={name}
                name={name}
                value={employeeInfo[name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Position</option>
                <option value="senior">Senior</option>
                <option value="junior">Junior</option>
                <option value="intern">Intern</option>
              </select>
            ) : (
              <input
                id={name}
                name={name}
                placeholder={label}
                value={employeeInfo[name] || ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleAddOrUpdate}
        className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
        disabled={loading}
      >
        {loading ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update Employee' : 'Add Employee')}
      </button>
    </div>
  );
};

export default EmployeeAddEdit;
