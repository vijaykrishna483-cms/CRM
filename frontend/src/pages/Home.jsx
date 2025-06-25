import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="w-full bg-white">
     <div className='fixed w-[100vw]'>
        <Navbar/>
        </div>   
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[#1a1a1a]">
          CUSTOMER RELATIONSHIP MANAGEMENT PAGE
        </h1>
        <p className="mb-6 text-gray-700">
          This Page is for Employees to aid them in their menial tasks and connect well with the customers.
        </p>

        <div className="flex justify-end mb-8">
          <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 text-sm font-semibold">
            Employee Sign In
          </button>
        </div>

        <div className="mb-12">
          <img
            src="https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="CRM Illustration"
            className="w-full max-h-[580px] object-cover rounded-2xl shadow"
          />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-[#4f378a]">Facilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-16 px-4">
  {[
    {
      title: "College Database",
      desc: "Update and Maintain the details of your colleges",
      img: "https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Employee Database",
      desc: "Update and Maintain your Employee details",
      img: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=1147&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Trainer Database",
      desc: "Update and Maintain your Trainers Update",
      img: "https://images.unsplash.com/photo-1587691592099-24045742c181?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Exam Database",
      desc: "Update and Maintain your Exam Database",
      img: "https://images.unsplash.com/photo-1557989048-03456d01a26e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Proposal / Course Plan Generator",
      desc: "Generate College Proposals",
      img: "https://images.unsplash.com/photo-1603804449683-25636751db96?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Payslip Generator",
      desc: "Generate Course Plan Generator.",
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "TOE (Terms of Engagement)",
      desc: "TOE Generator",
      img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "TEF Generator",
      desc: "TEF Generator",
      img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ].map((item, index) => (
    <div key={index} className="flex flex-col pb-5 items-center text-center bg-white rounded-xl  shadow hover:shadow-md transition">
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-36 object-cover rounded-lg mb-3"
      />
      <span className="font-semibold text-sm sm:text-base">{item.title}</span>
      <span className="text-xs text-gray-500 mt-1 w-[60%]">{item.desc}</span>
    </div>
  ))}
</div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
          <h3 className="font-bold text-lg mb-2">MISSION</h3>
<p className="text-gray-700 mb-6">
  Our mission is to deliver high-quality, customized training programs that empower individuals and organizations to achieve their goals. We are dedicated to fostering a culture of continuous learning and professional growth, using innovative methods and practical skills to bridge knowledge gaps and create lasting value for our clients.
</p>
<h3 className="font-bold text-lg mb-2">VISION</h3>
<p className="text-gray-700">
  We envision a future where every learner has access to world-class education and training opportunities. By embracing innovation and adapting to evolving needs, we aim to be a trusted partner in personal and organizational development, empowering communities and driving positive change through transformative learning experiences.
</p>

          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
              alt="Mission Vision"
              className="w-full h-100 object-cover rounded-2xl shadow"
            />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
