import React, { useState, useEffect } from "react";
import api from "../../../libs/apiCall";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import usePageAccess from "../../../components/useAccessPage";
import ProposalView from "./ProposalView";
import Select from 'react-select';



const ProposalEdit = () => {

   const { allowed, loading: permissionLoading } = usePageAccess("proposaldataedition");


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
    status: "",
  });

  const [services, setServices] = useState([]); // All available services

  const [serviceForm, setServiceForm] = useState({
    proposalCode: "",
    serviceName: "",
  });
  const [serviceLoading, setServiceLoading] = useState(false);
  const [proposalServices, setProposalServices] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProposals();
    fetchServices();
    fetchServicesForProposal(

      
    ); // Fetch all available services
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/college/plans");
      setServices(res.data.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
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

  const serviceOptions = services.map(service => ({
  value: service.plan_id,
  label: service.plan_name,
}));



  const handleAddService = async () => {
    const { proposalCode, serviceId } = serviceForm;

    if (!proposalCode || !serviceId) {
      toast.info("Please select a proposal and service");
      return;
    }

    // Find proposal ID by code
    const proposal = proposals.find((p) => p.proposal_code === proposalCode);
    if (!proposal) {
      toast.error("Proposal not found");
      return;
    }

    setServiceLoading(true);
    try {
      // Send proposalId and serviceId to backend
      const res = await api.post("/college/service", {
        proposalId: proposal.proposal_id,
        planId: serviceId,
      });

      if (res.data.status !== "success") throw new Error(res.data.message);

      const newService = services.find((s) => s.service_id == serviceId);
      if (newService) {
        setProposalServices((prev) => ({
          ...prev,
          [proposal.proposal_id]: [
            ...(prev[proposal.proposal_id] || []),
            newService,
          ],
        }));
      }
      await fetchServicesForProposal(proposal.proposal_id);
      setServiceForm({ proposalCode: "", serviceId: "" });
      toast.success("Service added successfully!");
    } catch (err) {
      toast.error(err.message || "Error adding service");
    } finally {
      setServiceLoading(false);
    }
  };

  // Fetch services for a specific proposal
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

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceFormChange = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

   const token = localStorage.getItem("token");



  const handleAddProposal = async () => {
    const {
      collegeCode,
      proposalCode,
      issueDate,
      quotedPrice,
      duration,
      fromDate,
      toDate,
      status,
    } = form;

    // Only validate required fields
    if (
      !collegeCode ||
      !proposalCode ||
      !issueDate ||
      !quotedPrice ||
      !duration
    ) {
      toast.info("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
   const res = await api.post(
  "/college/addproposal",
  {
    collegeCode,
    proposalCode,
    issueDate,
    quotedPrice,
    duration,
    fromDate: fromDate || null,
    toDate: toDate || null,
    status: status || "pending",
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);


      if (res.data.status !== "success") throw new Error(res.data.message);

      await fetchProposals();
      setForm({
        collegeCode: "",
        proposalCode: "",
        issueDate: "",
        quotedPrice: "",
        duration: "",
        fromDate: "",
        toDate: "",
        status: "", // reset status in form
      });

      toast.success("Proposal added successfully!");
    } catch (err) {
      toast.error(err.message || "Error adding proposal");
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
      issueDate: proposal.issue_date ? proposal.issue_date.slice(0, 10) : "",
      quotedPrice: proposal.quoted_price,
      duration: proposal.duration,
      fromDate: proposal.from_date ? proposal.from_date.slice(0, 10) : "",
      toDate: proposal.to_date ? proposal.to_date.slice(0, 10) : "",
      status: proposal.status || "pending",
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


  const [searchTerm, setSearchTerm] = useState("");

  // Filtering logic
 


  const proposalOptions = proposals.map((proposal) => ({
  value: proposal.proposal_code,
  label: proposal.proposal_code,
}));



  useEffect(() => {
    if (form.fromDate && form.duration) {
      const from = new Date(form.fromDate);
      // Parse duration as integer (in days)
      const days = parseInt(form.duration, 10);
      if (!isNaN(days) && days > 0) {
        // Add (days - 1) to fromDate to get inclusive range
        const to = new Date(from);
        to.setDate(from.getDate() + days - 1);
        // Format to yyyy-mm-dd for input
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
        // Calculate difference in days (inclusive)
        const diffTime = to.getTime() - from.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setForm((prev) => ({ ...prev, duration: diffDays.toString() }));
      }
    }
  }, [form.fromDate, form.toDate]);
  const [open, setOpen] = useState(true);
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
  

      {/* Add Proposal Form */}
{/* 
      <div className="flex flex-wrap gap-4 bg-transparent justify-center  rounded-2xl px-4 py-2 mb-8">
        <button
          onClick={() => setOpen(true)}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
    ${
      open
        ? "bg-[#6750a4] text-white shadow font-semibold scale-105"
        : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"
    }
  `}
          style={{
            minWidth: "140px",
            boxShadow: open ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          Add
        </button>

        <button
          onClick={() => setOpen(false)}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
    ${
      open
        ? "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"
        : "bg-[#6750a4] text-white shadow font-semibold scale-105"
    }
  `}
          style={{
            minWidth: "140px",
            boxShadow: open ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          View
        </button>
      </div> */}

      {open ? (
        <>
          <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
            <h2 className="text-lg font-semibold text-[#4f378a]">
              Add New Proposal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="flex flex-col">
                <label
                  htmlFor="collegeCode"
                  className="text-sm font-medium mb-1"
                >
                  College Code
                </label>
                <input
                  id="collegeCode"
                  name="collegeCode"
                  placeholder="College Code"
                  value={form.collegeCode}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="proposalCode"
                  className="text-sm font-medium mb-1"
                >
                  Proposal Code
                </label>
                <input
                  id="proposalCode"
                  name="proposalCode"
                  placeholder="Proposal Code"
                  value={form.proposalCode}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="issueDate" className="text-sm font-medium mb-1">
                  Issue Date
                </label>
                <input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  placeholder="Issue Date"
                  value={form.issueDate}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="quotedPrice"
                  className="text-sm font-medium mb-1"
                >
                  Quoted Price
                </label>
                <input
                  id="quotedPrice"
                  name="quotedPrice"
                  placeholder="Quoted Price"
                  value={form.quotedPrice}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="duration" className="text-sm font-medium mb-1">
                  Duration (days)
                </label>
                <input
                  id="duration"
                  name="duration"
                  placeholder="Duration (days)"
                  value={form.duration}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="fromDate" className="text-sm font-medium mb-1">
                  From Date
                </label>
                <input
                  id="fromDate"
                  name="fromDate"
                  type="date"
                  placeholder="From Date"
                  value={form.fromDate}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="toDate" className="text-sm font-medium mb-1">
                  To Date
                </label>
                <input
                  id="toDate"
                  name="toDate"
                  type="date"
                  placeholder="To Date"
                  value={form.toDate}
                  onChange={handleFormChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
{/* 
              <select
                name="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border border-gray-300 px-3 py-2 rounded"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
              </select> */}
            </div>

            <button
              onClick={handleAddProposal}
              className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Proposal"}
            </button>
          </div>

          {/* Add Service to Proposal */}
          <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
            <h2 className="text-lg font-semibold text-[#4f378a]">
              Add Plan to Proposal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

<Select
  name="proposalCode"
  value={proposalOptions.find(option => option.value === serviceForm.proposalCode)}
  onChange={selectedOption =>
    handleServiceFormChange({
      target: {
        name: 'proposalCode',
        value: selectedOption ? selectedOption.value : ''
      }
    })
  }
  options={proposalOptions}
  placeholder="Select Proposal Code"
  classNamePrefix="react-select"
/>



<Select
  name="serviceId"
  value={serviceOptions.find(option => option.value === serviceForm.serviceId)}
  onChange={selectedOption =>
    handleServiceFormChange({
      target: {
        name: 'serviceId',
        value: selectedOption ? selectedOption.value : ''
      }
    })
  }
  options={serviceOptions}
  placeholder="Select Plan"
  classNamePrefix="react-select"
/>


              <button
                onClick={handleAddService}
                className="p-1 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-md text-gray-700"
                disabled={serviceLoading}
              >
                {serviceLoading ? "Adding..." : "Add Plan"}
              </button>
            </div>
          </div>

          <ProposalView  showDetails={true}/>
        </>
      ) : (
        <>
        </>
      )}
    </div>
  );
};

export default ProposalEdit;
