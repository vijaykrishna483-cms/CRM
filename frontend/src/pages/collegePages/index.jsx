import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import CollegeData from './collegeData';
import ProposalData from './proposalData';
import ServiceData from './ServiceData';
import Allocation from './Allocation';
import ProposalPlans from './ProposalPlans';
import Feedback from './Feedback';
import ProposalSender from './ProposalSender';

const TABS = [
  { label: 'College Data' },
  { label: 'Proposal Data' },
  { label: 'Services Data' },
  { label: 'Trainer Allocation' },
  { label: 'Proposal Plans' },
  { label: 'Trainer Feedback' },
  { label: 'Proposal Sender' }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('College Data');

  const renderContent = () => {
    switch (activeTab) {
      case 'College Data':
        return <div className="mt-8"><CollegeData /></div>;
      case 'Proposal Data':
        return <div className="mt-8"><ProposalData /></div>;
      case 'Services Data':
        return <div className="mt-8"><ServiceData /></div>;
      case 'Trainer Allocation':
        return <div className="mt-8"><Allocation /></div>;
      case 'Proposal Plans':
        return <div className="mt-8"><ProposalPlans /></div>;
      case 'Trainer Feedback':
        return <div className="mt-8"><Feedback/></div>;
      case 'Proposal Sender':
        return <div className="mt-8"><ProposalSender/></div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f6fd] overflow-x-hidden">
      <Navbar />
      <div className="flex flex-col items-center pt-24 px-2 sm:px-4">
        {/* Tab Bar */}
        <div className="w-full max-w-6xl overflow-x-auto">
          <div className="flex flex-nowrap gap-2 sm:gap-4 bg-white shadow rounded-2xl px-2 sm:px-4 py-2 mb-8 border border-[#e9d4ff]">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base whitespace-nowrap
                  ${
                    activeTab === tab.label
                      ? 'bg-[#6750a4] text-white shadow font-semibold scale-105'
                      : 'bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]'
                  }
                `}
                style={{
                  minWidth: '120px',
                  boxShadow: activeTab === tab.label ? '0 2px 8px #6750a433' : undefined,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Rendered Content */}
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow p-4 sm:p-8 min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
