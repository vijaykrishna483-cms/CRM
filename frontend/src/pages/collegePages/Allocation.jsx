import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';

const Allocation = () => {
  const [proposals, setProposals] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProposals();
    fetchTrainers();
    fetchAllocations();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/college/getproposals');
      setProposals(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch proposals');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trainer/getAllTrainers');
      setTrainers(res.data?.data || []);
      setFilteredTrainers(res.data?.data || []);
    } catch {
      toast.error('Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/college/alloted');
      setAllocations(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to fetch trainer allocations');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setLocationSearch(searchTerm);
    
    if (!searchTerm) {
      setFilteredTrainers(trainers);
      return;
    }
    
    const results = trainers.filter(trainer => 
      trainer.location?.toLowerCase().includes(searchTerm)
    );
    setFilteredTrainers(results);
  };

  const handleAddTrainer = async (trainerId) => {
    if (!selectedProposal) {
      toast.info('Please select a proposal first');
      return;
    }

    setLoading(true);
    try {
      await api.post('/college/addTrainer', {
        proposal_id: selectedProposal,
        trainer_id: trainerId
      });
      setSuccessMessage(`Trainer added to proposal successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      // Refresh allocations table
      await fetchAllocations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding trainer to proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Trainer Allocation</h1>

 <div className="bg-white mb-10 p-4 rounded-xl shadow-sm border overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#4f378a]">All Trainer Allocations</h2>
          <button 
            onClick={fetchAllocations}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Refresh Allocations
          </button>
        </div>
        {loading ? (
          <p className="text-center py-4">Loading allocations...</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="text-gray-600 bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">Proposal Code</th>
                <th className="p-2 text-left">Proposal ID</th>
                <th className="p-2 text-left">Trainer ID</th>
                <th className="p-2 text-left">Trainer Name</th>
                <th className="p-2 text-left">Location</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Contact</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Charge</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(allocation => (
                <tr key={`${allocation.proposal_id}-${allocation.trainer_id}`} className="text-left hover:bg-gray-50 border-t">
                  <td className="p-2">{allocation.proposal_code}</td>
                  <td className="p-2">{allocation.proposal_id}</td>
                  <td className="p-2">{allocation.trainer_id}</td>
                  <td className="p-2">{allocation.trainer_name}</td>
                  <td className="p-2">{allocation.location}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      allocation.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {allocation.status}
                    </span>
                  </td>
                  <td className="p-2">{allocation.contact_number}</td>
                  <td className="p-2">{allocation.email}</td>
                  <td className="p-2">₹{allocation.charge}</td>
                </tr>
              ))}
              {allocations.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-2 text-center text-gray-400">
                    No allocations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>


      {/* Proposal Selection */}
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">Select Proposal</h2>
        <select
          value={selectedProposal}
          onChange={(e) => setSelectedProposal(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select a proposal</option>
          {proposals.map(proposal => (
            <option key={proposal.proposal_id} value={proposal.proposal_id}>
              {proposal.proposal_code}
            </option>
          ))}
        </select>
      </div>

      {/* Location Search */}
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">Search Trainers by Location</h2>
        <input
          type="text"
          placeholder="Enter location (e.g., New York)"
          value={locationSearch}
          onChange={handleLocationSearch}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {successMessage && (
        <div className="max-w-3xl mx-auto mb-6 p-3 bg-green-100 text-green-800 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Allocations Table */}
     

      {/* Available Trainers */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-[#4f378a]">
            Available Trainers {locationSearch && `in ${locationSearch}`}
          </h3>
          <button 
            onClick={fetchTrainers}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Refresh Trainers
          </button>
        </div>
        
        {loading ? (
          <p className="text-center py-4">Loading trainers...</p>
        ) : filteredTrainers.length === 0 ? (
          <p className="text-center py-4 text-gray-400">
            {locationSearch 
              ? `No trainers found in ${locationSearch}` 
              : 'Enter a location to search for trainers'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrainers.map(trainer => (
              <div key={trainer.trainer_id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#4f378a]">{trainer.trainer_name}</h3>
                    <p className="text-sm text-gray-600">{trainer.location}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    trainer.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {trainer.status}
                  </span>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm">
                    <span className="font-medium">Contact:</span> {trainer.contact_number}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {trainer.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Charge:</span> ₹{trainer.charge}/session
                  </p>
                </div>
                
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-1">Services:</h4>
                  <div className="flex flex-wrap gap-1">
                    {trainer.services?.map((service, idx) => (
                      <span 
                        key={idx} 
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {service.service_name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddTrainer(trainer.trainer_id)}
                  className="mt-4 w-full py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
                  disabled={loading}
                >
                  Add to Proposal
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Allocation;
