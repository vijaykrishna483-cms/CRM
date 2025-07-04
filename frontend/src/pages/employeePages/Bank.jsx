import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
import BankAddEdit from '../employeePages/Components/BankAddEdit';
import BankView from '../employeePages/Components/BankView';

const initialBankState = {
  employee_id: '',
  bank_account_number: '',
  bank_name: '',
  branch_name: '',
  branch_ifsc: '',
  mmid: '',
  vpa: ''
};

const Bank = () => {
  

  const [bankInfo, setBankInfo] = useState(initialBankState);
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
      setBankInfo(initialBankState);
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
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 ">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Bank Details Management</h1>
      <BankAddEdit
        bankInfo={bankInfo}
        handleChange={handleChange}
        handleAddOrUpdate={handleAddOrUpdate}
        loading={loading}
        editId={editId}
        employeeNames={employeeNames}
      />
      <BankView
        bankData={bankData}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Bank;
