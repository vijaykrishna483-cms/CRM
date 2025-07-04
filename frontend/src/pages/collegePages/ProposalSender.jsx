import React, { useState } from 'react';
import Upload from './Components/upload';
import SendMail from './Components/sendMail';
import Activate from './Components/Activate';

const ProposalSender = () => {
  const [status, setStatus] = useState('upload');

  const options = [
    { label: "Upload", value: "upload" },
    { label: "Sent Mail", value: "sendmail" },
    { label: "Active", value: "active" }
  ];

  let content;
  if (status === 'upload') content = <Upload />;
  else if (status === 'sendmail') content = <SendMail />;
  else if (status === 'active') content = <Activate />;
  else content = <div>Select an option above.</div>;

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#4f378a]">
        Proposal Plan Information Portal
      </h1>

      <div className="flex flex-wrap gap-4 bg-transparent justify-center rounded-2xl px-4 py-2 mb-8">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
              ${status === opt.value
                ? "bg-[#6750a4] text-white shadow font-semibold scale-105"
                : "bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]"
              }
            `}
            style={{
              minWidth: "140px",
              boxShadow: status === opt.value ? "0 2px 8px #6750a433" : undefined,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center">{content}</div>
    </div>
  );
};

export default ProposalSender;
