import React, { useState } from 'react';
import { IoMdSettings } from 'react-icons/io';
import Navbar from '../../components/Navbar';
import CollegeData from './collegeData';
import ProposalData from './proposalData';
import ServiceData from './ServiceData';
import Allocation from './Allocation';

const Index = () => {
  const [activeTab, setActiveTab] = useState('College Data');

  const renderContent = () => {
    switch (activeTab) {
      case 'College Data':
        return <div className="mt-8 text-center"><CollegeData/></div>;
      case 'Proposal Data':
        return <div className="mt-8 text-center"><ProposalData/></div>;
      case 'Services Data':
        return <div className="mt-8 text-center"><ServiceData/></div>;
      case 'Trainer Allocation':
        return <div className="mt-8 text-center"><Allocation/></div>;
      // case 'Trainer Comment':
      //   return <div className="mt-8 text-center">💬 Trainer Comment Component</div>;
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
          onClick={() => setActiveTab('College Data')}
          className={`flex items-center justify-between text-[#4f378a] cursor-pointer transition-all ${
            activeTab === 'College Data' ? 'font-semibold' : ''
          }`}
        >
          <span className='  px-4 py-1  rounded-2xl bg-[#e9d4ff]'>College Data</span>
        </div>

        {/* Other tabs */}
        {['Proposal Data', 'Services Data', 'Trainer Allocation',].map((item, index) => (
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
