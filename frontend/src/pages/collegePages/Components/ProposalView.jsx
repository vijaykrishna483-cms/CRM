import React, { useState, useEffect, useMemo } from "react";
import api from "../../../libs/apiCall";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import usePageAccess from '../../../components/useAccessPage';

const ProposalView = ({showDetails }) => {
  const { allowed, loading: permissionLoading } = usePageAccess("proposalplanviewdownload");

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    collegeCode: "",
    proposalCode: "",
    issueDate: "",
    quotedPrice: "",
    duration: "",
    fromDate: "",
    toDate: "",
  });

  const [serviceLoading, setServiceLoading] = useState(false);
  const [proposalServices, setProposalServices] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [collegeData, setCollegeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProposals();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchColleges();
  }, []);

  const collegeNameMap = useMemo(() => {
    const map = {};
    collegeData.forEach(college => {
      map[college.college_code] = college.college_name;
    });
    return map;
  }, [collegeData]);

  const fetchServices = async () => {
    try {
      await api.get("/college/plans");
    } catch (error) {
      toast.error("Failed to fetch services");
    }
  };

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/college/getproposals");
      const proposalsList = res.data.data || [];
      setProposals(proposalsList);
      const initialServices = {};
      proposalsList.forEach((proposal) => {
        initialServices[proposal.proposal_id] = [];
        fetchServicesForProposal(proposal.proposal_id);
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

  const startEdit = (proposal) => {
    setEditingId(proposal.proposal_id);
    setEditForm({
      collegeCode: proposal.college_code,
      proposalCode: proposal.proposal_code,
      issueDate: proposal.issue_date ? proposal.issue_date.slice(0, 10) : "",
      quotedPrice: proposal.quoted_price,
      duration: proposal.duration,
      fromDate: proposal.from_date ? proposal.from_date.slice(0, 10) : "",
      toDate: proposal.to_date ? proposal.to_date.slice(0, 10) : "",
      // status: proposal.status, // status is NOT editable
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
      if (res.data.status !== "success") throw new Error(res.data.message);
      await fetchProposals();
      setEditingId(null);
      toast.success("Proposal updated!");
    } catch (err) {
      toast.error(err.message || "Error updating proposal");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteService = async (proposalId, planId) => {
    if (!window.confirm("Are you sure you want to remove this service?")) return;
    try {
      await api.delete(`/college/proposal/${proposalId}/service/${planId}`);
      setProposalServices((prev) => ({
        ...prev,
        [proposalId]: (prev[proposalId] || []).filter((s) => s.plan_id !== planId),
      }));
      toast.success("Service removed successfully!");
    } catch (err) {
      toast.error(`Failed to remove service: ${err.message}`);
    }
  };

  const filteredProposals = proposals.filter((proposal) => {
    const collegeMatch =
      proposal.college_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collegeNameMap[proposal.college_code] || "").toLowerCase().includes(searchTerm.toLowerCase());
    const proposalMatch =
      proposal.proposal_code.toLowerCase().includes(searchTerm.toLowerCase());
    return collegeMatch || proposalMatch;
  });

  useEffect(() => {
    if (form.fromDate && form.duration) {
      const from = new Date(form.fromDate);
      const days = parseInt(form.duration, 10);
      if (!isNaN(days) && days > 0) {
        const to = new Date(from);
        to.setDate(from.getDate() + days - 1);
        const toDateStr = to.toISOString().slice(0, 10);
        setForm((prev) => ({ ...prev, toDate: toDateStr }));
      }
    }
  }, [form.fromDate, form.duration]);

  useEffect(() => {
    if (form.fromDate && form.toDate) {
      const from = new Date(form.fromDate);
      const to = new Date(form.toDate);
      if (to >= from) {
        const diffTime = to.getTime() - from.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setForm((prev) => ({ ...prev, duration: diffDays.toString() }));
      }
    }
  }, [form.fromDate, form.toDate]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const collegesRes = await api.get(`/college/getall`);
      const colleges = collegesRes.data.data || [];
      setCollegeData(colleges);
    } catch (error) {
      toast.error("Failed to fetch colleges.");
    } finally {
      setLoading(false);
    }
  };

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
    <div>
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4 text-[#4f378a]">
          Proposal Entries
        </h3>

        <input
          type="text"
          placeholder="Search by college name, code, or proposal code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" border border-gray-300 mb-4 rounded-lg px-3 py-2 text-sm w-full max-w-sm"
        />

        <table className="w-full text-sm border-collapse">
          <thead className="text-gray-600 bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">College Name</th>
              <th className="p-2 text-left">Proposal Code</th>
              <th className="p-2 text-left">Plans</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Status Date</th>
              <th className="p-2 text-left">Duration</th>
              <th className="p-2 text-left">Quoted Price</th>
              <th className="p-2 text-left">From</th>
              <th className="p-2 text-left">To</th>
            {showDetails && (      <th className="p-2 text-left">Actions</th> )}
            </tr>
          </thead>
          <tbody>
            {filteredProposals.map((proposal) =>
              editingId === proposal.proposal_id ? (
                <tr key={proposal.proposal_id} className="bg-yellow-50">
                  <td className="p-2">
                    <select
                      name="collegeCode"
                      value={editForm.collegeCode}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="">Select College</option>
                      {collegeData.map(college => (
                        <option key={college.college_code} value={college.college_code}>
                          {college.college_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      name="proposalCode"
                      value={editForm.proposalCode}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => fetchServicesForProposal(proposal.proposal_id)}
                      className="text-xs text-blue-600 underline"
                    >
                      Refresh Services
                    </button>
                  </td>
                  {/* Status: display as plain text, not editable */}
                  <td className="p-2">
                    {proposal.status}
                  </td>
                  <td className="p-2">
                    <input
                      name="issueDate"
                      type="date"
                      value={editForm.issueDate}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="duration"
                      value={editForm.duration}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="quotedPrice"
                      value={editForm.quotedPrice}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="fromDate"
                      type="date"
                      value={editForm.fromDate}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="toDate"
                      type="date"
                      value={editForm.toDate}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={handleUpdateProposal}
                      className="text-green-600 mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr
                  key={proposal.proposal_id}
                  className="hover:bg-gray-50 border-t text-left"
                >
                  <td className="p-2">
                    {collegeNameMap[proposal.college_code] || proposal.college_code}
                  </td>
                  <td className="p-2">{proposal.proposal_code}</td>
                  <td className="p-2">
                    <div className="max-w-xs text-left">
                      {(proposalServices[proposal.proposal_id] || []).map(
                        (service) => (
                          <li
                            key={service.plan_id}
                            className="truncate flex justify-between items-center"
                          >
                            <span className="flex-grow">
                              {service.plan_name}
                            </span>
                            <button
                              onClick={() =>
                                handleDeleteService(
                                  proposal.proposal_id,
                                  service.plan_id
                                )
                              }
                              className="ml-2 text-red-500 hover:text-red-700"
                              title="Remove service text-sm"
                            >
                              <MdDelete />
                            </button>
                          </li>
                        )
                      )}
                    </div>
                  </td>
                  <td className="p-2">{proposal.status}</td>
                  <td className="p-2">
                    {proposal.issue_date
                      ? proposal.issue_date.slice(0, 10)
                      : ""}
                  </td>
                  <td className="p-2">{proposal.duration}</td>
                  <td className="p-2">{proposal.quoted_price}</td>
                  <td className="p-2">
                    {new Date(proposal.from_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="p-2">
                    {new Date(proposal.to_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                 {showDetails && (   <td className="p-2">
                    <button
                      onClick={() => startEdit(proposal)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                  </td>
                  )} 
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalView;
