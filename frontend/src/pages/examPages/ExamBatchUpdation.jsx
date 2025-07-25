import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
import usePageAccess from '../../components/useAccessPage';

const ExamBatchUpdation = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("exambatchupdation");

  const [mappings, setMappings] = useState([]);
  const [formData, setFormData] = useState({
    exam_id: '',
    college_code: '',
    college_batch: '',
    date_of_issue: ''
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
      const res = await api.get('/college/getall');
      setColleges(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load college data');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/exam/addcollege', formData);
      toast.success('Mapping added successfully!');
      setFormData({ exam_id: '', college_code: '', college_batch: '', date_of_issue: '' });
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
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Exam Batch Updation</h1>

      {/* Add Mapping Form */}
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">Add New Mapping</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="exam_id" className="mb-1 text-sm font-medium text-gray-700">
              Exam ID
            </label>
            <input
              id="exam_id"
              name="exam_id"
              placeholder="Exam ID"
              value={formData.exam_id}
              onChange={e => setFormData({ ...formData, exam_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="college_code" className="mb-1 text-sm font-medium text-gray-700">
              College
            </label>
            <select
              id="college_code"
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
          <div className="flex flex-col">
            <label htmlFor="college_batch" className="mb-1 text-sm font-medium text-gray-700">
              Batch
            </label>
            <input
              id="college_batch"
              type="text"
              name="college_batch"
              placeholder="Batch (e.g., 2023)"
              value={formData.college_batch}
              onChange={e => setFormData({ ...formData, college_batch: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="date_of_issue" className="mb-1 text-sm font-medium text-gray-700">
              Date of Issue
            </label>
            <input
              id="date_of_issue"
              type="date"
              name="date_of_issue"
              placeholder="Date of Issue"
              value={formData.date_of_issue || ""}
              onChange={e => setFormData({ ...formData, date_of_issue: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2 bg-[#6750a4] hover:bg-[#4f378a] rounded-full font-medium text-sm text-white transition"
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
         <table className="w-full text-sm border-collapse border border-gray-300">
  <thead className="text-gray-600 bg-gray-100 border-b">
    <tr>
      <th className="p-2 text-left border border-gray-300">Exam ID</th>
      <th className="p-2 text-left border border-gray-300">College Code</th>
      <th className="p-2 text-left border border-gray-300">College Name</th>
      <th className="p-2 text-left border border-gray-300">Batch</th>
      <th className="p-2 text-left border border-gray-300">Date of Issue</th>
      <th className="p-2 text-left border border-gray-300">Categories</th>
      <th className="p-2 text-left border border-gray-300">Actions</th>
    </tr>
  </thead>
  <tbody>
    {mappings.map(mapping => (
      <tr key={mapping.id} className="hover:bg-gray-50 border-t">
        <td className="p-2 border border-gray-300">{mapping.exam_id}</td>
        <td className="p-2 border border-gray-300">{mapping.college_code}</td>
        <td className="p-2 border border-gray-300">{mapping.college_name}</td>
        <td className="p-2 border border-gray-300">{mapping.college_batch}</td>
        <td className="p-2 border border-gray-300">
          {mapping.date_of_issue ? new Date(mapping.date_of_issue).toLocaleDateString() : '-'}
        </td>
        <td className="p-2 max-w-xs border border-gray-300">
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
        <td className="p-2 border border-gray-300">
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
        <td colSpan="7" className="p-2 text-center text-gray-400 border border-gray-300">
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
