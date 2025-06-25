import React, { useState } from 'react';
import { IoMdSettings } from 'react-icons/io';
import Navbar from '../../components/Navbar';
import EmployeeData from './employeeData'
import Bank from './Bank';
import Reimbursement from './reimbursement';
import Approval from './approval';

const Index = () => {
  const [activeTab, setActiveTab] = useState('Employee Data');

  const renderContent = () => {
    switch (activeTab) {
      case 'Employee Data':
        return <div className="mt-8 text-center"><EmployeeData/></div>;
      case 'Employee Bank Data':
        return <div className="mt-8 text-center"><Bank/></div>;
      case 'Reimbursement Data':
        return <div className="mt-8 text-center"><Reimbursement/></div>;
      case 'Reimbursement Data Approval':
        return <div className="mt-8 text-center"><Approval/></div>;
    
      default:
        return null;
    }
  };

  return (
    <div className='w-[100vw]'>
      <Navbar />

      <div className="flex w-full justify-center px-[10vw] mt-10 gap-[4vw] flex-wrap">
        {/* College Data (with icon) */}
        <div
          onClick={() => setActiveTab('Employee Data')}
          className={`flex items-center justify-between text-[#4f378a] cursor-pointer transition-all ${
            activeTab === 'Employee Data' ? 'font-semibold' : ''
          }`}
        >
          <span className='  px-4 py-1  rounded-2xl bg-[#e9d4ff]'>Employee Data</span>
        </div>

        {/* Other tabs */}
        {['Employee Bank Data', 'Reimbursement Data','Reimbursement Data Approval'].map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(item)}
            className={`bg-[#e9d4ff] px-4 py-1 rounded-2xl text-[#4f378a] cursor-pointer transition-all ${
              activeTab === item ? 'font-semibold border border-[#000000] bg-[#6750a4]' : ''
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Rendered Content */}
      <div className="px-[10vw]">{renderContent()}</div>
    </div>
  );
};

export default Index;
