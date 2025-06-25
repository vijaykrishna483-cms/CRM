import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import TrainerData from './TrainerData';
import TrainerBank from './TrainerBank';
import Feedback from './Feedback';


const Trainer = () => {
  const [activeTab, setActiveTab] = useState('Trainer Data');

  const renderContent = () => {
    switch (activeTab) {
      case 'Trainer Data':
        return <div className="mt-8 text-center"><TrainerData/> </div>;
      case 'Trainer Bank Data':
        return <div className="mt-8 text-center"><TrainerBank/></div>;
      case 'Trainer Feedback':
        return <div className="mt-8 text-center"><Feedback/></div>;
    
      default:
        return null;
    }
  };

  return (
    <div className='w-[100vw]'>
      <Navbar />

      <div className="flex w-full justify-center px-[10vw] mt-10 gap-[4vw] flex-wrap">
        {/* Trainer Data (highlighted) */}
        <div
          onClick={() => setActiveTab('Trainer Data')}
          className={`flex items-center justify-between  rounded-2xl text-[#4f378a] cursor-pointer transition-all ${
            activeTab === 'Trainer Data' ? 'font-semibold border border-[#000000] bg-[#6750a4]' : ''
          }`}
        >
          <span className="px-4 py-1 rounded-2xl bg-[#e9d4ff]">Trainer Data</span>
        </div>

        {/* Other Tabs */}
        {['Trainer Bank Data', 'Trainer Feedback'].map((item, index) => (
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

      {/* Rendered Section */}
      <div className="px-[10vw]">{renderContent()}</div>
    </div>
  );
};

export default Trainer;
