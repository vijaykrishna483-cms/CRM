import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall";
import { toast } from "react-toastify";
import usePageAccess from "../../components/useAccessPage";

const TrainerData = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("trainerdataentry");

  const [trainerInfo, setTrainerInfo] = useState({
    trainer_id: "",
    trainer_name: "",
    aadhar_id: "",
    pan_id: "",
    contact_number: "",
    email: "",
    status: "Active",
    location: "",
    employment_type: "",
    charge: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    service_ids: [],
  });

  const [trainers, setTrainers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTrainers();
    fetchServices();
  }, []);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trainer/getAllTrainers");
      setTrainers(res.data?.data || []);
    } catch {
      toast.error("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get("/college/getservices");
      setServices(res.data?.data || []);
    } catch {
      console.error("Couldn't fetch services");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (serviceId) => {
    setTrainerInfo((prev) => {
      const exists = prev.service_ids.includes(serviceId);
      const updatedIds = exists
        ? prev.service_ids.filter((id) => id !== serviceId)
        : [...prev.service_ids, serviceId];
      return { ...prev, service_ids: updatedIds };
    });
  };

  const handleAddOrUpdate = async () => {
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/trainer/update/${editId}`, trainerInfo);
        toast.success("Trainer updated successfully!");
      } else {
        await api.post("/trainer/add", trainerInfo);
        toast.success("Trainer added successfully!");
      }
      resetForm();
      fetchTrainers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error saving trainer");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trainer) => {
    setTrainerInfo({
      trainer_id: trainer.trainer_id,
      trainer_name: trainer.trainer_name,
      aadhar_id: trainer.aadhar_id,
      pan_id: trainer.pan_id,
      contact_number: trainer.contact_number,
      email: trainer.email,
      status: trainer.status,
      location: trainer.location,
      address_line1: trainer.address_line1 || "",
      address_line2: trainer.address_line2 || "",
      address_line3: trainer.address_line3 || "",
      employment_type: trainer.employment_type,
      charge: trainer.charge,
      service_ids: trainer.services?.map((s) => s.service_id),
    });
    setEditId(trainer.trainer_id);
    setShowForm(true);
  };

  const resetForm = () => {
    setTrainerInfo({
      trainer_id: "",
      trainer_name: "",
      aadhar_id: "",
      pan_id: "",
      contact_number: "",
      email: "",
      status: "Active",
      location: "",
      employment_type: "",
      charge: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      service_ids: [],
    });
    setEditId(null);
    setShowForm(false);
  };

  if (permissionLoading) return <div>Loading...</div>;

  // If not allowed, only show the table, not the form or add button
  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#4f378a]">
          Trainer Management
        </h1>
        {allowed && (
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          >
            {showForm ? "Hide Form" : "Add New Trainer"}
          </button>
        )}
      </div>

      {allowed && showForm && (
        <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">
            {editId ? "Edit Trainer" : "Add New Trainer"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "trainer_id",
              "trainer_name",
              "aadhar_id",
              "pan_id",
              "contact_number",
              "email",
              "status",
              "location",
              "address_line1",
              "address_line2",
              "address_line3",
            ].map((field) => (
              <div key={field} className="flex flex-col">
                <label
                  htmlFor={field}
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  {field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  id={field}
                  name={field}
                  placeholder={field.replace(/_/g, " ").toUpperCase()}
                  value={trainerInfo[field]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={field === "trainer_id" && !!editId}
                />
              </div>
            ))}

            <div className="flex flex-col">
              <label
                htmlFor="charge"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Charge (₹)
              </label>
              <input
                type="number"
                id="charge"
                name="charge"
                placeholder="Charge (₹)"
                value={trainerInfo.charge}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="employment_type"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Employment Type
              </label>
              <select
                id="employment_type"
                name="employment_type"
                value={trainerInfo.employment_type}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Freelancer">Freelancer</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-medium mb-3 text-[#4f378a]">
              Select Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <div
                  key={service.service_id}
                  onClick={() => handleServiceChange(service.service_id)}
                  className={`px-4 py-2 rounded-full cursor-pointer text-sm ${
                    trainerInfo.service_ids.includes(service.service_id)
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {service.service_name}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Selected: {trainerInfo.service_ids.length} services
            </p>
          </div>

          <button
            onClick={handleAddOrUpdate}
            className="mt-6 px-5 py-2 bg-purple-500 hover:bg-purple-600 rounded-full font-medium text-sm text-white"
            disabled={loading}
          >
            {loading
              ? editId
                ? "Updating..."
                : "Adding..."
              : editId
              ? "Update Trainer"
              : "Add Trainer"}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-[#4f378a]">
            Trainer Entries
          </h3>
          <button
            onClick={fetchTrainers}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="text-center py-4">Loading trainers...</p>
        ) : (
         <table className="w-full text-sm table-fixed border-collapse">
  <thead className="text-gray-600 bg-gray-100 border-b">
    <tr>
      <th className="p-2 text-left w-[8%] whitespace-nowrap">ID</th>
      <th className="p-2 text-left w-[12%] whitespace-nowrap">Name</th>
      <th className="p-2 text-left w-[15%] whitespace-nowrap">Services</th>
      <th className="p-2 text-left w-[12%] whitespace-nowrap">Contact</th>
      <th className="p-2 text-left w-[15%] whitespace-nowrap">Email</th>
      <th className="p-2 text-left w-[10%] whitespace-nowrap">Employment Type</th>
      <th className="p-2 text-left w-[8%] whitespace-nowrap">Status</th>
      <th className="p-2 text-left w-[10%] whitespace-nowrap">Charge</th>
      <th className="p-2 text-left w-[10%] whitespace-nowrap">State</th>
      {allowed && <th className="p-2 text-left w-[10%] whitespace-nowrap">Actions</th>}
    </tr>
  </thead>
  <tbody>
    {trainers.map((trainer) => (
      <tr key={trainer.trainer_id} className="hover:bg-gray-50 border-t text-left">
        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{trainer.trainer_id}</td>
        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{trainer.trainer_name}</td>
       <td className="p-2">
  <div className="flex flex-wrap gap-1">
    {trainer.services?.map((service, idx) => (
      <span
        key={idx}
        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded whitespace-nowrap"
      >
        {service.service_name}
      </span>
    ))}
  </div>
</td>

        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{trainer.contact_number}</td>
        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{trainer.email}</td>
        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{trainer.employment_type}</td>
        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{trainer.status}</td>
        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">₹{trainer.charge}</td>
        <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">{trainer.location}</td>
        {allowed && (
          <td className="p-2 whitespace-nowrap overflow-hidden text-ellipsis">
            <button
              onClick={() => handleEdit(trainer)}
              className="text-blue-500 hover:text-blue-700 whitespace-nowrap"
            >
              Edit
            </button>
          </td>
        )}
      </tr>
    ))}
    {trainers.length === 0 && (
      <tr>
        <td colSpan={allowed ? "10" : "9"} className="p-2 text-center text-gray-400">
          No trainers found
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

export default TrainerData;
