import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall";
import { toast } from "react-toastify";
import usePageAccess from "../../components/useAccessPage";
import Select from "react-select";

const Allocation = () => {
  const [proposals, setProposals] = useState([]);
  const [collegeData, setCollegeData] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [ratings, setRatings] = useState({});
  const [allServices, setAllServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(true);

  const { allowed, loading: permissionLoading } =
    usePageAccess("trainerallocation");
const proposalOptions = proposals.map((proposal) => ({
  value: proposal.proposal_id,
  label: proposal.proposal_code,
}));


  const options = allServices.map((service) => ({
    value: service,
    label: service,
  }));

  // 1. Fetch proposals, colleges, trainers, allocations, ratings
  useEffect(() => {
    fetchProposals();
    fetchColleges();
    fetchTrainers();
    fetchAllocations();
    fetchRatings();
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

  const fetchColleges = async () => {
    try {
      const res = await api.get("/college/getall");
      setCollegeData(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch colleges");
    }
  };

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trainer/getAllTrainers");
      const trainersData = res.data?.data || [];
      setTrainers(trainersData);
      setFilteredTrainers(trainersData);
      // Extract unique services
      const services = new Set();
      trainersData.forEach((trainer) => {
        trainer.services?.forEach((service) => {
          services.add(service.service_name);
        });
      });
      setAllServices(Array.from(services));
    } catch {
      toast.error("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/college/alloted");
      setAllocations(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch trainer allocations");
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await api.get("/trainer/allreviews");
      const reviews = res.data || [];
      // Calculate average ratings per trainer
      const ratingsData = {};
      reviews.forEach((review) => {
        if (!ratingsData[review.trainer_id]) {
          ratingsData[review.trainer_id] = {
            total: 0,
            count: 0,
          };
        }
        ratingsData[review.trainer_id].total += review.trainer_star_rating;
        ratingsData[review.trainer_id].count++;
      });
      // Calculate averages
      const averages = {};
      Object.keys(ratingsData).forEach((trainerId) => {
        averages[trainerId] = (
          ratingsData[trainerId].total / ratingsData[trainerId].count
        ).toFixed(1);
      });
      setRatings(averages);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  // 2. Filtering and grouping logic for allocations
  const filteredAllocations = allocations.filter(
    (allocation) =>
      (allocation.trainer_name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (allocation.proposal_code?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  const groupedAllocations = filteredAllocations.reduce(
    (groups, allocation) => {
      const key = allocation.proposal_code;
      if (!groups[key]) groups[key] = [];
      groups[key].push(allocation);
      return groups;
    },
    {}
  );

  // 3. Map proposal_code to college_name
  const collegeCodeToName = {};
  collegeData.forEach((c) => {
    collegeCodeToName[c.college_code] = c.college_name;
  });
  const proposalToCollegeName = {};
  proposals.forEach((p) => {
    proposalToCollegeName[p.proposal_code] =
      collegeCodeToName[p.college_code] || "Unknown College";
  });

  // 4. Trainer filtering logic
  const handleLocationSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setLocationSearch(searchTerm);
    if (!searchTerm) {
      setFilteredTrainers(trainers);
      return;
    }
    const results = trainers.filter((trainer) =>
      trainer.location?.toLowerCase().includes(searchTerm)
    );
    setFilteredTrainers(results);
  };
  const handleServiceFilter = (selectedOption) => {
    const service = selectedOption ? selectedOption.value : "";
    setServiceFilter(service);
    if (!service) {
      setFilteredTrainers(trainers);
      return;
    }
    const results = trainers.filter((trainer) =>
      trainer.services?.some((s) => s.service_name === service)
    );
    setFilteredTrainers(results);
  };

  // 5. Add trainer to proposal
  const handleAddTrainer = async (trainerId) => {
    if (!selectedProposal) {
      toast.info("Please select a proposal first");
      return;
    }
    setLoading(true);
    try {
      await api.post("/college/addTrainer", {
        proposal_id: selectedProposal,
        trainer_id: trainerId,
      });
      setSuccessMessage(`Trainer added to proposal successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchAllocations();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error adding trainer to proposal"
      );
    } finally {
      setLoading(false);
    }
  };

  // 6. Remove trainer from visible trainers
  const [visibleTrainers, setVisibleTrainers] = useState([]);
  useEffect(() => {
    setVisibleTrainers(filteredTrainers);
  }, [filteredTrainers]);
  const removeTrainer = (trainerId) => {
    setVisibleTrainers((prev) =>
      prev.filter((trainer) => trainer.trainer_id !== trainerId)
    );
  };
const handleDeleteAllocation = async (proposal_id, trainer_id) => {
  if (!window.confirm('Are you sure you want to delete this allocation?')) return;

  try {
    const response = await api.delete('/college/deleteAllocation', {
      data: { proposal_id, trainer_id }, // Use 'data' for DELETE payload in axios
    });

    if (response.data.status === 'success') {
      alert(response.data.message);
      // Refresh or update your allocations state here
      fetchAllocations();
    } else {
      alert(response.data.message || 'Failed to delete allocation');
    }
  } catch (error) {
    console.error('Error deleting allocation:', error);
    alert(error.response?.data?.message || 'Error deleting allocation');
  }
};


  const refreshTrainers = () => {
    setVisibleTrainers(filteredTrainers);
  };

  if (!allowed && !permissionLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center bg-white px-8 py-10 ">
          <svg
            className="w-14 h-14 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="#fee2e2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9l-6 6m0-6l6 6"
              stroke="red"
              strokeWidth="2"
            />
          </svg>
          <h2 className="text-2xl font-bold text-[#6750a4] mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 text-center mb-4">
            You do not have permission to view this page.
            <br />
            Please contact the administrator if you believe this is a mistake.
          </p>
          <button
            className="mt-2 px-5 py-2 rounded-lg bg-[#6750a4] text-white font-semibold hover:bg-[#01291f] transition"
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  if (permissionLoading) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 ">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#4f378a]">
        Trainer Allocation
      </h1>

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
          Allot Trainers
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
          View Allocations
        </button>
      </div>

      {open ? (
        <>
          {/* Proposal Selection */}
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">
              Select Proposal
            </h2>

<Select
  value={proposalOptions.find(option => option.value === selectedProposal)}
  onChange={option => setSelectedProposal(option ? option.value : '')}
  options={proposalOptions}
  placeholder="Select a proposal"
  className="w-full text-left mb-4"
  classNamePrefix="react-select"
/>

          </div>

          {/* Filters Section */}
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">
              Filter Trainers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <Select
                  className="w-full text-sm"
                  options={options}
                  value={
                    options.find((opt) => opt.value === serviceFilter) || null
                  }
                  onChange={handleServiceFilter}
                  isClearable
                  placeholder="All Services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (State)
                </label>
                <input
                  type="text"
                  placeholder="Enter location (e.g., New York)"
                  value={locationSearch}
                  onChange={handleLocationSearch}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {successMessage && (
            <div className="max-w-3xl mx-auto mb-6 p-3 bg-green-100 text-green-800 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Available Trainers */}
          <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-[#4f378a]">
                Available Trainers {locationSearch && `in ${locationSearch}`}
                {serviceFilter && ` offering ${serviceFilter}`}
              </h3>
              <button
                onClick={refreshTrainers}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Refresh Trainers
              </button>
            </div>
            {loading ? (
              <p className="text-center py-4">Loading trainers...</p>
            ) : visibleTrainers.length === 0 ? (
              <p className="text-center py-4 text-gray-400">
                {locationSearch || serviceFilter
                  ? `No trainers found matching your criteria`
                  : "Enter filters to search for trainers"}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleTrainers.map((trainer) => (
                  <div
                    key={trainer.trainer_id}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[#4f378a] font-semibold">
                        {trainer.trainer_name}
                      </h4>
                      <button
                        onClick={() => removeTrainer(trainer.trainer_id)}
                        className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded"
                        title="Remove from view"
                      >
                        ✖
                      </button>
                    </div>
                    <p>
                      <strong>Address:</strong> {trainer.address_line3}
                    </p>
                    <p>
                      <strong>State:</strong> {trainer.location}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          trainer.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {trainer.status}
                      </span>
                    </p>
                    <p>
                      <strong>Rating:</strong>{" "}
                      {ratings[trainer.trainer_id] || "N/A"}
                    </p>
                    <p>
                      <strong>Contact:</strong> {trainer.contact_number}
                    </p>
                    <p>
                      <strong>Email:</strong> {trainer.email}
                    </p>
                    <p>
                      <strong>Charge:</strong> ₹{trainer.charge}/session
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {trainer.services?.map((service, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {service.service_name}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAddTrainer(trainer.trainer_id)}
                      className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-xs text-gray-700"
                      disabled={loading}
                    >
                      Add to Proposal
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <input
              type="text"
              placeholder="Search by trainer name or proposal code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-xs"
            />
          </div>
          <div className="bg-white mb-10 p-4 rounded-xl shadow-sm border overflow-x-auto h-[400px] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#4f378a]">
                All Trainer Allocations
              </h2>
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
              <>
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead className="text-gray-600 bg-gray-100 border-b">
                    <tr>
                      <th className="p-2 text-left border border-gray-300">
                        Proposal Code
                      </th>
                      <th className="p-2 text-left border border-gray-300">
                        College Name
                      </th>
                      <th className="p-2 text-left border border-gray-300">
                        Trainer ID
                      </th>
                      <th className="p-2 text-left border border-gray-300">
                        Trainer Name
                      </th>
                      <th className="p-2 text-left border border-gray-300">
                        State
                      </th>
                      <th className="p-2 text-left border border-gray-300">
                        Status
                      </th>
                      <th className="p-2 text-left border border-gray-300">
                        Contact
                      </th>
                      <th className="p-2 text-left border border-gray-300">
                        Email
                      </th>
                      <th className="p-2 text-left border border-gray-300">
                        Charge
                      </th>
                        <th className="p-2 text-left border border-gray-300">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedAllocations).map(
                      ([proposalCode, group]) => (
                        <React.Fragment key={proposalCode}>
                          <tr className="bg-gray-200 font-semibold text-left">
                            <td
                              className="p-2 border border-gray-300"
                              colSpan={10}
                            >
                              Proposal Code: {proposalCode} ({group.length}{" "}
                              allocations)
                            </td>
                          </tr>
                          {group.map((allocation) => (
                            <tr
                              key={`${allocation.proposal_id}-${allocation.trainer_id}`}
                              className="hover:bg-gray-50 border-t text-left"
                            >
                              <td className="p-2 border border-gray-300">
                                {allocation.proposal_code}
                              </td>
                              <td className="p-2 border border-gray-300">
                                {proposalToCollegeName[
                                  allocation.proposal_code
                                ] || "Unknown College"}
                              </td>
                              <td className="p-2 border border-gray-300">
                                {allocation.trainer_id}
                              </td>
                              <td className="p-2 border border-gray-300">
                                {allocation.trainer_name}
                              </td>
                              <td className="p-2 border border-gray-300">
                                {allocation.location}
                              </td>
                              <td className="p-2 border border-gray-300">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    allocation.status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {allocation.status}
                                </span>
                              </td>
                              <td className="p-2 border border-gray-300">
                                {allocation.contact_number}
                              </td>
                              <td className="p-2 border border-gray-300">
                                {allocation.email}
                              </td>
                              <td className="p-2 border border-gray-300">
                                ₹{allocation.charge}
                              </td>

  <td className="p-2 border border-gray-300">
    <button
      onClick={() => handleDeleteAllocation(allocation.proposal_id, allocation.trainer_id)}
      className="text-red-600 hover:text-red-800"
      title="Delete Allocation"
    >
      Delete
    </button>
  </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      )
                    )}
                    {filteredAllocations.length === 0 && (
                      <tr>
                        <td
                          colSpan="10"
                          className="p-2 text-center text-gray-400 border border-gray-300"
                        >
                          No allocations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Allocation;
