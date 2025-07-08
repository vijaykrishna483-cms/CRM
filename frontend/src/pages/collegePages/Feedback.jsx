import React, { useState } from 'react'
import FeedbackView from './Components/FeedbackView';
import FeedbackAdd from './Components/FeedbackAdd';

const Feedback = () => {
  return (
   <div className="w-full min-h-screen bg-white px-6 sm:px-10 ">
     <FeedbackAdd/>   
    </div>
  )
}

export default Feedback
