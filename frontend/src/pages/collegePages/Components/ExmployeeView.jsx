import React from 'react';
import usePageAccess from '../../../components/useAccessPage';

const EmployeeView = ({
  filteredEmployees,
  searchTerm,
  setSearchTerm,
  handleEdit,
  handleDelete,
  showDetails ,
}) =>  {
  // Hook must be called here, not inside return!
  const { allowed, loading: permissionLoading } = usePageAccess("employeedataviewer");

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
    <h3 className="text-sm font-semibold mb-4 text-[#4f378a]">Employee Entries</h3>
    <input
      type="text"
      placeholder="Search by Name, Vertical or Contact"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      className="mb-4 w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
    />
   <div className="overflow-x-auto">
  <table className="min-w-full text-sm border-collapse whitespace-nowrap border border-gray-300">
  <thead className="text-gray-600 bg-gray-100 border-b">
    <tr>
      <th className="p-2 text-left border border-gray-300">ID</th>
      <th className="p-2 text-left border border-gray-300">Name</th>
      <th className="p-2 text-left border border-gray-300">Vertical</th>
      <th className="p-2 text-left border border-gray-300">Position</th>
      <th className="p-2 text-left border border-gray-300">Personal Contact</th>
      <th className="p-2 text-left border border-gray-300">Office Contact</th>
      <th className="p-2 text-left border border-gray-300">Personal Email</th>
      <th className="p-2 text-left border border-gray-300">Office Email</th>
      <th className="p-2 text-left border border-gray-300">Salary</th>
      {showDetails && <th className="p-2 text-left border border-gray-300">Actions</th>}
    </tr>
  </thead>
  <tbody>
    {filteredEmployees.map((emp) => (
      <tr key={emp.id} className="hover:bg-gray-50 border-t">
        <td className="p-2 border border-gray-300">{emp.employee_id}</td>
        <td className="p-2 border border-gray-300">{emp.employee_name}</td>
        <td className="p-2 border border-gray-300">{emp.designation}</td>
        <td className="p-2 border border-gray-300">{emp.position}</td>
        <td className="p-2 border border-gray-300">{emp.personal_contact}</td>
        <td className="p-2 border border-gray-300">{emp.office_contact}</td>
        <td className="p-2 border border-gray-300">{emp.personal_email}</td>
        <td className="p-2 border border-gray-300">{emp.office_email}</td>
        <td className="p-2 border border-gray-300">{emp.salary}</td>
        {showDetails && (
          <td className="p-2 border border-gray-300">
            <button
              onClick={() => handleEdit(emp)}
              className="text-blue-500 hover:text-blue-700 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(emp.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </td>
        )}
      </tr>
    ))}
    {filteredEmployees.length === 0 && (
      <tr>
        <td colSpan="10" className="p-2 text-center text-gray-400 border border-gray-300">
          No Employees Found
        </td>
      </tr>
    )}
  </tbody>
</table>

</div>

  </div>
); }

export default EmployeeView;
