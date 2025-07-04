import React, { useEffect, useState } from "react";
import usePageAccess from "../../../components/useAccessPage";
import { toast } from 'react-toastify';
import api from "../../../libs/apiCall";
const ServiceView = () => {
  const { allowed, loading: permissionLoading } =
    usePageAccess("servicedataview");

  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesRes = await api.get(`/college/getservices`);
      const services = servicesRes.data.data || [];
      setServiceData(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, []);

  const filteredServices = serviceData.filter(
    (service) =>
      service.service_name.toLowerCase().includes(filter.toLowerCase()) ||
      service.service_code.toLowerCase().includes(filter.toLowerCase())
  );

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
    <div>
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4 text-[#4f378a]">Services</h3>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Filter by name or code"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
          />
        </div>
        <table className="w-full text-sm border-collapse">
          <thead className="text-gray-600 bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">Service Code</th>
              <th className="p-2 text-left">Service</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr
                className="hover:bg-gray-50 border-t"
                key={service.service_id}
              >
                <td className="p-2 text-red-500 text-left">
                  {service.service_code}
                </td>
                <td className="p-2 text-left">{service.service_name}</td>
              </tr>
            ))}
            {filteredServices.length === 0 && (
              <tr>
                <td colSpan={2} className="p-2 text-center text-gray-500">
                  No services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceView;
