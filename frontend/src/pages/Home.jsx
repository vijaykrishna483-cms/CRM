import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const cards = [
    {
      title: "College Database",
      desc: "Update and Maintain the details of your colleges",
      img: "https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1176&auto=format&fit=crop",
      path: "/college"
    },
    {
      title: "Employee Database",
      desc: "Update and Maintain your Employee details",
      img: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=1147&auto=format&fit=crop",
      path: "/employee"
    },
    {
      title: "Trainer Database",
      desc: "Update and Maintain your Trainers Update",
      img: "https://images.unsplash.com/photo-1587691592099-24045742c181?q=80&w=1173&auto=format&fit=crop",
      path: "/trainer"
    },
    {
      title: "Exam Database",
      desc: "Update and Maintain your Exam Database",
      img: "https://images.unsplash.com/photo-1557989048-03456d01a26e?q=80&w=735&auto=format&fit=crop",
      path: "/exam"
    },
    {
      title: "TEF",
      desc: "Generate TEF Mails",
      img: "https://images.unsplash.com/photo-1603804449683-25636751db96?q=80&w=1074&auto=format&fit=crop",
      path: "/tef"
    },
    {
      title: "Payslip Generator",
      desc: "Generate Course Plan Generator.",
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1170&auto=format&fit=crop",
      path: "/payslip"
    },
    {
      title: "TOE (Terms of Engagement)",
      desc: "TOE Generator",
      img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1169&auto=format&fit=crop",
      path: "/toe"
    },
    {
      title: "Generate INVOICE ",
      desc: "Generate INVOICE ",
      img: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1332&auto=format&fit=crop",
      path: "/invoice"
    },
    {
      title: "TDS",
      desc: "TDS",
      img: "https://i.pinimg.com/736x/30/b0/01/30b001306e662f8c7ef387c2bf2edb77.jpg",
      path: "/tds"
    }
  ];

  return (
    <div className="w-full bg-white overflow-x-hidden">
      <div className="fixed w-full z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
     <div
  className="w-full  min-h-screen flex items-center justify-center relative bg-cover bg-center mb-10 shadow"
  style={{
    backgroundImage: `url("https://wallpaperaccess.com/full/3901076.png")`,
  }}
>
  <div className="absolute inset-0 bg-black/60 rounded-b-3xl" />
  <div className="relative z-10 w-full max-w-3xl px-4 sm:px-8 md:px-16 text-center flex flex-col items-center"
       data-aos="fade-up">
    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow">
      CUSTOMER RELATIONSHIP
      <br /> MANAGEMENT
    </h1>
    <p className="text-white text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-6">
      This page helps employees manage their tasks and enhance communication with customers.
    </p>
    <button
      onClick={() => navigate('/login')}
      className="
        bg-white text-gray-900 font-semibold px-6 py-2 rounded-full
        shadow transition duration-200
        hover:bg-[#000]
        hover:text-[#fff] hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-[#4f378a]
      "
    >
      Employee Sign In
    </button>
  </div>
</div>

      {/* Facilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#4f378a]" data-aos="fade-right">Facilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mb-12">
          {cards.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="cursor-pointer group transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl bg-white rounded-xl pb-5"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              tabIndex={0}
              role="button"
              aria-label={item.title}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(item.path)}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-32 sm:h-36 md:h-44 object-cover rounded-t-xl"
              />
              <div className="flex flex-col items-center text-center mt-3 px-2 sm:px-4">
                <span className="font-semibold text-sm sm:text-base group-hover:text-[#4f378a] transition">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500 mt-1">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16" data-aos="fade-up">
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-2">MISSION</h3>
            <p className="text-gray-700 mb-6 text-sm sm:text-base">
              Our mission is to deliver high-quality, customized training programs that empower individuals and organizations to achieve their goals.
              We are dedicated to fostering a culture of continuous learning and professional growth, using innovative methods and practical skills to bridge knowledge gaps and create lasting value for our clients.
            </p>
            <h3 className="font-bold text-base sm:text-lg mb-2">VISION</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              We envision a future where every learner has access to world-class education and training opportunities.
              By embracing innovation and adapting to evolving needs, we aim to be a trusted partner in personal and organizational development, empowering communities and driving positive change through transformative learning experiences.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
              alt="Mission Vision"
              className="w-full h-52 sm:h-64 md:h-80 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
