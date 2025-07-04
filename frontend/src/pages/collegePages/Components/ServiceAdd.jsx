import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePageAccess from "../../../components/useAccessPage";
import { toast } from "react-toastify";
import api from "../../../libs/apiCall";

const ServiceAdd = () => {
  const navigate = useNavigate();
  const { allowed, loading: permissionLoading } = usePageAccess("servicedataedition");

  const [serviceInfo, setServiceInfo] = useState({
    serviceName: "",
    serviceCode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleServiceChange = (e) => {
    setServiceInfo({ ...serviceInfo, [e.target.name]: e.target.value });
  };

  const handleAddService = async () => {
    const { serviceName, serviceCode } = serviceInfo;

    if (!serviceName || !serviceCode) {
      toast.info("Please fill in all service details.");
      return;
    }

    if (serviceCode.length < 3) {
      toast.info("Service Code must be at least 3 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/college/addservice`, {
        serviceName,
        serviceCode,
      });

      if (res.data.status !== "success") throw new Error(res.data.message);

      setServiceInfo({ serviceName: "", serviceCode: "" });
      toast.success("Service added successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Error adding service");
    } finally {
      setLoading(false);
    }
  };

  if (permissionLoading) return <div>Loading...</div>;

  if (!allowed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center bg-white px-8 py-10">
          <svg
            className="w-14 h-14 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" fill="#fee2e2" />
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
            You do not have permission to view this page.
            <br />
            Please contact the administrator if you believe this is a mistake.
          </p>
          <button
            className="mt-2 px-5 py-2 rounded-lg bg-[#6750a4] text-white font-semibold hover:bg-[#01291f] transition"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
        <h2 className="text-lg font-semibold text-[#4f378a]">Add New Service</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col text-left">
            <label htmlFor="serviceName" className="mb-1 text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              placeholder="Service Name"
              value={serviceInfo.serviceName}
              onChange={handleServiceChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              aria-label="Service Name"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="serviceCode" className="mb-1 text-sm font-medium text-gray-700">
              Service Code
            </label>
            <input
              type="text"
              id="serviceCode"
              name="serviceCode"
              placeholder="Service Code"
              value={serviceInfo.serviceCode}
              onChange={handleServiceChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              aria-label="Service Code"
            />
          </div>
        </div>

        <button
          onClick={handleAddService}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading || !serviceInfo.serviceName || !serviceInfo.serviceCode}
        >
          {loading ? "Adding..." : "Add Service"}
        </button>
      </div>
    </div>
  );
};

export default ServiceAdd;
