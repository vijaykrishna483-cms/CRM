import React from 'react';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around gap-8">
        {/* Left: Site Info & Social Icons */}
        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-semibold text-left">SMART TRAINING <br/>RESOURCES INDIA PVT. LTD.</h1>
          <div className="flex gap-4 text-gray-500 text-xl">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

        {/* Right: Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm text-gray-600">
          {[...Array(3)].map((_, colIndex) => (
            <div key={colIndex}>
              <h2 className="font-semibold text-gray-800 mb-3">Topic</h2>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Page</a></li>
                <li><a href="#" className="hover:underline">Page</a></li>
                <li><a href="#" className="hover:underline">Page</a></li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
