import React, { useState } from 'react';
import Add from './Components/Add';
import Vieww from './Components/View';

const initialEmployeeState = {
  employee_id: '',
  employee_name: '',
  designation: '',
  position: '',
  aadhar_number: '',
  pan_id: '',
  personal_contact: '',
  address: '',
  office_contact: '',
  personal_email: '',
  office_email: '',
  salary: ''
};

const CollegeData = () => {
  const [open, setOpen] = useState(true);

  // If you use setEdit, setEmployeeInfo, setEditId, define them here or in Add/Vieww as needed

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center py-6 px-2 sm:px-4 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-[#4f378a]">
        College Management Portal
      </h1>
      {/* Responsive tab buttons */}
      <div className="w-full  overflow-x-auto">
        <div className="flex flex-nowrap gap-2 sm:gap-4 bg-transparent justify-center rounded-2xl px-2 sm:px-4 py-2 mb-8">
          <button
            onClick={() => { setOpen(true); /* setEdit(false); setEmployeeInfo(initialEmployeeState); setEditId(null); */ }}
            className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base whitespace-nowrap
              ${open ? "bg-[#6750a4] text-white shadow font-semibold scale-105" : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"}
            `}
            style={{
              minWidth: "120px",
              boxShadow: open ? "0 2px 8px #6750a433" : undefined,
            }}
          >
            Add
          </button>
          <button
            onClick={() => { setOpen(false); /* setEdit(false); setEmployeeInfo(initialEmployeeState); setEditId(null); */ }}
            className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base whitespace-nowrap
              ${!open ? "bg-[#6750a4] text-white shadow font-semibold scale-105" : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"}
            `}
            style={{
              minWidth: "120px",
              boxShadow: !open ? "0 2px 8px #6750a433" : undefined,
            }}
          >
            View
          </button>
        </div>
      </div>

      {/* Responsive content area */}
      <div className="w-full bg-white rounded-2xl shadow p-4 sm:p-8 min-h-[300px]">
        {open ? <Add /* pass props as needed */ /> : <Vieww /* pass props as needed */ />}
      </div>
    </div>
  );
};

export default CollegeData;
