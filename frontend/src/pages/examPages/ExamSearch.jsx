import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
import usePageAccess from '../../components/useAccessPage';

const ExamSearch = () => {
       const { allowed, loading: permissionLoading } = usePageAccess("examsearch");

       

  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [unassignedExams, setUnassignedExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [collegeMappings, setCollegeMappings] = useState({});

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

      setCollegeMappings(collegeMap);

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
    if (!searchTerm.trim()) {
      setFilteredExams(exams);
      setUnassignedExams([]);
      return;
    }

    const term = searchTerm.toLowerCase();

    const matchingExams = exams.filter(
      exam =>
        exam.exam_id.toLowerCase().includes(term) ||
        (exam.categories || []).some(cat => cat.toLowerCase().includes(term)) ||
        (exam.colleges || []).some(college => college.toLowerCase().includes(term))
    );

    const unassigned = exams.filter(
      exam =>
        !exam.colleges.some(college => college.toLowerCase().includes(term))
    );

    setFilteredExams(matchingExams);
    setUnassignedExams(unassigned);
  }, [searchTerm, exams]);

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
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Exam Search</h1>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by college to see unalloted exams"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 text-sm"
          />
          <button
            onClick={() => setSearchTerm('')}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-lg"
          >
            Clear
          </button>
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
            {searchTerm ? 'No matching exams found' : 'No exams available'}
          </p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="text-gray-600 bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">Exam ID</th>
                <th className="p-2 text-left">Duration</th>
                <th className="p-2 text-left">Questions</th>
                <th className="p-2 text-left">File</th>
                <th className="p-2 text-left">Categories</th>
                <th className="p-2 text-left">Colleges</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map(exam => (
                <tr key={exam.exam_id} className="hover:bg-gray-50 border-t">
                  <td className="p-2">{exam.exam_id}</td>
                  <td className="p-2">{exam.exam_duration} min</td>
                  <td className="p-2">{exam.number_of_questions}</td>
                  <td className="p-2">{exam.exam_file}</td>
                  <td className="p-2 max-w-xs">
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
                  <td className="p-2 max-w-xs">
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

      {/* Unassigned Exams */}
      {searchTerm && unassignedExams.length > 0 && (
        <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
          <h3 className="text-sm font-semibold mb-4 text-[#b91c1c]">
            Exams not allotted to "{searchTerm}"
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead className="text-gray-600 bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">Exam ID</th>
                <th className="p-2 text-left">Duration</th>
                <th className="p-2 text-left">Questions</th>
                <th className="p-2 text-left">Categories</th>
              </tr>
            </thead>
            <tbody>
              {unassignedExams.map(exam => (
                <tr key={exam.exam_id} className="hover:bg-gray-50 border-t">
                  <td className="p-2">{exam.exam_id}</td>
                  <td className="p-2">{exam.exam_duration} min</td>
                  <td className="p-2">{exam.number_of_questions}</td>
                  <td className="p-2 max-w-xs">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamSearch;
