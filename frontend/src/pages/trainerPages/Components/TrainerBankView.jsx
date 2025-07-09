import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import usePageAccess from '../../../components/useAccessPage';
import api from '../../../libs/apiCall';


const TrainerBankView = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("trainerbankdetailsview");
  const [bankInfo, setBankInfo] = useState({
    trainer_id: '',
    bank_account_number: '',
    bank_name: '',
    branch_name: '',
    branch_ifsc: '',
    mmid: '',
    vpa: ''
  });
  
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [trainerNames, setTrainerNames] = useState({});

  useEffect(() => {
    fetchBankDetails();
    fetchTrainerNames();
  }, []);

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trainer/getallBank');
      setBankDetails(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch bank details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerNames = async () => {
    try {
      const res = await api.get('/trainer/getAllTrainers');
      const namesMap = {};
      res.data.forEach(trainer => {
        namesMap[trainer.trainer_id] = trainer.trainer_name;
      });
      setTrainerNames(namesMap);
    } catch {
      console.error("Couldn't fetch trainer names");
    }
  };

  const handleChange = (e) => {
    setBankInfo({ ...bankInfo, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/trainer/updateBank/${editId}`, bankInfo);
         toast.success('Bank details updated!');
      } else {
        await api.post('/trainer/addBank', bankInfo);
         toast.success('Bank details added!');
      }
      setBankInfo({
        trainer_id: '',
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
      trainer_id: bank.trainer_id,
      bank_account_number: bank.bank_account_number,
      bank_name: bank.bank_name,
      branch_name: bank.branch_name,
      branch_ifsc: bank.branch_ifsc,
      mmid: bank.mmid,
      vpa: bank.vpa
    });
    setEditId(bank.trainer_id);
  };

  const[open,setOpen]=useState(true);
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
      {/* Bank Details Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4 text-[#4f378a]">Bank Details Entries</h3>
        
        {loading ? (
          <p className="text-center py-4">Loading bank details...</p>
        ) : (
         <table className="w-full text-sm border-collapse border border-gray-300">
  <thead className="text-gray-600 bg-gray-100 border-b">
    <tr>
      <th className="p-2 text-left border border-gray-300">Trainer ID</th>
      <th className="p-2 text-left border border-gray-300">Trainer Name</th>
      <th className="p-2 text-left border border-gray-300">Account Number</th>
      <th className="p-2 text-left border border-gray-300">Bank Name</th>
      <th className="p-2 text-left border border-gray-300">IFSC</th>
      {/* <th className="p-2 text-left border border-gray-300">Actions</th> */}
    </tr>
  </thead>
  <tbody>
    {bankDetails.map((bank) => (
      <tr key={bank.trainer_id} className="hover:bg-gray-50 border-t text-left">
        <td className="p-2 border border-gray-300">{bank.trainer_id}</td>
        <td className="p-2 border border-gray-300">
          {trainerNames[bank.trainer_id] || 'N/A'}
        </td>
        <td className="p-2 border border-gray-300">{bank.bank_account_number}</td>
        <td className="p-2 border border-gray-300">{bank.bank_name}</td>
        <td className="p-2 border border-gray-300">{bank.branch_ifsc}</td>
        {/* <td className="p-2 border border-gray-300">
          <button 
            onClick={() => handleEdit(bank)}
            className="text-blue-500 hover:text-blue-700 mr-2"
          >
            Edit
          </button>
        </td> */}
      </tr>
    ))}
    {bankDetails.length === 0 && (
      <tr>
        <td colSpan="5" className="p-2 text-center text-gray-400 border border-gray-300">
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

export default TrainerBankView;
