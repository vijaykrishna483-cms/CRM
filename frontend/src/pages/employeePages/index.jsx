import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import EmployeeData from './employeeData';
import Bank from './Bank';
import Reimbursement from './reimbursement';
import Approval from './approval';
import Accountant from './Accountant';

const TABS = [
  { label: 'Employee Data' },
  { label: 'Employee Bank Data' },
  { label: 'Reimbursement Data' },
  { label: 'Reimbursement Data Approval' },
  { label: 'Accountant' }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('Employee Data');

  const renderContent = () => {
    switch (activeTab) {
      case 'Employee Data':
        return <div className="mt-8"><EmployeeData /></div>;
      case 'Employee Bank Data':
        return <div className="mt-8"><Bank /></div>;
      case 'Reimbursement Data':
        return <div className="mt-8"><Reimbursement /></div>;
      case 'Reimbursement Data Approval':
        return <div className="mt-8"><Approval /></div>;
      case 'Accountant':
        return <div className="mt-8"><Accountant /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f6fd]">
      <Navbar />
      <div className="flex flex-col items-center pt-22">
        {/* Tab Bar */}
        <div className="flex flex-wrap gap-4 bg-white shadow rounded-2xl px-4 py-2 mb-8 border border-[#f3e6f1]">
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
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
