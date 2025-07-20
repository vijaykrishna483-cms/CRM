import React, { useState, useEffect } from "react";
import api from "../../../libs/apiCall";
import { toast } from "react-toastify";

const Handover = () => {
  const [proposals, setProposals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    fetchProposals();
    fetchEmployees();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/college/getproposals");
      setProposals(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employee");
      setEmployeeData(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch employees.");
    } finally {
      setLoading(false);
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
      status: proposal.status || "pending",
      employee_id: proposal.employee_id || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProposal = async () => {
    if (!editingId) {
      toast.error("No proposal selected for editing.");
      return;
    }

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

  const filteredProposals = proposals.filter((proposal) =>
    proposal.proposal_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen px-6 sm:px-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by Proposal Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
          />
        </div>

        {/* Proposal List */}
        {filteredProposals.map((proposal) => (
          <div
            key={proposal.proposal_id}
            className="border border-gray-300 p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold text-gray-700">
                {proposal.proposal_code}
              </h2>
              <p className="text-sm text-gray-500">
                Status: {proposal.status}{" "}
                {proposal.employee_id && (
                  <>
                    | Assigned to: {proposal.employee_id}
                  </>
                )}
              </p>
            </div>
            <button
              onClick={() => startEdit(proposal)}
              className="text-sm bg-purple-200 hover:bg-purple-300 px-3 py-1 rounded-full"
            >
              Handover
            </button>
          </div>
        ))}

        {/* Edit Form */}
        {editingId && (
          <div className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-[#4f378a]">Edit Proposal</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <input
                name="collegeCode"
                placeholder="College Code"
                value={editForm.collegeCode}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                name="proposalCode"
                placeholder="Proposal Code"
                value={editForm.proposalCode}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="date"
                name="issueDate"
                value={editForm.issueDate}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                name="quotedPrice"
                placeholder="Quoted Price"
                value={editForm.quotedPrice}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                name="duration"
                placeholder="Duration"
                value={editForm.duration}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="date"
                name="fromDate"
                value={editForm.fromDate}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="date"
                name="toDate"
                value={editForm.toDate}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="border border-gray-300 px-3 py-2 rounded text-sm"
              >
                <option value="pending">Pending</option>
                <option value="success">Success</option>
              </select>

              <select
                name="employee_id"
                value={editForm.employee_id || ""}
                onChange={handleEditChange}
                className="border border-gray-300 px-3 py-2 rounded text-sm"
              >
                <option value="">Select Employee</option>
                {employeeData.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleUpdateProposal}
              className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Proposal"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Handover;
