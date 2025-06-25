import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const ProposalData = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    collegeCode: '',
    proposalCode: '',
    issueDate: '',
    quotedPrice: '',
    duration: '',
    fromDate: '',
    toDate: '',
  });
  

  const [services, setServices] = useState([]); // All available services

  // Service management state
  const [serviceForm, setServiceForm] = useState({
    proposalCode: '',
    serviceName: ''
  });
  const [serviceLoading, setServiceLoading] = useState(false);
  const [proposalServices, setProposalServices] = useState({});

  // For editing proposals
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProposals();
    fetchServices();
    fetchServicesForProposal(); // Fetch all available services
  }, []);

   const fetchServices = async () => {
    try {
      const res = await api.get('/college/getservices');
      setServices(res.data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
    }
  };


const fetchProposals = async () => {
  setLoading(true);
  try {
   const res = await api.get('/college/getproposals');
    const proposalsList = res.data.data || [];
    setProposals(proposalsList);
    const initialServices = {};
    proposalsList.forEach(proposal => {
      initialServices[proposal.proposal_id] = [];
      fetchServicesForProposal(proposal.proposal_id);
    });
    setProposalServices(initialServices);
  } catch (err) {
    toast.error('Failed to fetch proposals');
  } finally {
    setLoading(false);
  }
};



   const handleAddService = async () => {
    const { proposalCode, serviceId } = serviceForm;
    
    if (!proposalCode || !serviceId) {
      toast.info('Please select a proposal and service');
      return;
    }
    
    // Find proposal ID by code
    const proposal = proposals.find(p => p.proposal_code === proposalCode);
    if (!proposal) {
      toast.error('Proposal not found');
      return;
    }
    
    setServiceLoading(true);
    try {
      // Send proposalId and serviceId to backend
      const res = await api.post('/college/service', {
        proposalId: proposal.proposal_id,
        serviceId: serviceId
      });
      
      if (res.data.status !== 'success') throw new Error(res.data.message);
      
      // Update services for this proposal
      const newService = services.find(s => s.service_id == serviceId);
      if (newService) {
        setProposalServices(prev => ({
          ...prev,
          [proposal.proposal_id]: [
            ...(prev[proposal.proposal_id] || []),
            newService
          ]
        }));
      }
      
      setServiceForm({ proposalCode: '', serviceId: '' });
      toast.success('Service added successfully!');
    } catch (err) {
      toast.error(err.message || 'Error adding service');
    } finally {
      setServiceLoading(false);
    }
  };

  
  // Fetch services for a specific proposal
  const fetchServicesForProposal = async (proposalId) => {
    setServiceLoading(true);
    try {
      const res = await api.get(`/college/services/${proposalId}`);
      setProposalServices(prev => ({
        ...prev,
        [proposalId]: res.data.data || []
      }));
    } catch (err) {
      toast.error('Failed to fetch services');
    } finally {
      setServiceLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceFormChange = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const handleAddProposal = async () => {
    const { collegeCode, proposalCode, issueDate, quotedPrice, duration, fromDate, toDate } = form;
    if (!collegeCode || !proposalCode || !issueDate || !quotedPrice || !duration || !fromDate || !toDate) {
      toast.info('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/college/addproposal', {
        collegeCode,
        proposalCode,
        issueDate,
        quotedPrice,
        duration,
        fromDate,
        toDate,
      });
      if (res.data.status !== 'success') throw new Error(res.data.message);
      await fetchProposals();
      setForm({
        collegeCode: '',
        proposalCode: '',
        issueDate: '',
        quotedPrice: '',
        duration: '',
        fromDate: '',
        toDate: '',
      });
      toast.success('Proposal added successfully!');
    } catch (err) {
      toast.error(err.message || 'Error adding proposal');
    } finally {
      setLoading(false);
    }
  };

  // Add service to proposal
 
  // Editing logic for proposals
  const startEdit = (proposal) => {
    setEditingId(proposal.proposal_id);
    setEditForm({
      collegeCode: proposal.college_code,
      proposalCode: proposal.proposal_code,
      issueDate: proposal.issue_date ? proposal.issue_date.slice(0, 10) : '',
      quotedPrice: proposal.quoted_price,
      duration: proposal.duration,
      fromDate: proposal.from_date ? proposal.from_date.slice(0, 10) : '',
      toDate: proposal.to_date ? proposal.to_date.slice(0, 10) : '',
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProposal = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/college/proposal/${editingId}`, {
        ...editForm,
        lastUpdated: new Date().toISOString(),
      });
      if (res.data.status !== 'success') throw new Error(res.data.message);
      await fetchProposals();
      setEditingId(null);
      toast.success('Proposal updated!');
    } catch (err) {
      toast.error(err.message || 'Error updating proposal');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

const handleDeleteService = async (proposalId, serviceId) => {
    if (!window.confirm('Are you sure you want to remove this service?')) return;
    
    try {
      await api.delete(`/college/proposal/${proposalId}/service/${serviceId}`);
      
      // Update UI without refetching
      setProposalServices(prev => ({
        ...prev,
        [proposalId]: (prev[proposalId] || []).filter(s => s.service_id != serviceId)
      }));
      
      toast.success('Service removed successfully!');
    } catch (err) {
      toast.error(`Failed to remove service: ${err.message}`);
    }
};
  
  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Proposal Management Portal</h1>

      {/* Add Proposal Form */}
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
        <h2 className="text-lg font-semibold text-[#4f378a]">Add New Proposal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="collegeCode" placeholder="College Code" value={form.collegeCode} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="proposalCode" placeholder="Proposal Code" value={form.proposalCode} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="issueDate" type="date" placeholder="Issue Date" value={form.issueDate} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="quotedPrice" placeholder="Quoted Price" value={form.quotedPrice} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="duration" placeholder="Duration (months)" value={form.duration} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="fromDate" type="date" placeholder="From Date" value={form.fromDate} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="toDate" type="date" placeholder="To Date" value={form.toDate} onChange={handleFormChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={handleAddProposal} className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700" disabled={loading}>
          {loading ? 'Adding...' : 'Add Proposal'}
        </button>
      </div>

      {/* Add Service to Proposal */}
    <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
        <h2 className="text-lg font-semibold text-[#4f378a]">Add Service to Proposal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select 
            name="proposalCode"
            value={serviceForm.proposalCode}
            onChange={handleServiceFormChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select Proposal Code</option>
            {proposals.map(proposal => (
              <option key={proposal.proposal_id} value={proposal.proposal_code}>
                {proposal.proposal_code}
              </option>
            ))}
          </select>
          
          <select 
            name="serviceId"
            value={serviceForm.serviceId}
            onChange={handleServiceFormChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select Service</option>
            {services.map(service => (
              <option key={service.service_id} value={service.service_id}>
                {service.service_name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleAddService}
            className="px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
            disabled={serviceLoading}
          >
            {serviceLoading ? 'Adding...' : 'Add Service'}
          </button>
        </div>
      </div>




      {/* Proposals Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4 text-[#4f378a]">Proposal Entries</h3>
        <table className="w-full text-sm border-collapse">
          <thead className="text-gray-600 bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">College Code</th>
              <th className="p-2 text-left">Proposal Code</th>
              <th className="p-2 text-left">Issue Date</th>
              <th className="p-2 text-left">Quoted Price</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Services</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) =>
              editingId === proposal.proposal_id ? (
                <tr key={proposal.proposal_id} className="bg-yellow-50">
                  <td className="p-2"><input name="collegeCode" value={editForm.collegeCode} onChange={handleEditChange} className="border px-2 py-1 rounded" /></td>
                  <td className="p-2"><input name="proposalCode" value={editForm.proposalCode} onChange={handleEditChange} className="border px-2 py-1 rounded" /></td>
                  <td className="p-2"><input name="issueDate" type="date" value={editForm.issueDate} onChange={handleEditChange} className="border px-2 py-1 rounded" /></td>
                  <td className="p-2"><input name="quotedPrice" value={editForm.quotedPrice} onChange={handleEditChange} className="border px-2 py-1 rounded" /></td>
                  <td className="p-2"><input name="duration" value={editForm.duration} onChange={handleEditChange} className="border px-2 py-1 rounded" /></td>
                  <td className="p-2">
                    <button 
                      onClick={() => fetchServicesForProposal(proposal.proposal_id)}
                      className="text-xs text-blue-600 underline"
                    >
                      Refresh Services
                    </button>
                  </td>
                  <td className="p-2">
                    <button onClick={handleUpdateProposal} className="text-green-600 mr-2">Save</button>
                    <button onClick={handleCancelEdit} className="text-gray-500">Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={proposal.proposal_id} className="hover:bg-gray-50 border-t">
                  <td className="p-2">{proposal.college_code}</td>
                  <td className="p-2">{proposal.proposal_code}</td>
                  <td className="p-2">{proposal.issue_date ? proposal.issue_date.slice(0, 10) : ''}</td>
                  <td className="p-2">{proposal.quoted_price}</td>
                  <td className="p-2">{proposal.duration}</td>
                  <td className="p-2">
                    <div className="max-w-xs text-left">
                         {(proposalServices[proposal.proposal_id] || []).map(service => (
                        <li key={service.service_id} className="truncate flex justify-between items-center">
                          <span className="flex-grow">{service.service_name}</span>
                          <button 
                            onClick={() => handleDeleteService(proposal.proposal_id, service.service_id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                            title="Remove service"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </div>
                  </td>
                  <td className="p-2">
                    <button onClick={() => startEdit(proposal)} className="text-blue-600">Edit</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalData;
