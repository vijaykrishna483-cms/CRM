import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
import EmployeeAddEdit from '../collegePages/Components/EmployeeAdd';
import EmployeeView from '../collegePages/Components/ExmployeeView';
const initialEmployeeState = {
  employee_id: '',
  employee_name: '',
  designation: '',
  position: '',
  aadhar_number: '',
  pan_id: '',
  personal_contact: '',
  address_line1: '',
  address_line2: '',
  address_line3: '',
  office_contact: '',
  personal_email: '',
  office_email: '',
  salary: ''
};

const EmployeeData = () => {

  const [employeeInfo, setEmployeeInfo] = useState(initialEmployeeState);
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      setEmployeeInfo(initialEmployeeState);
      setEditId(null);
      setEdit(false);
      await fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEdit(true);
    setOpen(true);
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

  const filteredEmployees = employeeData.filter(emp =>
    (emp.employee_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.designation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.personal_contact || '').includes(searchTerm)
  );

  

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 ">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Employee Management Portal</h1>
      <div className="flex flex-wrap gap-4 bg-transparent justify-center rounded-2xl px-4 py-2 mb-8">
        <button
          onClick={() => { setOpen(true); setEdit(false); setEmployeeInfo(initialEmployeeState); setEditId(null); }}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
            ${open ? "bg-[#6750a4] text-white shadow font-semibold scale-105" : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"}
          `}
          style={{
            minWidth: "140px",
            boxShadow: open ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          {edit ? <> <span>Edit</span> </> : <>Add</>}
        </button>
        <button
          onClick={() => { setOpen(false); setEdit(false); setEmployeeInfo(initialEmployeeState); setEditId(null); }}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
            ${open ? "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]" : "bg-[#6750a4] text-white shadow font-semibold scale-105"}
          `}
          style={{
            minWidth: "140px",
            boxShadow: !open ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          View
        </button>
      </div>

      {open && (
        <EmployeeAddEdit
          employeeInfo={employeeInfo}
          handleChange={handleChange}
          handleAddOrUpdate={handleAddOrUpdate}
          loading={loading}
          editId={editId}
        />
      )}

      <EmployeeView
        filteredEmployees={filteredEmployees}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default EmployeeData;
