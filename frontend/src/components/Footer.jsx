import React from 'react';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* Company Info */}
        <div className="flex flex-col gap-4 max-w-sm">
          <h1 className="text-xl font-bold text-gray-800 leading-tight">
            SMART TRAINING <br /> RESOURCES INDIA PVT. LTD.
          </h1>
          <p className="text-gray-600 text-sm">
            Empowering learners and professionals through efficient CRM tools, resources, and training infrastructure.
          </p>
          <div className="flex gap-4 text-gray-500 text-xl mt-2">
            <a href="#"><FaFacebookF className="hover:text-blue-600 transition" /></a>
            <a href="#"><FaLinkedinIn className="hover:text-blue-700 transition" /></a>
            <a href="#"><FaYoutube className="hover:text-red-600 transition" /></a>
            <a href="#"><FaInstagram className="hover:text-pink-500 transition" /></a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm text-gray-600">
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Navigation</h2>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/college" className="hover:underline">College</Link></li>
              <li><Link to="/employee" className="hover:underline">Employee</Link></li>
              <li><Link to="/trainer" className="hover:underline">Trainer</Link></li>
              <li><Link to="/exam" className="hover:underline">Exam</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Documents</h2>
            <ul className="space-y-2">
              <li><Link to="/tef" className="hover:underline">TEF Generator</Link></li>
              <li><Link to="/toe" className="hover:underline">TOE Generator</Link></li>
              <li><Link to="/invoice" className="hover:underline">Invoice</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Account</h2>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:underline">Login</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
