import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { exportTableToExcel } from "../Excels/ExcelCollege";
import api from "../../../libs/apiCall";
import usePageAccess from "../../../components/useAccessPage";

const Vieww = () => {
  const { allowed, loading: loadingg } = usePageAccess("collegedataview");

  const [collegeData, setCollegeData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchColleges();
    // eslint-disable-next-line
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const collegesRes = await api.get(`/college/getall`);
      const colleges = collegesRes.data.data || [];
      const collegesWithPocs = await Promise.all(
        colleges.map(async (college) => {
          try {
            const pocsRes = await api.get(
              `/college/${college.college_id}/getpocs`
            );
            return {
              ...college,
              pocs: pocsRes.data.data || [],
            };
          } catch {
            return { ...college, pocs: [] };
          }
        })
      );
      setCollegeData(collegesWithPocs);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast.error("Failed to fetch colleges.");
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  // Filtering logic
  const filteredColleges = collegeData.filter((college) => {
    const collegeMatch =
      college.college_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.college_name.toLowerCase().includes(searchTerm.toLowerCase());
    const pocMatch = (college.pocs || []).some((poc) =>
      poc.poc_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const stateMatch =
      college.state.toLowerCase().includes(searchTerm.toLowerCase());

    return collegeMatch || pocMatch || stateMatch;
  });

  if (!allowed && !loadingg)
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
  if (loadingg) return <div>Loading...</div>;

  return (
    <div>
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4 text-[#4f378a]">
          College Entries
        </h3>
        <div className="flex gap-4 w-full justify-center items-center mb-4">
          <input
            type="text"
            placeholder="Search by college code, name or POC,State"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-sm"
          />
          <button
            onClick={() => exportTableToExcel(filteredColleges)}
            className="bg-[#364153] text-white px-4 py-2 rounded hover:bg-[#91619b]"
          >
            Download Excel
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm border-collapse">
            <thead className="text-gray-600 bg-gray-100 border-b border-gray-300 text-left">
              <tr>
                <th className="p-2 border border-gray-300 whitespace-nowrap min-w-[120px]">College Code</th>
                <th className="p-2 border border-gray-300 whitespace-nowrap min-w-[180px]">Name</th>
                <th className="p-2 border border-gray-300 whitespace-nowrap min-w-[120px]">Location</th>
                <th className="p-2 border border-gray-300 whitespace-nowrap min-w-[120px]">State</th>
                <th className="p-2 border border-gray-300 whitespace-nowrap min-w-[140px]">POC Name</th>
                <th className="p-2 border border-gray-300 whitespace-nowrap min-w-[140px]">Designation</th>
                <th className="p-2 border border-gray-300 whitespace-nowrap min-w-[140px]">Contact</th>
                <th className="p-2 border border-gray-300 whitespace-nowrap min-w-[180px]">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredColleges.map((college) => (
                <React.Fragment key={college.college_id}>
                  <tr className="hover:bg-gray-50 border-t border-gray-300 text-left">
                    <td className="p-2 border border-gray-300 text-red-500 flex items-center gap-1 whitespace-nowrap min-w-[120px]">
                      {college.college_code}
                    </td>
                    <td className="p-2 border border-gray-300 whitespace-nowrap min-w-[180px]">{college.college_name}</td>
                    <td className="p-2 border border-gray-300 whitespace-nowrap min-w-[120px]">{college.location}</td>
                    <td className="p-2 border border-gray-300 whitespace-nowrap min-w-[120px]">{college.state}</td>
                    <td colSpan="5" className="p-2 border border-gray-300 whitespace-nowrap">
                      {!college.pocs || college.pocs.length === 0 ? "No POCs" : ""}
                    </td>
                  </tr>
                  {(college.pocs || []).map((poc) => (
                    <tr key={poc.poc_id} className="hover:bg-gray-50 border-t border-gray-300 text-left">
                      <td className="border border-gray-300"></td>
                      <td className="border border-gray-300"></td>
                      <td className="border border-gray-300"></td>
                      <td className="border border-gray-300"></td>
                      <td className="p-2 border border-gray-300 whitespace-nowrap min-w-[140px]">{poc.poc_name}</td>
                      <td className="p-2 border border-gray-300 whitespace-nowrap min-w-[140px]">{poc.poc_designation}</td>
                      <td className="p-2 border border-gray-300 whitespace-nowrap min-w-[140px]">{poc.poc_contact}</td>
                      <td className="p-2 border border-gray-300 whitespace-nowrap min-w-[180px]">{poc.poc_email}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Vieww;
