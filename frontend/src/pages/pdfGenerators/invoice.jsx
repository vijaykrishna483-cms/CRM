import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import usePageAccess from '../../components/useAccessPage';
import api from '../../libs/apiCall';

// Number to words (Indian format)
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

const emptyLine = { sl: '', sacNum: '', desc: '', batch: '', days: '', rate: '', amt: '' };

const Invoice = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("payslip");

  const [formData, setFormData] = useState({
    date: '',
    collegeName: '',
    address1: '',
    address2: '',
    address3: '',
    lines: [ { ...emptyLine } ], // at least one line
    total: '',
    totalInwords: '',
    gst: '',
    finalTotal: ''
  });

  // Add or remove line items
  const addLine = () => {
    if (formData.lines.length < 4) {
      setFormData({ ...formData, lines: [ ...formData.lines, { ...emptyLine } ] });
    }
  };
  const removeLine = (idx) => {
    if (formData.lines.length > 1) {
      const newLines = formData.lines.filter((_, i) => i !== idx);
      setFormData({ ...formData, lines: newLines });
      recalculateTotals(newLines);
    }
  };

  // Handle changes for both form and lines
  const handleChange = (e, idx = null) => {
    if (idx !== null) {
      // Line item change
      const { name, value } = e.target;
      const newLines = formData.lines.map((line, i) =>
        i === idx ? { ...line, [name]: value } : line
      );
      setFormData({ ...formData, lines: newLines });
      recalculateTotals(newLines);
    } else {
      // Other fields
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  // Calculate total, GST, final total, and total in words
  const recalculateTotals = (lines) => {
    const total = lines.reduce((sum, line) => sum + (parseFloat(line.amt) || 0), 0);
    const gst = +(total * 0.09).toFixed(2);
    const finalTotal = +(total + 2 * gst).toFixed(2);
    setFormData((prev) => ({
      ...prev,
      total: total ? total.toFixed(2) : '',
      totalInwords: total ? numberToWords(total) : '',
      gst: total ? gst.toFixed(2) : '',
      finalTotal: total ? finalTotal.toFixed(2) : ''
    }));
  };

  // Prepare payload for backend (exclude empty lines)
  const preparePayload = () => {
    const lines = formData.lines.filter(
      (line) => line.sl || line.sacNum || line.desc || line.batch || line.days || line.rate || line.amt
    );
    const payload = {
      date: formData.date,
      collegeName: formData.collegeName,
      address1: formData.address1,
      address2: formData.address2,
      address3: formData.address3,
      total: formData.total,
      totalInwords: formData.totalInwords,
      gst: formData.gst,
      finalTotal: formData.finalTotal,
    };
    // Add up to 4 lines
    for (let i = 0; i < 4; i++) {
      const line = lines[i] || {};
      payload[`sl${i+1}`] = line.sl || '';
      payload[`sacNum${i+1}`] = line.sacNum || '';
      payload[`desc${i+1}`] = line.desc || '';
      payload[`batch${i+1}`] = line.batch || '';
      payload[`Days${i+1}`] = line.days || '';
      payload[`Rate${i+1}`] = line.rate || '';
      payload[`Amt${i+1}`] = line.amt || '';
    }
    return payload;
  };

  const handleSubmit = async () => {
    const payload = preparePayload();
    try {
      const res = await api.post('/pdf/invoice', payload, {
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
      {/* ...Access Denied UI... */}
    </div>
  );
  if (permissionLoading) return <div>Loading...</div>;

  return (
    <>
      <div className='fixed w-[100vw] z-[100]'>
        <Navbar />
      </div>
      <div className="min-h-screen bg-[#ffff] flex items-center justify-center py-8 px-2">
        <div className="max-w-2xl w-full p-1 md:p-2 relative overflow-hidden">
          <div className="relative z-10 p-6 text-white mt-10">
            <h1 className="text-3xl font-bold text-[#88139a] text-center tracking-wide">INVOICE GENERATOR</h1>
            <p className="text-center text-xl text-[#88139a] mt-2">Enter your details below</p>
          </div>
          <form className="relative z-10 p-6 space-y-6">
            {/* College, Date, Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">College Name</label>
                <input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="College Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Date</label>
                <input name="date" type="date" value={formData.date} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">Address</label>
              <div className="space-y-3">
                <input name="address1" value={formData.address1} onChange={handleChange} placeholder="Address Line 1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]" />
                <input name="address2" value={formData.address2} onChange={handleChange} placeholder="Address Line 2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]" />
                <input name="address3" value={formData.address3} onChange={handleChange} placeholder="Address Line 3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]" />
              </div>
            </div>
            {/* Line Items */}
            <div>
              <label className="block text-sm font-semibold text-[#4f378a] mb-2">Invoice Items</label>
              {formData.lines.map((line, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-2 items-end">
                  <input name="sl" value={line.sl} onChange={e => handleChange(e, idx)} placeholder="SL No."
                    className="border border-gray-300 rounded-lg px-2 py-2 bg-white/80 text-xs" />
                  <input name="sacNum" value={line.sacNum} onChange={e => handleChange(e, idx)} placeholder="SAC Number"
                    className="border border-gray-300 rounded-lg px-2 py-2 bg-white/80 text-xs" />
                  <input name="desc" value={line.desc} onChange={e => handleChange(e, idx)} placeholder="Description"
                    className="border border-gray-300 rounded-lg px-2 py-2 bg-white/80 text-xs" />
                  <input name="batch" value={line.batch} onChange={e => handleChange(e, idx)} placeholder="Batch"
                    className="border border-gray-300 rounded-lg px-2 py-2 bg-white/80 text-xs" />
                  <input name="days" value={line.days} onChange={e => handleChange(e, idx)} placeholder="Days"
                    className="border border-gray-300 rounded-lg px-2 py-2 bg-white/80 text-xs" />
                  <input name="rate" value={line.rate} onChange={e => handleChange(e, idx)} placeholder="Rate"
                    className="border border-gray-300 rounded-lg px-2 py-2 bg-white/80 text-xs" />
                  <input name="amt" value={line.amt} onChange={e => handleChange(e, idx)} placeholder="Amount"
                    className="border border-gray-300 rounded-lg px-2 py-2 bg-white/80 text-xs" />
                  {formData.lines.length > 1 && (
                    <button type="button" onClick={() => removeLine(idx)} className="text-red-500 ml-1 text-xs">Remove</button>
                  )}
                </div>
              ))}
              {formData.lines.length < 4 && (
                <button type="button" onClick={addLine}
                  className="mt-2 px-3 py-1 bg-[#7c3aed] text-white rounded text-xs">+ Add Item</button>
              )}
            </div>
            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Total</label>
                <input name="total" value={formData.total} readOnly placeholder="Total"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:ring-2 focus:ring-[#7c3aed]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">GST (18%)</label>
                <input name="gst" value={formData.gst} readOnly placeholder="GST"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:ring-2 focus:ring-[#7c3aed]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Final Total</label>
                <input name="finalTotal" value={formData.finalTotal} readOnly placeholder="Final Total"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:ring-2 focus:ring-[#7c3aed]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Total (in words)</label>
                <input name="totalInwords" value={formData.totalInwords} readOnly placeholder="Total in words"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 focus:ring-2 focus:ring-[#7c3aed]" />
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={(e) => { e.preventDefault(); handleSubmit(); }}
                className="bg-gradient-to-r from-[#88139a] to-[#88139a] hover:from-[#88139a] hover:to-[#88139a] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              >
                Generate Invoice
              </button>
            </div>
          </form>
          <div className="relative z-10 bg-gray-50 p-4 text-center text-sm text-gray-500 border-t rounded-b-2xl">
            Fill all fields
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Invoice;
