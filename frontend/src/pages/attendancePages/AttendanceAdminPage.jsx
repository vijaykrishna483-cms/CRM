import React, { useState, useEffect } from "react";
import api from "../../libs/apiCall.js";
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import usePageAccess from "../../components/useAccessPage.jsx";
import DailyRecords from "./DailyRecords.jsx";
import MonthlyRecord from "./MonthlyRecord.jsx";
import LeaveRequest from "./LeaveRequest.jsx";
import LeaveApproval from "./LeaveApproval.jsx";


const AttendanceAdminPage = () => {

  // Section state for navigation
  const [section, setSection] = useState("daily");
  // Add/View toggle for modals or forms (if needed)
  

  // Section content renderers (replace with your real components)
  const renderSection = () => {
    if (section === "daily") {
      return (
       <DailyRecords/>
      );
    }
    if (section === "monthly") {
      return <MonthlyRecord/>
    }
    if (section === "leave-request") {
      return <LeaveRequest/>;
    }
    if (section === "leave-approval") {
      return <LeaveApproval/>;
    }
    return null;
  };

  return (
    <>
      <Navbar />

      {/* Four navigation buttons */}
      <div className="flex flex-nowrap gap-2 sm:gap-4 bg-transparent justify-center pt-30 rounded-2xl px-2 sm:px-4 py-2 mb-8">
        <button
          onClick={() => setSection("daily")}
          className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base whitespace-nowrap
            ${section === "daily" ? "bg-[#6750a4] text-white shadow font-semibold scale-105" : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff]"}
          `}
          style={{
            minWidth: "120px",
            boxShadow: section === "daily" ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          Daily Records
        </button>
        <button
          onClick={() => setSection("monthly")}
          className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base whitespace-nowrap
            ${section === "monthly" ? "bg-[#6750a4] text-white shadow font-semibold scale-105" : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff]"}
          `}
          style={{
            minWidth: "120px",
            boxShadow: section === "monthly" ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          Monthly Records
        </button>
        <button
          onClick={() => setSection("leave-request")}
          className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base whitespace-nowrap
            ${section === "leave-request" ? "bg-[#6750a4] text-white shadow font-semibold scale-105" : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff]"}
          `}
          style={{
            minWidth: "120px",
            boxShadow: section === "leave-request" ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          Leave Request
        </button>
        <button
          onClick={() => setSection("leave-approval")}
          className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base whitespace-nowrap
            ${section === "leave-approval" ? "bg-[#6750a4] text-white shadow font-semibold scale-105" : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff]"}
          `}
          style={{
            minWidth: "120px",
            boxShadow: section === "leave-approval" ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          Leave Approval
        </button>
      </div>

      <div className="min-h-screen p-8 flex flex-col items-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 drop-shadow-md">
          HR Attendance Monitoring
        </h1>
        <div className="w-full max-w-5xl">
          {renderSection()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AttendanceAdminPage;
