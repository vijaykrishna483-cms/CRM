import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const EmployeeData = () => {
  const [employeeInfo, setEmployeeInfo] = useState({
    employee_id: '',
    employee_name: '',
    designation: '',
    aadhar_number: '',
    pan_id: '',
    personal_contact: '',
    address: '',
    office_contact: '',
    personal_email: '',
    office_email: '',
    salary: ''
  });
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  const handleChange = (e) => {
    setEmployeeInfo({ ...employeeInfo, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/employee/update/${editId}`, employeeInfo);
        toast.success('Employee updated successfully!');
      } else {
        await api.post('/employee/add', employeeInfo);
        toast.success('Employee added successfully!');
      }
      setEmployeeInfo({
        employee_id: '',
        employee_name: '',
        designation: '',
        aadhar_number: '',
        pan_id: '',
        personal_contact: '',
        address: '',
        office_contact: '',
        personal_email: '',
        office_email: '',
        salary: ''
      });
      setEditId(null);
      await fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEmployeeInfo(emp);
    setEditId(emp.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    setLoading(true);
    try {
      await api.delete(`/employee/delete/${id}`);
      await fetchEmployees();
      toast.success('Employee deleted');
    } catch {
      toast.error('Error deleting employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Employee Management Portal</h1>

      {/* Employee Add/Edit Section */}
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
        <h2 className="text-lg font-semibold text-[#4f378a]">{editId ? 'Edit Employee' : 'Add New Employee'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="employee_id" placeholder="Employee ID" value={employeeInfo.employee_id} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="employee_name" placeholder="Name" value={employeeInfo.employee_name} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="designation" placeholder="Designation" value={employeeInfo.designation} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="aadhar_number" placeholder="Aadhar Number" value={employeeInfo.aadhar_number} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="pan_id" placeholder="PAN ID" value={employeeInfo.pan_id} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="personal_contact" placeholder="Personal Contact" value={employeeInfo.personal_contact} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="address" placeholder="Address" value={employeeInfo.address} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="office_contact" placeholder="Office Contact" value={employeeInfo.office_contact} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="personal_email" placeholder="Personal Email" value={employeeInfo.personal_email} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="office_email" placeholder="Office Email" value={employeeInfo.office_email} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="salary" placeholder="Salary" value={employeeInfo.salary} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={handleAddOrUpdate} className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700" disabled={loading}>
          {loading ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update Employee' : 'Add Employee')}
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4 text-[#4f378a]">Employee Entries</h3>
        <table className="w-full text-sm border-collapse">
          <thead className="text-gray-600 bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Designation</th>
              <th className="p-2 text-left">Personal Contact</th>
              <th className="p-2 text-left">Office Contact</th>
              <th className="p-2 text-left">Personal Email</th>
              <th className="p-2 text-left">Office Email</th>
              <th className="p-2 text-left">Salary</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 border-t">
                <td className="p-2">{emp.employee_id}</td>
                <td className="p-2">{emp.employee_name}</td>
                <td className="p-2">{emp.designation}</td>
                <td className="p-2">{emp.personal_contact}</td>
                <td className="p-2">{emp.office_contact}</td>
                <td className="p-2">{emp.personal_email}</td>
                <td className="p-2">{emp.office_email}</td>
                <td className="p-2">{emp.salary}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(emp)} className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                  <button onClick={() => handleDelete(emp.id)} className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
            {employeeData.length === 0 && (
              <tr>
                <td colSpan="9" className="p-2 text-center text-gray-400">No Employees Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeData;
