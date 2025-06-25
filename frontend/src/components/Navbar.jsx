import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'COLLEGE', path: '/college' },
    { label: 'EMPLOYEE', path: '/employee' },
    { label: 'TRAINER', path: '/trainer' },
    { label: 'EXAM', path: '/exam' },
  ];

  return (
    <div className="w-full  shadow-sm bg-white border-b">
      {/* Top Navbar */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
        <div className="text-base font-bold text-gray-800 text-center md:text-left">
          SMART TRAINING RESOURCES INDIA PVT. LTD.
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-6 mt-4 md:mt-0 text-sm font-medium text-gray-700">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer transition duration-150 hover:text-[#54378a ${
                location.pathname === item.path
                  ? 'text-[#54378a font-semibold border-b-2 border-[#54378a pb-1'
                  : ''
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
