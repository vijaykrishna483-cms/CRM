import React, { useEffect, useState } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
import usePageAccess from '../../components/useAccessPage';

const ProposalPlan = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("proposalplaneditordownload");

  const [planInfo, setPlanInfo] = useState({
    planName: '',
    planCode: '',
    duration: '',
    zipfileLink: '',
    services: []
  });

  const [serviceData, setServiceData] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [open, setOpen] = useState(true);

  // Fetch existing plans with services
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const plansRes = await api.get(`/college/plans`);
      // Ensure each plan has a services array
      const plansWithServices = (plansRes.data.data || []).map(plan => ({
        ...plan,
        services: plan.services || []
      }));
      setServiceData(plansWithServices);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to fetch plans.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available services
  const fetchServices = async () => {
    try {
      const servicesRes = await api.get(`/college/getservices`);
      setAvailableServices(servicesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services.');
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchServices();
  }, []);

  const handlePlanChange = (e) => {
    setPlanInfo({ ...planInfo, [e.target.name]: e.target.value });
  };

  // Checkbox selection for services
  const handleServiceCheckbox = (serviceId) => {
    setPlanInfo(prev => {
      const exists = prev.services.includes(serviceId);
      return {
        ...prev,
        services: exists
          ? prev.services.filter(id => id !== serviceId)
          : [...prev.services, serviceId]
      };
    });
  };

  const handleAddPlan = async () => {
    if (!planInfo.planName || !planInfo.planCode || !planInfo.duration) {
      toast.info('Plan name, code, and duration are required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/college/plans`, {
        plan_name: planInfo.planName,
        plan_code: planInfo.planCode,
        duration: parseInt(planInfo.duration),
        zipfile_link: planInfo.zipfileLink || null,
        services: planInfo.services
      });

      if (res.data.status !== 'success') throw new Error(res.data.message);

      await fetchPlans();
      setPlanInfo({
        planName: '',
        planCode: '',
        duration: '',
        zipfileLink: '',
        services: []
      });

      toast.success('Plan added successfully!');
    } catch (error) {
      toast.error(error.message || 'Error adding plan');
    } finally {
      setLoading(false);
    }
  };

  // Filter plans based on search term
  const filteredPlans = serviceData.filter(plan => {
    const searchLower = searchTerm.toLowerCase();
    return (
      plan.plan_code.toLowerCase().includes(searchLower) ||
      plan.plan_name.toLowerCase().includes(searchLower) ||
      (plan.services && plan.services.some(service =>
        service.service_name.toLowerCase().includes(searchLower) ||
        service.service_code.toLowerCase().includes(searchLower)
      ))
    );
  });

  // Filter available services based on the service search bar
  const filteredAvailableServices = availableServices.filter(service =>
    service.service_name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    service.service_code.toLowerCase().includes(serviceSearch.toLowerCase())
  );

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
    <div className="w-full min-h-screen bg-white px-6 sm:px-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#4f378a]">
        Proposal Plan Information Portal
      </h1>

      <div className="flex flex-wrap gap-4 bg-transparent justify-center  rounded-2xl px-4 py-2 mb-8">
        <button
          onClick={() => setOpen(true)}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
            ${open
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
            ${open
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
      </div>

      {open ? (
        <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
          <h2 className="text-lg font-semibold text-[#4f378a]">Add New Plan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col text-left">
              <label htmlFor="planName" className="mb-1 text-sm font-medium text-gray-700">
                Plan Name
              </label>
              <input
                id="planName"
                name="planName"
                placeholder="Plan Name"
                value={planInfo.planName}
                onChange={handlePlanChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col text-left">
              <label htmlFor="planCode" className="mb-1 text-sm font-medium text-gray-700">
                Plan Code
              </label>
              <input
                id="planCode"
                name="planCode"
                placeholder="Plan Code"
                value={planInfo.planCode}
                onChange={handlePlanChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col text-left">
              <label htmlFor="duration" className="mb-1 text-sm font-medium text-gray-700">
                Duration (days)*
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                placeholder="Duration in days"
                value={planInfo.duration}
                onChange={handlePlanChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="flex flex-col text-left">
              <label htmlFor="zipfileLink" className="mb-1 text-sm font-medium text-gray-700">
                Zipfile Link
              </label>
              <input
                id="zipfileLink"
                name="zipfileLink"
                placeholder="https://example.com/plan.zip"
                value={planInfo.zipfileLink}
                onChange={handlePlanChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Services selection with search and checkboxes */}
          <div className="flex flex-col text-left">
            <label htmlFor="services" className="mb-1 text-sm font-medium text-gray-700">
              Services
            </label>
            <input
              type="text"
              placeholder="Search services..."
              value={serviceSearch}
              onChange={e => setServiceSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
            />
            <div className="max-h-40 overflow-y-auto border rounded-lg p-2 bg-white">
              {filteredAvailableServices.length === 0 ? (
                <div className="text-xs text-gray-400">No services found</div>
              ) : (
                filteredAvailableServices.map(service => (
                  <label key={service.service_id} className="flex items-center mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planInfo.services.includes(service.service_id)}
                      onChange={() => handleServiceCheckbox(service.service_id)}
                      className="mr-2"
                    />
                    <span>
                      {service.service_name} <span className="text-gray-400 text-xs">({service.service_code})</span>
                    </span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {planInfo.services.length} service(s) selected
            </p>
          </div>

{/* Selected Services Display */}
{planInfo.services.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-2">
    {planInfo.services.map(serviceId => {
      const service = availableServices.find(s => s.service_id === serviceId);
      if (!service) return null;
      return (
        <span
          key={serviceId}
          className="bg-purple-200 text-purple-900 text-xs px-2 py-1 rounded flex items-center gap-1"
        >
          {service.service_name}
          <button
            type="button"
            onClick={() => handleServiceCheckbox(serviceId)}
            className="ml-1 text-purple-700 hover:text-purple-900 font-bold"
            title="Remove"
          >
            ×
          </button>
        </span>
      );
    })}
  </div>
)}


          <button
            onClick={handleAddPlan}
            className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Plan'}
          </button>
        </div> 

      ) : (
        <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-[#4f378a]">Existing Plans</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search plans or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm pl-8"
              />
              <svg
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

       <table className="w-full text-sm border-collapse border border-gray-300">
  <thead className="text-gray-600 bg-gray-100 border-b">
    <tr>
      <th className="p-2 text-left border border-gray-300">Plan Code</th>
      <th className="p-2 text-left border border-gray-300">Plan Name</th>
      <th className="p-2 text-left border border-gray-300">Duration (days)</th>
      <th className="p-2 text-left border border-gray-300">Services</th>
      <th className="p-2 text-left border border-gray-300">Zipfile</th>
    </tr>
  </thead>
  <tbody>
    {filteredPlans.map(plan => (
      <tr key={plan.plan_id} className="hover:bg-gray-50 border-t">
        <td className="p-2 text-red-500 text-left border border-gray-300">{plan.plan_code}</td>
        <td className="p-2 text-left border border-gray-300">{plan.plan_name}</td>
        <td className="p-2 text-left border border-gray-300">{plan.duration}</td>
        <td className="p-2 text-left border border-gray-300">
          {plan.services && plan.services.length > 0 ? (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {plan.services.map(service => (
                <span
                  key={service.service_id}
                  className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                >
                  {service.service_name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">No services</span>
          )}
        </td>
        <td className="p-2 text-left border border-gray-300">
          {plan.zipfile_link ? (
            <a
              href={plan.zipfile_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              Download
            </a>
          ) : 'N/A'}
        </td>
      </tr>
    ))}
  </tbody>
</table>

          {filteredPlans.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No plans found matching your search
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProposalPlan;
