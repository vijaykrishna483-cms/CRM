import React, { useState } from 'react'
import FeedbackView from './Components/FeedbackView';
import FeedbackAdd from './Components/FeedbackAdd';

const Feedback = () => {
    const [open, setOpen] = useState(true);
  return (
   <div className="w-full min-h-screen bg-white px-6 sm:px-10 ">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">College Management Portal</h1>
      <div className="flex flex-wrap gap-4 bg-transparent justify-center rounded-2xl px-4 py-2 mb-8">
        <button
          onClick={() => { setOpen(true); setEdit(false); setEmployeeInfo(initialEmployeeState); setEditId(null); }}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
            ${open ? "bg-[#6750a4] text-white shadow font-semibold scale-105" : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"}
          `}
          style={{
            minWidth: "140px",
            boxShadow: open ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          <>Add</>
        </button>
        <button
          onClick={() => { setOpen(false); setEdit(false); setEmployeeInfo(initialEmployeeState); setEditId(null); }}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
            ${open ? "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]" : "bg-[#6750a4] text-white shadow font-semibold scale-105"}
          `}
          style={{
            minWidth: "140px",
            boxShadow: !open ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          Overview
        </button>
      </div>

      {open ? <> <FeedbackAdd
        /></> : <>   <FeedbackView
      /> </> }

   
    </div>
  )
}

export default Feedback
