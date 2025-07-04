import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import usePageAccess from "../../../components/useAccessPage";
import api from "../../../libs/apiCall";

const Add = () => {
  const { allowed, loading: loadingg } = usePageAccess("collegedataedition");

  const [collegeInfo, setCollegeInfo] = useState({
    name: "",
    location: "",
    state: "",
    code: "",
  });

  const [pocInfo, setPocInfo] = useState({
    name: "",
    designation: "",
    mail: "",
    redEmail: "",
    contact: "",
  });

  const [collegeIdForPOC, setCollegeIdForPOC] = useState(""); // NEW
  const [collegeData, setCollegeData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchColleges();
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

  const handleChange = (e) => {
    setPocInfo({ ...pocInfo, [e.target.name]: e.target.value });
  };

  const handleCollegeChange = (e) => {
    setCollegeInfo({ ...collegeInfo, [e.target.name]: e.target.value });
  };

  const handleAddCollege = async () => {
    if (
      !collegeInfo.name ||
      !collegeInfo.location ||
      !collegeInfo.state ||
      !collegeInfo.code
    ) {
      toast.info("Please fill in all college details.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/college/addCollege`, {
        collegeName: collegeInfo.name,
        location: collegeInfo.location,
        state: collegeInfo.state,
        collegeCode: collegeInfo.code,
      });

      if (res.data.status !== "success") throw new Error(res.data.message);

      await fetchColleges();
      setCollegeInfo({ name: "", location: "", state: "", code: "" });

      toast.success("College added successfully!");
    } catch (error) {
      toast.error(error.message || "Error adding college");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPOC = async () => {
    if (
      !collegeIdForPOC ||
      !pocInfo.name ||
      !pocInfo.designation ||
      !pocInfo.mail ||
      !pocInfo.contact ||
      !pocInfo.redEmail
    ) {
      toast.info("Please fill all fields including college ID.");
      return;
    }

    const matchedCollege = collegeData.find(
      (col) => col.college_code.toString() === collegeIdForPOC
    );
    if (!matchedCollege) {
      toast.error("College ID does not exist.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/college/addpoc`, {
        collegeId: matchedCollege.college_id, // ✅ Use college_id from matched college_code
        pocName: pocInfo.name,
        pocDesignation: pocInfo.designation,
        pocEmail: pocInfo.mail,
        pocRedEmail: pocInfo.redEmail,
        pocContact: pocInfo.contact,
      });

      if (res.data.status !== "success") throw new Error(res.data.message);

      await fetchColleges();
      setPocInfo({ name: "", designation: "", mail: "", contact: "" });
      setCollegeIdForPOC("");
      toast.success("POC added successfully!");
    } catch (error) {
      toast.error(error.message || "Error adding POC");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
        <h2 className="text-lg font-semibold text-[#4f378a]">
          Add New College
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col text-left">
            <label htmlFor="name" className="text-sm font-medium mb-1">
              College Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="College Name"
              value={collegeInfo.name}
              onChange={handleCollegeChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="code" className="text-sm font-medium mb-1">
              College Code
            </label>
            <input
              id="code"
              name="code"
              placeholder="College Code"
              value={collegeInfo.code}
              onChange={handleCollegeChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="location" className="text-sm font-medium mb-1">
              Location
            </label>
            <input
              id="location"
              name="location"
              placeholder="Location"
              value={collegeInfo.location}
              onChange={handleCollegeChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="state" className="text-sm font-medium mb-1">
              State
            </label>
            <input
              id="state"
              name="state"
              placeholder="State"
              value={collegeInfo.state}
              onChange={handleCollegeChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleAddCollege}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add College"}
        </button>
      </div>

      {/* POC Add Section */}
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-4">
        <h2 className="text-lg font-semibold text-[#4f378a]">
          Add Point of Contact
        </h2>
        <select
          value={collegeIdForPOC}
          onChange={(e) => setCollegeIdForPOC(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
        >
          <option value="">Select College Code</option>
          {collegeData.map((college) => (
            <option key={college.college_id} value={college.college_code}>
              {college.college_code} ({college.college_name})
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col text-left">
            <label htmlFor="name" className="text-sm font-medium mb-1">
              POC Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="POC Name"
              value={pocInfo.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="designation" className="text-sm font-medium mb-1">
              Designation
            </label>
            <input
              id="designation"
              name="designation"
              placeholder="Designation"
              value={pocInfo.designation}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="mail" className="text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="mail"
              name="mail"
              placeholder="Email"
              value={pocInfo.mail}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="mail" className="text-sm font-medium mb-1">
              College Mail
            </label>
            <input
              id="redEmail"
              name="redEmail"
              placeholder="College Mail "
              value={pocInfo.redEmail}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col text-left">
            <label htmlFor="contact" className="text-sm font-medium mb-1">
              Contact
            </label>
            <input
              id="contact"
              name="contact"
              placeholder="Contact"
              value={pocInfo.contact}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleAddPOC}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add POC"}
        </button>
      </div>
    </div>
  );
};

export default Add;
