import axios from 'axios';
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import usePageAccess from '../../components/useAccessPage';
import api from '../../libs/apiCall';

// Number to words function (Indian format)
const numberToWords = (num) => {
  if (isNaN(num)) return '';
  const integerPart = Math.floor(Math.abs(num));
  const decimalPart = Math.round((Math.abs(num) - integerPart) * 100);
  const convert = (n) => {
    if (n === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + (n % 100 ? convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand ' + (n % 1000 ? convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh ' + (n % 100000 ? convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore ' + (n % 10000000 ? convert(n % 10000000) : '');
  };
  let words = convert(integerPart) + ' Rupees';
  if (decimalPart > 0) {
    words += ' and ' + convert(decimalPart) + ' Paisa';
  }
  return words;
};

const Toe = () => {
      const { allowed, loading: permissionLoading } = usePageAccess("tefgenerator");


  const [formData, setFormData] = useState({
    date: '',
    collegeName: '',
    address1: '',
    address2: '',
    address3: '',
    sl1: '',
    sacNum1: '',
    desc1: '',
    batch1: '',
    Days1: '',
    Rate1: '',
    Amt1: '',
    total: '',
    totalInwords: '',
    gst: '',
    finalTotal: ''
  });

  // Auto-calculate fields when total changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };
    if (name === 'total') {
      const num = parseFloat(value) || 0;
      const gst = +(num * 0.09).toFixed(2);
      const finalTotal = +(num + 2 * gst).toFixed(2);
      updatedForm.totalInwords = numberToWords(num);
      updatedForm.gst = gst;
      updatedForm.finalTotal = finalTotal;
    }
    setFormData(updatedForm);
  };

  const handleSubmit = async () => {
    const payload = { ...formData };
    try {
      const res = await api.post('/pdf/tef', payload, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'generated.docx';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error generating DOCX:', err);
      // toast.error('Failed to generate document.');
    }
  };


        if (!allowed && !permissionLoading) return (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="flex flex-col items-center bg-white px-8 py-10 ">
      <svg
        className="w-14 h-14 text-red-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 9l-6 6m0-6l6 6"
          stroke="red"
          strokeWidth="2"
        />
      </svg>
      <h2 className="text-2xl font-bold text-[#6750a4] mb-2">Access Denied</h2>
      <p className="text-gray-600 text-center mb-4">
        You do not have permission to view this page.<br />
        Please contact the administrator if you believe this is a mistake.
      </p>
      <button
        className="mt-2 px-5 py-2 rounded-lg bg-[#6750a4] text-white font-semibold hover:bg-[#01291f] transition"
        onClick={() => window.location.href = "/"}
      >
        Go to Home
      </button>
    </div>
  </div>
);
  if (permissionLoading) return <div>Loading...</div>;  

  


  return (
    <>   <div className='fixed w-[100vw] z-[100]'>
        <Navbar/>
        </div> 
    <div className="min-h-screen bg-[#ffff]  flex items-center justify-center py-8 px-2">
      <div className="max-w-2xl w-full p-1 md:p-2 relative overflow-hidden">
        {/* Card Pattern Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
      
        />
        {/* Header Section */}
        <div className="relative z-10   p-6 text-white mt-10">
          <h1 className="text-3xl font-bold text-[#88139a] text-center tracking-wide">TEF GENERATOR</h1>
          <p className="text-center text-xl text-[#88139a] mt-2">Enter your details below</p>
        </div>
        {/* Form Section */}
        <form className="relative z-10 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">Date</label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">College Name</label>
              <input
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="College Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
          </div>
          
          {/* Address Section */}
          <div>
            <label className="block text-sm font-semibold text-[#4f378a] mb-1">Address</label>
            <div className="space-y-3">
              <input
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                placeholder="Address Line 1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
              <input
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                placeholder="Address Line 2"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
              <input
                name="address3"
                value={formData.address3}
                onChange={handleChange}
                placeholder="Address Line 3"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">SL No.</label>
              <input
                name="sl1"
                value={formData.sl1}
                onChange={handleChange}
                placeholder="SL No."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">SAC Number</label>
              <input
                name="sacNum1"
                value={formData.sacNum1}
                onChange={handleChange}
                placeholder="SAC Number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#4f378a] mb-1">Description</label>
            <input
              name="desc1"
              value={formData.desc1}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">Batch</label>
              <input
                name="batch1"
                value={formData.batch1}
                onChange={handleChange}
                placeholder="Batch"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">Days</label>
              <input
                name="Days1"
                value={formData.Days1}
                onChange={handleChange}
                placeholder="Days"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">Rate</label>
              <input
                name="Rate1"
                value={formData.Rate1}
                onChange={handleChange}
                placeholder="Rate"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">Amount</label>
              <input
                name="Amt1"
                value={formData.Amt1}
                onChange={handleChange}
                placeholder="Amount"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">Total</label>
              <input
                name="total"
                value={formData.total}
                onChange={handleChange}
                placeholder="Total"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                type="number"
              />
            </div>
          </div>

          {/* GST and Final Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">GST (9%)</label>
              <input
                name="gst"
                value={formData.gst}
                readOnly
                placeholder="GST"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">Final Total</label>
              <input
                name="finalTotal"
                value={formData.finalTotal}
                readOnly
                placeholder="Final Total"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#4f378a] mb-1">Total (in words)</label>
            <input
              name="totalInwords"
              value={formData.totalInwords}
              onChange={handleChange}
              placeholder="Total in words"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
            />
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="bg-gradient-to-r from-[#88139a] to-[#88139a] hover:from-[#88139a] hover:to-[#88139a] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              Generate Tef
            </button>
          </div>
        </form>
        <div className="relative z-10 bg-gray-50 p-4 text-center text-sm text-gray-500 border-t rounded-b-2xl">
          Fill all fields
        </div>
      </div>
    </div>

<Footer/>
    </>
  );
};

export default Toe;
