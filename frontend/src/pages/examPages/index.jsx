import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import ExamData from './ExamData';
import ExamSearch from './ExamSearch';
import ExamBatchUpdation from './ExamBatchUpdation';


const Index = () => {
  const [activeTab, setActiveTab] = useState('Exam Data');

  const renderContent = () => {
    switch (activeTab) {

      case 'Exam Data':
        return <div className="mt-8"><ExamData/></div>;


      case 'Exam Search':
        return <div className="mt-8"><ExamSearch/></div>;
      case 'Exam Batch Updation':
        return <div className="mt-8"><ExamBatchUpdation/></div>;

      default:
        return null;
    }
  };

  return (
    <div className='w-[100vw] min-h-screen bg-white'>
      <Navbar />

      <div className="flex w-full justify-center px-[10vw] mt-10 gap-[4vw] flex-wrap">
        {/* Tab Navigation */}
        {[
          'Exam Data',
          'Exam Search',
          'Exam Batch Updation'
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(item)}
            className={`bg-[#e9d4ff] px-4 py-1 rounded-2xl text-[#4f378a] cursor-pointer transition-all ${
              activeTab === item 
                ? 'font-semibold border-2 border-[#4f378a] bg-[#d0bcff]' 
                : 'hover:bg-[#d0bcff]'
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Rendered Content */}
      <div className="px-[10vw] py-8">{renderContent()}</div>
    </div>
  );
};

export default Index;
