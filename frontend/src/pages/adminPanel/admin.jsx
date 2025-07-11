import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminEmployeeTable from "./AdminEmployeeTable";
import RoleAccess from "./RoleAccess";
import PositionAndVerticalsPage from "./PositionAndVerticalsPage"; // <-- Import your new component

const Admin = () => {
  const [show, setShow] = useState("employee");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#e7f6f2] via-[#6750a4]/70 to-[#6750a4]/100 py-10 px-2">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#6750a4] text-white rounded-full p-3 shadow-md">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#6750a4] tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-base">
                Quickly manage employee access, roles, registration, and structure for your Smart CRM.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3 justify-between mb-6 w-full ">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-[#fff] text-[#6750a4] px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#543c85] transition"
            aria-label="Go to Home Page"
          >
            Home
          </button>
          <button
            onClick={() => setShow("employee")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition ${
              show === "employee"
                ? "bg-[#543c85] text-white"
                : "bg-[#6750a4] text-white hover:bg-[#543c85]"
            }`}
            aria-label="View all employees"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Employee Directory
          </button>
          <button
            onClick={() => setShow("roles")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition ${
              show === "roles"
                ? "bg-[#543c85] text-white"
                : "bg-[#6750a4] text-white hover:bg-[#543c85]"
            }`}
            aria-label="Assign role access"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Role & Page Access
          </button>
          <button
            onClick={() => setShow("structure")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow transition ${
              show === "structure"
                ? "bg-[#543c85] text-white"
                : "bg-[#6750a4] text-white hover:bg-[#543c85]"
            }`}
            aria-label="Manage positions and verticals"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Positions & Verticals
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 bg-[#6750a4] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#543c85] transition"
            aria-label="Register a new employee"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Employee
          </button>
        </div>

        {/* Section Guidance */}
        <div className="mb-6 text-sm text-gray-700">
          {show === "employee"
            ? "Browse, search, and manage all registered employees below."
            : show === "roles"
            ? "Assign or update role-based page access for your organization."
            : "Manage your organization's positions and verticals structure below."}
        </div>

        {/* Main Content */}
        {show === "employee" && <AdminEmployeeTable />}
        {show === "roles" && <RoleAccess />}
        {show === "structure" && <PositionAndVerticalsPage />}
      </div>
    </div>
  );
};

export default Admin;
