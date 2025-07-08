import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import ExamData from './ExamData';
import ExamSearch from './ExamSearch';
import ExamBatchUpdation from './ExamBatchUpdation';

const TABS = [
  'Exam Data',
  'Exam Batch Updation',
  'Exam Search'
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('Exam Data');

  const renderContent = () => {
    switch (activeTab) {
      case 'Exam Data':
        return <div className="mt-8"><ExamData /></div>;
      case 'Exam Search':
        return <div className="mt-8"><ExamSearch /></div>;
      case 'Exam Batch Updation':
        return <div className="mt-8"><ExamBatchUpdation /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-[100vw] min-h-screen bg-[#f7f6fd]">
      <Navbar />
      <div className="flex w-[100vw] flex-col items-center pt-22">
        {/* Tab Bar */}
        <div className="flex flex-wrap gap-4 bg-white shadow rounded-2xl px-4 py-2 mb-8 border border-[#f3e6f1]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl transition-all duration-200 font-medium text-base
                ${
                  activeTab === tab
                    ? 'bg-[#6750a4] text-white shadow font-semibold scale-105'
                    : 'bg-[#f3e6f1] text-[#6750a4] hover:bg-[#e9d4ff] hover:text-[#6750a4]'
                }
              `}
              style={{
                minWidth: '160px',
                boxShadow: activeTab === tab ? '0 2px 8px #6750a433' : undefined,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Rendered Content */}
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
