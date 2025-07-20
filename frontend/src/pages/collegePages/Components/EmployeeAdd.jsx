import React from 'react';
import usePageAccess from '../../../components/useAccessPage';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../../libs/apiCall';

const fields = [
  { label: 'Employee ID', name: 'employee_id' },
  { label: 'Name', name: 'employee_name' },
  { label: 'Vertical', name: 'designation' },
  { label: 'Position', name: 'position' },
  { label: 'Aadhar Number', name: 'aadhar_number' },
  { label: 'PAN ID', name: 'pan_id' },
  { label: 'Personal Contact', name: 'personal_contact' },
  { label: 'Address Line 1', name: 'address_line1' },
  { label: 'Address Line 2', name: 'address_line2' },
  { label: 'Address Line 3', name: 'address_line3' },
  { label: 'Office Contact', name: 'office_contact' },
  { label: 'Personal Email', name: 'personal_email' },
  { label: 'Office Email', name: 'office_email' },
  { label: 'Salary', name: 'salary' },
  { label: 'Location', name: 'location' }, // <-- Added location field
];

const EmployeeAddEdit = ({
  employeeInfo,
  handleChange,
  handleAddOrUpdate,
  loading,
  editId,
}) => {
  const { allowed, loading: permissionLoading } = usePageAccess("employeedataeditor");


  const [verticals, setVerticals] = useState([]);


  const [positions, setPositions] = useState([]);

  useEffect(() => {
    api.get("/auth/vertical/getall")
      .then(res => setVerticals(res.data.data || []))
      .catch(() => setVerticals([]));
    api.get("/auth/position/getall")
      .then(res => setPositions(res.data.data || []))
      .catch(() => setPositions([]));
  }, []);




  if (!allowed && !permissionLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      {/* ...access denied UI... */}
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
          
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6a54a6] bg-gray-50"
            >
              <option value="">Select Vertical</option>
              {verticals.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
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
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
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
