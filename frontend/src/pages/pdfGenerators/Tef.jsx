import React, { useState, useEffect } from 'react';
import usePageAccess from '../../components/useAccessPage';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import api from '../../libs/apiCall';
import Select from 'react-select';

const Tef = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("tefgenerator");

  const [form, setForm] = useState({
    collegeName: '',
    collegeAddress: '',
    trainingDates: '',
    trainingDuration: '',
    domain: '',
    mode: '',
    remuneration: '',
    toMail: ''
  });

  const [proposals, setProposals] = useState([]);
  const [proposalServices, setProposalServices] = useState({});
  const [selectedProposalId, setSelectedProposalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);

  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/college/getproposals");
      const proposalsList = res.data.data || [];
      setProposals(proposalsList);
      const initialServices = {};
      proposalsList.forEach((proposal) => {
        initialServices[proposal.proposal_id] = [];
      });
      setProposalServices(initialServices);
    } catch (err) {
      toast.error("Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesForProposal = async (proposalId) => {
    setServiceLoading(true);
    try {
      const res = await api.get(`/college/services/${proposalId}`);
      setProposalServices((prev) => ({
        ...prev,
        [proposalId]: res.data.data || [],
      }));
    } catch (err) {
      toast.error("Failed to fetch services");
    } finally {
      setServiceLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your send mail logic here
    toast.success("Mail sent (demo)!");
  };

  if (!allowed && !permissionLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center bg-white px-8 py-10 rounded-lg shadow-md">
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

  if (permissionLoading)
    return <div className="flex justify-center items-center min-h-screen bg-gray-50">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] to-[#e0e7ff] flex flex-col">
      <Navbar />
      <div className="flex flex-1 justify-center items-center mt-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 my-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#6750a4]">Training Engagement Form</h2>

          {/* Proposal select input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Select Proposal ID</label>
       <Select
  className="mb-6"
  classNamePrefix="react-select"
  placeholder="Search & select proposal..."
  isClearable
  options={proposals.map((proposal) => ({
    value: proposal.proposal_id,
    label: proposal.proposal_code, // or whatever display text you prefer
  }))}
  value={
    selectedProposalId
      ? {
          value: selectedProposalId,
          label:
            proposals.find((p) => p.proposal_id === selectedProposalId)
              ?.proposal_code || '',
        }
      : null
  }
  onChange={(option) => {
    const proposalId = option ? option.value : '';
    setSelectedProposalId(proposalId);
    if (proposalId) fetchServicesForProposal(proposalId);
  }}
/>

          </div>

          {/* Display proposal plans */}
          {serviceLoading && <p>Loading proposal plans...</p>}
          {selectedProposalId && proposalServices[selectedProposalId] && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Proposal Plans</h3>
              {proposalServices[selectedProposalId].length === 0 ? (
                <p className="text-gray-500">No plans available for this proposal.</p>
              ) : (
           <ul className="flex flex-wrap gap-3">
  {proposalServices[selectedProposalId].map((service, idx) => (
    <li
      key={service.id || service.service_id || idx}
      className="
        bg-[#f3e8ff]
        text-gray-900
        rounded-md
        px-3 py-2
        text-sm
        border border-gray-200
        shadow-sm
        min-w-[120px]
        max-w-xs
        break-words
      "
    >
      {service.plan_name}
    </li>
  ))}
</ul>



              )}
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">College Name</label>
              <input
                name="collegeName"
                value={form.collegeName}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6750a4] transition"
                placeholder="Enter college name"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">College Address</label>
              <input
                name="collegeAddress"
                value={form.collegeAddress}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6750a4] transition"
                placeholder="Enter college address"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">Training Dates</label>
              <input
                name="trainingDates"
                value={form.trainingDates}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6750a4] transition"
                placeholder="e.g. 10th July - 20th July"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">Training Duration</label>
              <input
                name="trainingDuration"
                value={form.trainingDuration}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6750a4] transition"
                placeholder="e.g. 10 days"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">Domain</label>
              <input
                name="domain"
                value={form.domain}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6750a4] transition"
                placeholder="e.g. Computer Science"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">Mode</label>
              <input
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6750a4] transition"
                placeholder="e.g. Online/Offline"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">Remuneration</label>
              <input
                name="remuneration"
                value={form.remuneration}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6750a4] transition"
                placeholder="e.g. ₹10,000"
                required
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">To Mail</label>
              <input
                name="toMail"
                type="email"
                value={form.toMail}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6750a4] transition"
                placeholder="Recipient's email address"
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full mt-4 px-5 py-2 rounded-lg bg-[#6750a4] text-white font-semibold hover:bg-[#01291f] transition"
              >
                Send Mail
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tef;
