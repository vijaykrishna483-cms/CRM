import React, { useEffect, useState } from 'react'
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const ServiceData = () => {
      const [serviceInfo, setServiceInfo] = useState({
        serviceName: '',
        serviceCode: '',
      });


        const handleServiceChange = (e) => {
    setServiceInfo({ ...serviceInfo, [e.target.name]: e.target.value });
  };


  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
 

  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesRes = await api.get(`/college/getservices`);
      const services = servicesRes.data.data || [];

      setServiceData(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchServices();
    }, []);
  

  
  const handleAddService = async () => {
    if (!serviceInfo.serviceName || !serviceInfo.serviceCode) {
      toast.info('Please fill in all college details.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/college/addservice`, {
        serviceName: serviceInfo.serviceName,
        serviceCode: serviceInfo.serviceCode,
      });

      if (res.data.status !== 'success') throw new Error(res.data.message);

      await fetchServices();
      setServiceInfo({ serviceName: '', serviceCode: ''});

      toast.success('service added successfully!');
    } catch (error) {
      toast.error(error.message || 'Error adding service');
    } finally {
      setLoading(false);
    }
  };


  
  return (
      <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Service Information Portal</h1>
      

       <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
        <h2 className="text-lg font-semibold text-[#4f378a]">Add New Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="serviceName" placeholder="Service Name" value={serviceInfo.name} onChange={handleServiceChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="serviceCode" placeholder="Service Code" value={serviceInfo.code} onChange={handleServiceChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={handleAddService}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}>
          {loading ? 'Adding...' : 'Add Service'}
        </button>
      </div>










 <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4 text-[#4f378a]">Services</h3>
        <table className="w-full text-sm border-collapse">
          <thead className="text-gray-600 bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">Service Code</th>
              <th className="p-2 text-left">Service</th>
            </tr>
          </thead>
          <tbody>
            {serviceData.map((service) => (
              <React.Fragment key={service.service_id}>
                <tr className="hover:bg-gray-50 border-t">
                  <td className="p-2 text-red-500 text-left">{service.service_code}</td>
                  <td className="p-2  text-left">{service.service_name}</td>
                </tr>
               
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  )
}

export default ServiceData
