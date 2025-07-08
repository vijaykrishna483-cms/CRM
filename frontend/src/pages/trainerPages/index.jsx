import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import TrainerData from './TrainerData';
import TrainerBank from './TrainerBank';
import Feedback from './Feedback';

const TABS = [
  { label: 'Trainer Data' },
  { label: 'Trainer Bank Data' },
  { label: 'Trainer Feedback' }
];

const Trainer = () => {
  const [activeTab, setActiveTab] = useState('Trainer Data');

  const renderContent = () => {
    switch (activeTab) {
      case 'Trainer Data':
        return <div className="mt-8"><TrainerData /></div>;
      case 'Trainer Bank Data':
        return <div className="mt-8"><TrainerBank /></div>;
      case 'Trainer Feedback':
        return <div className="mt-8"><Feedback /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-[100vw] min-h-screen bg-[#f7f6fd]">
      <Navbar />
      <div className="flex flex-col  w-[100vw] items-center pt-22">
        {/* Tab Bar */}
        <div className="flex flex-wrap gap-4 bg-white  shadow rounded-2xl px-4 py-2 mb-8 border border-[#f3e6f1]">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
                ${
                  activeTab === tab.label
                    ? 'bg-[#6750a4] text-white shadow font-semibold scale-105'
                    : 'bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]'
                }
              `}
              style={{
                minWidth: '160px',
                boxShadow: activeTab === tab.label ? '0 2px 8px #6750a433' : undefined,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Rendered Content */}
        <div className="w-[100vw] mx-auto bg-white rounded-2xl shadow p-8 min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Trainer;
