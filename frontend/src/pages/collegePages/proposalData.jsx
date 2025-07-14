import { useState } from "react";
import ProposalView from "./Components/ProposalView";
import ProposalEdit from "./Components/ProposalEdit";
import Handover from "./Components/handOver";

const ProposalData = () => {
  const [open, setOpen] = useState("add");

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">
        Proposal Management Portal
      </h1>

      <div className="flex flex-wrap gap-4 bg-transparent justify-center rounded-2xl px-4 py-2 mb-8">
        <button
          onClick={() => setOpen("add")}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base ${
            open === "add"
              ? "bg-[#6750a4] text-white shadow font-semibold scale-105"
              : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"
          }`}
          style={{
            minWidth: "140px",
            boxShadow: open === "add" ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          Add
        </button>

        <button
          onClick={() => setOpen("view")}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base ${
            open === "view"
              ? "bg-[#6750a4] text-white shadow font-semibold scale-105"
              : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"
          }`}
          style={{
            minWidth: "140px",
            boxShadow: open === "view" ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          View
        </button>

        <button
          onClick={() => setOpen("handover")}
          className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base ${
            open === "handover"
              ? "bg-[#6750a4] text-white shadow font-semibold scale-105"
              : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"
          }`}
          style={{
            minWidth: "140px",
            boxShadow: open === "handover" ? "0 2px 8px #6750a433" : undefined,
          }}
        >
          Handover
        </button>
      </div>

      {open === "add" && <ProposalEdit />}

      {open === "view" && <ProposalView showDetails={false} />}

      {open === "handover" && (
       <Handover/>
      )}
    </div>
  );
};

export default ProposalData;
