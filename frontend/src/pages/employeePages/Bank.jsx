import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const Bank = () => {
  const [bankInfo, setBankInfo] = useState({
    employee_id: '',
    bank_account_number: '',
    bank_name: '',
    branch_name: '',
    branch_ifsc: '',
    mmid: '',
    vpa: ''
  });
  const [bankData, setBankData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [employeeNames, setEmployeeNames] = useState({});

  useEffect(() => {
    fetchBankDetails();
    fetchEmployeeNames();
  }, []);

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee/bankdetails');
      setBankData(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch bank details');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeNames = async () => {
    try {
      const res = await api.get('/employee');
      const namesMap = {};
      res.data.forEach(emp => {
        namesMap[emp.employee_id] = emp.employee_name;
      });
      setEmployeeNames(namesMap);
    } catch {
      console.error("Couldn't fetch employee names");
    }
  };

  const handleChange = (e) => {
    setBankInfo({ ...bankInfo, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/employee/bankUpdate/${editId}`, bankInfo);
        toast.success('Bank details updated!');
      } else {
        await api.post('/employee/addbank', bankInfo);
        toast.success('Bank details added!');
      }
      setBankInfo({
        employee_id: '',
        bank_account_number: '',
        bank_name: '',
        branch_name: '',
        branch_ifsc: '',
        mmid: '',
        vpa: ''
      });
      setEditId(null);
      await fetchBankDetails();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving bank details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bank) => {
    setBankInfo({
      employee_id: bank.employee_id,
      bank_account_number: bank.bank_account_number,
      bank_name: bank.bank_name,
      branch_name: bank.branch_name,
      branch_ifsc: bank.branch_ifsc,
      mmid: bank.mmid,
      vpa: bank.vpa
    });
    setEditId(bank.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete these bank details?')) return;
    setLoading(true);
    try {
      await api.delete(`/employee/bankDelete/${id}`);
      await fetchBankDetails();
      toast.success('Bank details deleted');
    } catch {
      toast.error('Error deleting bank details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Bank Details Management</h1>

      {/* Bank Details Form */}
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
        <h2 className="text-lg font-semibold text-[#4f378a]">
          {editId ? 'Edit Bank Details' : 'Add New Bank Details'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-left font-medium text-gray-700 mb-1">Employee ID</label>
            <input
              name="employee_id"
              placeholder="Employee ID"
              value={bankInfo.employee_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            {bankInfo.employee_id && employeeNames[bankInfo.employee_id] && (
              <p className="mt-1 text-xs text-left text-gray-500">
                Employee: {employeeNames[bankInfo.employee_id]}
              </p>
            )}
          </div>
          
          <input
            name="bank_account_number"
            placeholder="Account Number"
            value={bankInfo.bank_account_number}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          
          <input
            name="bank_name"
            placeholder="Bank Name"
            value={bankInfo.bank_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          
          <input
            name="branch_name"
            placeholder="Branch Name"
            value={bankInfo.branch_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          
          <input
            name="branch_ifsc"
            placeholder="IFSC Code"
            value={bankInfo.branch_ifsc}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          
          <input
            name="mmid"
            placeholder="MMID"
            value={bankInfo.mmid}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          
          <input
            name="vpa"
            placeholder="VPA (UPI ID)"
            value={bankInfo.vpa}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
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

      {/* Bank Details Table */}
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
    </div>
  );
};

export default Bank;
