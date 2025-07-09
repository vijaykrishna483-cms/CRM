import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
import usePageAccess from '../../components/useAccessPage';

const ExamSearch = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("examsearch");

  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [examFilter, setExamFilter] = useState('');
  const [collegeNegationFilter, setCollegeNegationFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const examsRes = await api.get('/exam/getall');
      const examsData = examsRes.data || [];

      const collegesRes = await api.get('/exam/collegelist');
      const collegeData = collegesRes.data || [];

      const collegeMap = {};
      collegeData.forEach(mapping => {
        if (!collegeMap[mapping.exam_id]) {
          collegeMap[mapping.exam_id] = [];
        }
        collegeMap[mapping.exam_id].push(mapping.college_name);
      });

      const combinedExams = examsData.map(exam => ({
        ...exam,
        colleges: collegeMap[exam.exam_id] || [],
      }));

      setExams(combinedExams);
      setFilteredExams(combinedExams);
    } catch (err) {
      toast.error('Failed to fetch exam data');
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  let result = exams;

  // Filter by Exam ID or Category (normal filter)
  if (examFilter.trim()) {
    const term = examFilter.trim().toLowerCase();
    result = result.filter(
      exam =>
        exam.exam_id.toLowerCase().includes(term) ||
        (exam.categories || []).some(cat => cat.toLowerCase().includes(term))
    );
  }

  // Reorder by College Name (negation, but not removing)
  if (collegeNegationFilter.trim()) {
    const term = collegeNegationFilter.trim().toLowerCase();
    const notIncluded = [];
    const included = [];
    result.forEach(exam => {
      const colleges = (exam.colleges || []).map(c => c.toLowerCase());
      if (colleges.some(college => college.includes(term))) {
        included.push(exam);
      } else {
        notIncluded.push(exam);
      }
    });
    result = [...notIncluded, ...included]; // Not included first, included last
  }

  setFilteredExams(result);
}, [examFilter, collegeNegationFilter, exams]);


  if (!allowed && !permissionLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center bg-white px-8 py-10 ">
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
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Exam Search</h1>

      {/* Dual Filters */}
      <div className="max-w-3xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam ID or Category</label>
          <input
            type="text"
            placeholder="Search by Exam ID or Category"
            value={examFilter}
            onChange={e => setExamFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exclude College Name</label>
          <input
            type="text"
            placeholder="Show exams NOT allotted to this college"
            value={collegeNegationFilter}
            onChange={e => setCollegeNegationFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-[#4f378a]">Exam Results</h3>
          <button
            onClick={fetchData}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Refresh Data
          </button>
        </div>
        {loading ? (
          <p className="text-center py-4">Loading exams...</p>
        ) : filteredExams.length === 0 ? (
          <p className="text-center py-4 text-gray-400">
            No exams found for your filters.
          </p>
        ) : (
         <table className="w-full text-sm border-collapse border border-gray-300">
  <thead className="text-gray-600 bg-gray-100 border-b">
    <tr>
      <th className="p-2 text-left border border-gray-300">Exam ID</th>
      <th className="p-2 text-left border border-gray-300">Duration</th>
      <th className="p-2 text-left border border-gray-300">Questions</th>
      <th className="p-2 text-left border border-gray-300">File</th>
      <th className="p-2 text-left border border-gray-300">Categories</th>
      <th className="p-2 text-left border border-gray-300">Colleges</th>
    </tr>
  </thead>
  <tbody>
    {filteredExams.map(exam => (
      <tr key={exam.exam_id} className="hover:bg-gray-50 border-t">
        <td className="p-2 border border-gray-300">{exam.exam_id}</td>
        <td className="p-2 border border-gray-300">{exam.exam_duration} min</td>
        <td className="p-2 border border-gray-300">{exam.number_of_questions}</td>
        <td className="p-2 border border-gray-300">{exam.exam_file}</td>
        <td className="p-2 max-w-xs border border-gray-300">
          <div className="flex flex-wrap gap-1">
            {(exam.categories || []).map((cat, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {cat}
              </span>
            ))}
          </div>
        </td>
        <td className="p-2 max-w-xs border border-gray-300">
          <div className="flex flex-wrap gap-1">
            {(exam.colleges || []).map((college, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
              >
                {college}
              </span>
            ))}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        )}
      </div>
    </div>
  );
};

export default ExamSearch;
