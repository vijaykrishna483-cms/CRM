import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const ExamSearch = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [collegeMappings, setCollegeMappings] = useState({});

  // Fetch exams with categories and college mappings
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch exams with categories
      const examsRes = await api.get('/exam/getall');
      const examsData = examsRes.data || [];
      
      // Fetch college mappings
      const collegesRes = await api.get('/exam/collegelist');
      const collegeData = collegesRes.data || [];
      
      // Create a mapping of exam_id to college names
      const collegeMap = {};
      collegeData.forEach(mapping => {
        if (!collegeMap[mapping.exam_id]) {
          collegeMap[mapping.exam_id] = [];
        }
        collegeMap[mapping.exam_id].push(mapping.college_name);
      });
      
      setCollegeMappings(collegeMap);
      
      // Combine exams with their college mappings
      const combinedExams = examsData.map(exam => ({
        ...exam,
        colleges: collegeMap[exam.exam_id] || []
      }));
      
      setExams(combinedExams);
      setFilteredExams(combinedExams);
    } catch (err) {
      toast.error('Failed to fetch exam data');
    } finally {
      setLoading(false);
    }
  };

  // Filter exams based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredExams(exams);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    setFilteredExams(
      exams.filter(exam => 
        exam.exam_id.toLowerCase().includes(term) ||
        (exam.categories || []).some(cat => cat.toLowerCase().includes(term)) ||
        (exam.colleges || []).some(college => college.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, exams]);

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Exam Search</h1>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by Exam ID, Category, or College"
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
    </div>
  );
};

export default ExamSearch;
