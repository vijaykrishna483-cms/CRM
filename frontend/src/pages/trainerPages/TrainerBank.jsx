import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
import usePageAccess from '../../components/useAccessPage';
import TrainerBankAdd from './Components/TrainerBankAdd';
import TrainerBankView from './Components/TrainerBankView';
const TrainerBank = () => {

      const { allowed, loading: permissionLoading } = usePageAccess("trainerbankdetails");



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
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Trainer Bank Details</h1>

    <div className="flex flex-wrap gap-4 bg-transparent justify-center rounded-2xl px-4 py-2 mb-8">
        <button
          onClick={() => { setOpen(true) }}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
            ${open ? "bg-[#6750a4] text-white shadow font-semibold scale-105" : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"}
          `}
          style={{
            minWidth: "140px",
            boxShadow: open ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          <>Add</>
        </button>
        <button
          onClick={() => { setOpen(false) }}
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

     {open? <><TrainerBankAdd/> </>: <> <TrainerBankView/></>}
    </div>
  );
};

export default TrainerBank;
