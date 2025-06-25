import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const Reimbursement = () => {
  // Reimbursement state
  const [reimbursementInfo, setReimbursementInfo] = useState({
    date: '',
    employee_id: '',
    reimbursement_id: '',
    duration: '',
    from_date: '',
    to_date: '',
    location: '',
    program: ''
  });
  
  // Expenditure state
  const [expenditureInfo, setExpenditureInfo] = useState({
    reimbursement_id: '',
    expense_category: '',
    expense_amount: '',
    additional_cost: '',
    total_cost: '',
    invoice: ''
  });
  
  const [reimbursements, setReimbursements] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExpenditures, setShowExpenditures] = useState(false);

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const fetchReimbursements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee/getreimbursments');
      setReimbursements(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch reimbursements');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenditures = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee/getallexpenditures');
      setExpenditures(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch expenditures');
    } finally {
      setLoading(false);
    }
  };

  const handleReimbursementChange = (e) => {
    setReimbursementInfo({ ...reimbursementInfo, [e.target.name]: e.target.value });
  };

  const handleExpenditureChange = (e) => {
    setExpenditureInfo({ ...expenditureInfo, [e.target.name]: e.target.value });
  };

  const handleAddReimbursement = async () => {
    setLoading(true);
    try {
      await api.post('/employee/addreimbursment', reimbursementInfo);
      toast.success('Reimbursement added successfully!');
      setReimbursementInfo({
        date: '',
        employee_id: '',
        reimbursement_id: '',
        duration: '',
        from_date: '',
        to_date: '',
        location: '',
        program: ''
      });
      await fetchReimbursements();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error adding reimbursement');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpenditure = async () => {
    setLoading(true);
    try {
      await api.post('/employee/addexpenditure', expenditureInfo);
      toast.success('Expenditure added successfully!');
      setExpenditureInfo({
        reimbursement_id: '',
        expense_category: '',
        expense_amount: '',
        additional_cost: '',
        total_cost: '',
        invoice: ''
      });
      await fetchExpenditures();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error adding expenditure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Reimbursement Management</h1>

      {/* Reimbursement Section */}
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">Add New Reimbursement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

               <input
            name="employee_id"
            placeholder="Employee ID"
            value={reimbursementInfo.employee_id}
            onChange={handleReimbursementChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />

               <input
            name="reimbursement_id"
            placeholder="Reimbursement ID"
            value={reimbursementInfo.reimbursement_id}
            onChange={handleReimbursementChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
            <div className="flex flex-col text-left">
           <label htmlFor="date" className="mb-1 text-gray-600"> Date</label>
          <input
            type="date"
            name="date"
            value={reimbursementInfo.date}
            onChange={handleReimbursementChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          </div>
       
     
          <input
            name="duration"
            placeholder="Duration (days)"
            value={reimbursementInfo.duration}
            onChange={handleReimbursementChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
<div className="flex flex-col text-left">
           <label htmlFor="from_date" className="mb-1 text-gray-600">From Date</label>
          <input
            type="date"
            name="from_date"
            placeholder="From Date"
            value={reimbursementInfo.from_date}
            onChange={handleReimbursementChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
</div>
          <div className="flex flex-col  text-left">
           <label htmlFor="from_date" className="mb-1 text-gray-600">To Date</label>


          <input

            type="date"
            name="to_date"
            placeholder="To Date"
            value={reimbursementInfo.to_date}
            onChange={handleReimbursementChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          </div>
          <input
            name="location"
            placeholder="Location"
            value={reimbursementInfo.location}
            onChange={handleReimbursementChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            name="program"
            placeholder="Program"
            value={reimbursementInfo.program}
            onChange={handleReimbursementChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={handleAddReimbursement}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Reimbursement'}
        </button>
      </div>

      {/* Reimbursements Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-[#4f378a]">Reimbursement Entries</h3>
          <button 
            onClick={fetchReimbursements}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="text-center py-4">Loading reimbursements...</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="text-gray-600 bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Employee ID</th>
                <th className="p-2 text-left">Reimbursement ID</th>
                <th className="p-2 text-left">Duration</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Program</th>
              </tr>
            </thead>
            <tbody>
              {reimbursements.map((reimb) => (
                <tr key={reimb.id} className="hover:bg-gray-50 border-t text-left">
                  <td className="p-2">{new Date(reimb.date).toLocaleDateString()}</td>
                  <td className="p-2">{reimb.employee_id}</td>
                  <td className="p-2">{reimb.reimbursement_id}</td>
                  <td className="p-2">{reimb.duration} days</td>
                  <td className="p-2">{reimb.location}</td>
                  <td className="p-2">{reimb.program}</td>
                </tr>
              ))}
              {reimbursements.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-2 text-center text-gray-400">
                    No reimbursements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Expenditure Section */}
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#4f378a]">Expenditure Management</h2>
          <button 
            onClick={() => setShowExpenditures(!showExpenditures)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showExpenditures ? 'Hide Form' : 'Show Form'}
          </button>
        </div>

        {showExpenditures && (
          <div className="mb-8">
            <h3 className="text-md font-medium mb-3 text-[#4f378a]">Add New Expenditure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="reimbursement_id"
                placeholder="Reimbursement ID"
                value={expenditureInfo.reimbursement_id}
                onChange={handleExpenditureChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                name="expense_category"
                placeholder="Expense Category"
                value={expenditureInfo.expense_category}
                onChange={handleExpenditureChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="expense_amount"
                placeholder="Amount"
                value={expenditureInfo.expense_amount}
                onChange={handleExpenditureChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="additional_cost"
                placeholder="Additional Cost"
                value={expenditureInfo.additional_cost}
                onChange={handleExpenditureChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="total_cost"
                placeholder="Total Cost"
                value={expenditureInfo.total_cost}
                onChange={handleExpenditureChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                name="invoice"
                placeholder="Invoice Number"
                value={expenditureInfo.invoice}
                onChange={handleExpenditureChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              onClick={handleAddExpenditure}
              className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Expenditure'}
            </button>
          </div>
        )}

        {/* Expenditures Table */}
        <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-[#4f378a]">Expenditure Entries</h3>
            <button 
              onClick={fetchExpenditures}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <p className="text-center py-4">Loading expenditures...</p>
          ) : ( 
            <table className="w-full text-sm border-collapse ">
              <thead className="text-gray-600 bg-gray-100 border-b ">
                <tr>
                  <th className="p-2 text-left">Reimbursement ID</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Total Cost</th>
                  <th className="p-2 text-left">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50 border-t text-left">
                    <td className="p-2">{exp.reimbursement_id}</td>
                    <td className="p-2">{exp.expense_category}</td>
                    <td className="p-2">₹{exp.expense_amount}</td>
                    <td className="p-2">₹{exp.total_cost}</td>
                    <td className="p-2">{exp.invoice}</td>
                  </tr>
                ))}
                {expenditures.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-2 text-center text-gray-400">
                      No expenditures found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reimbursement;
