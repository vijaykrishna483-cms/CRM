import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall";
import { toast } from "react-toastify";
import usePageAccess from "../../components/useAccessPage";

const ExamData = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("examtrackentry");

  const [examInfo, setExamInfo] = useState({
    exam_id: "",
    exam_duration: "",
    number_of_questions: "",
    exam_file: "",
    categories: [""],
  });

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await api.get("/exam/getall");
      setExams(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamInfo({ ...examInfo, [name]: value });
  };

  // Handle change for category input fields
  const handleCategoryChange = (index, value) => {
    const newCategories = [...examInfo.categories];
    newCategories[index] = value;
    setExamInfo({ ...examInfo, categories: newCategories });
  };

  const handleAddCategory = () => {
    setExamInfo({ ...examInfo, categories: [...examInfo.categories, ""] });
  };

  const handleRemoveCategory = (index) => {
    const newCategories = examInfo.categories.filter((_, i) => i !== index);
    setExamInfo({ ...examInfo, categories: newCategories.length ? newCategories : [""] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        exam_id: examInfo.exam_id,
        exam_duration: examInfo.exam_duration,
        number_of_questions: examInfo.number_of_questions,
        exam_file: examInfo.exam_file,
        categories: examInfo.categories.filter((c) => c.trim() !== ""),
      };
      await api.post("/exam/add", payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Exam added successfully!");
      setExamInfo({
        exam_id: "",
        exam_duration: "",
        number_of_questions: "",
        exam_file: "",
        categories: [""],
      });
      await fetchExams();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error adding exam");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    if (!window.confirm("Delete this exam?")) return;
    setLoading(true);
    try {
      await api.delete(`/exam/delete/${examId}`);
      await fetchExams();
      toast.success("Exam deleted successfully");
    } catch (err) {
      toast.error("Error deleting exam");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-[#6750a4] mb-2">Access Denied</h2>
          <p className="text-gray-600 text-center mb-4">
            You do not have permission to view this page.<br />
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
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 ">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Exam Management</h1>

      {/* Add Exam Form */}
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">Add New Exam</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="exam_id" className="mb-1 text-sm font-medium text-gray-700">
              Exam ID
            </label>
            <input
              id="exam_id"
              name="exam_id"
              placeholder="Exam ID"
              value={examInfo.exam_id}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="exam_duration" className="mb-1 text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="exam_duration"
              name="exam_duration"
              placeholder="Duration (minutes)"
              value={examInfo.exam_duration}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="number_of_questions" className="mb-1 text-sm font-medium text-gray-700">
              Number of Questions
            </label>
            <input
              type="number"
              id="number_of_questions"
              name="number_of_questions"
              placeholder="Number of Questions"
              value={examInfo.number_of_questions}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="exam_file" className="mb-1 text-sm font-medium text-gray-700">
              Exam File Name
            </label>
            <input
              type="text"
              id="exam_file"
              name="exam_file"
              placeholder="Enter file name (e.g., exam1.pdf)"
              value={examInfo.exam_file || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Categories Input Fields */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div className="flex flex-col gap-2">
            {examInfo.categories.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={cat}
                  onChange={e => handleCategoryChange(idx, e.target.value)}
                  placeholder={`Category ${idx + 1}`}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
                />
                {examInfo.categories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(idx)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                    title="Remove category"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCategory}
              className="mt-2 px-4 py-1 bg-purple-100 hover:bg-purple-200 rounded text-sm text-[#4f378a] w-fit"
            >
              + Add Category
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2 bg-[#6750a4] hover:bg-[#4f378a] rounded-full font-medium text-sm text-white transition"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Exam"}
        </button>
      </div>

      {/* Exams Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-[#4f378a]">Exam Entries</h3>
          <button
            onClick={fetchExams}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-center py-4">Loading exams...</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="text-gray-600 bg-gray-100 border-b">
              <tr>
                <th className="p-2 text-left">Exam ID</th>
                <th className="p-2 text-left">Duration</th>
                <th className="p-2 text-left">Questions</th>
                <th className="p-2 text-left">Exam File</th>
                <th className="p-2 text-left">Categories</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.exam_id} className="hover:bg-gray-50 border-t">
                  <td className="p-2">{exam.exam_id}</td>
                  <td className="p-2">{exam.exam_duration} min</td>
                  <td className="p-2">{exam.number_of_questions}</td>
                  <td className="p-2">{exam.exam_file}</td>
                  <td className="p-2 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {exam.categories?.map((category, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(exam.exam_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-2 text-center text-gray-400">
                    No exams found
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

export default ExamData;
