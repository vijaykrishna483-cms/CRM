import React, { useState, useEffect } from 'react';
import FeedbackView from '../collegePages/Components/FeedbackView';
const Feedback = () => {

  return (
    <div className="w-full h-full bg-white px-6 sm:px-10 ">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Trainer Feedbacks</h1>

      <FeedbackView/>
    </div>
  );
};

export default Feedback;
