import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const ExamBatchUpdation = () => {
  const [mappings, setMappings] = useState([]);
  const [formData, setFormData] = useState({
    exam_id: '',
    college_code: '',
    college_batch: ''
  });
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetchMappings();
    fetchColleges();
  }, []);

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/exam/collegelist');
      setMappings(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch mappings');
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      const res = await api.get('/college/getall'); // Use your college list endpoint
      setColleges(res.data.data || []); // Adjusted for response structure
    } catch (err) {
      console.error("Failed to fetch colleges");
      toast.error('Failed to load college data');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/exam/addcollege', formData);
       toast.success('Mapping added successfully!');
      setFormData({ exam_id: '', college_code: '', college_batch: '' });
      await fetchMappings();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error adding mapping');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mapping?')) return;
    setLoading(true);
    try {
      await api.delete(`/exam/deletecollege/${id}`);
      await fetchMappings();
       toast.success('Mapping deleted successfully');
    } catch (err) {
       toast.error('Error deleting mapping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Exam Batch Updation</h1>

      {/* Add Mapping Form */}
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">Add New Mapping</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Exam ID</label>
            <input
              name="exam_id"
              placeholder="Exam ID"
              value={formData.exam_id}
              onChange={e => setFormData({ ...formData, exam_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">College</label>
            <select
              name="college_code"
              value={formData.college_code}
              onChange={e => setFormData({ ...formData, college_code: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select College</option>
              {colleges.map(college => (
                <option key={college.college_id} value={college.college_code}>
                  {college.college_code} - {college.college_name}
                </option>
              ))}
            </select>
          </div>
          
          <input
            type="number"
            name="college_batch"
            placeholder="Batch (e.g., 2023)"
            value={formData.college_batch}
            onChange={e => setFormData({ ...formData, college_batch: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Mapping'}
        </button>
      </div>

      {/* Mappings Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-[#4f378a]">Existing Mappings</h3>
          <button 
            onClick={fetchMappings}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Refresh
          </button>
        </div>
        
        {loading ? (
          <p className="text-center py-4">Loading mappings...</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="text-gray-600 bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">Exam ID</th>
                <th className="p-2 text-left">College Code</th>
                <th className="p-2 text-left">College Name</th>
                <th className="p-2 text-left">Batch</th>
                <th className="p-2 text-left">Categories</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map(mapping => (
                <tr key={mapping.id} className="hover:bg-gray-50 border-t">
                  <td className="p-2">{mapping.exam_id}</td>
                  <td className="p-2">{mapping.college_code}</td>
                  <td className="p-2">{mapping.college_name}</td>
                  <td className="p-2">{mapping.college_batch}</td>
                  <td className="p-2 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {(mapping.exam_categories || []).map((cat, idx) => (
                        <span 
                          key={idx} 
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2">
                    <button 
                      onClick={() => handleDelete(mapping.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {mappings.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-2 text-center text-gray-400">
                    No mappings found
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

export default ExamBatchUpdation;
