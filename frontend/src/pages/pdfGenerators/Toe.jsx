import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import usePageAccess from '../../components/useAccessPage';
import api from '../../libs/apiCall';
import Select from 'react-select';

const selectOptions = [
  { value: '', label: 'Select' },
  { value: 'By College', label: 'By College' },
  { value: 'By SMART', label: 'By SMART' },
  { value: 'By Self', label: 'By Self' }
];

const Toe = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("toegenerator");

  // College and POC data
  const [colleges, setColleges] = useState([]);
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [pocOptions, setPocOptions] = useState([]);
  const [selectedPoc, setSelectedPoc] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    collegeName: '',
    address: '',
    programmeName: '',
    eventsCovered: '',
    mode: '',
    duration: '',
    dates: '',
    batchDet: '',
    strength: '',
    batchNum: '',
    studentsPerBatch: '',
    sessionsPerDay: '',
    hours: '',
    FNfrom: '',
    FNto: '',
    ANfrom: '',
    ANto: '',
    travel: '',
    Accomodation: '',
    conveyance: '',
    food: '',
    spocName: '',
    spocdesignation: '',
    spocemail: '',
    spocmobile: '',
    smartSpoc: '',
    smartDesgination: '',
    smartEmail: '',
    smartmobile: '',
    landlinesmart: ''
  });

  // Fetch colleges and POCs on mount
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const collegesRes = await api.get(`/college/getall`);
      const colleges = collegesRes.data.data || [];
      // Fetch POCs for each college
      const collegesWithPocs = await Promise.all(
        colleges.map(async (college) => {
          try {
            const pocsRes = await api.get(`/college/${college.college_id}/getpocs`);
            return {
              ...college,
              pocs: pocsRes.data.data || [],
            };
          } catch {
            return { ...college, pocs: [] };
          }
        })
      );
      setColleges(collegesWithPocs);
      setCollegeOptions(
        collegesWithPocs.map(col => ({
          value: col.college_id,
          label: `${col.college_code} - ${col.college_name}`
        }))
      );
    } catch (error) {
      setColleges([]);
      setCollegeOptions([]);
    }
  };

  // When college changes, update address and POC options
  useEffect(() => {
    if (!selectedCollege) {
      setFormData(f => ({ ...f, collegeName: '', address: '', spocName: '', spocdesignation: '', spocemail: '', spocmobile: '' }));
      setPocOptions([]);
      setSelectedPoc(null);
      return;
    }
    const college = colleges.find(col => col.college_id === selectedCollege.value);
    setFormData(f => ({
      ...f,
      collegeName: college.college_name || '',
      address: college.location || ''
    }));
    setPocOptions(
      (college.pocs || []).map(poc => ({
        value: poc.poc_id,
        label: poc.poc_name,
        poc
      }))
    );
    setSelectedPoc(null);
    setFormData(f => ({
      ...f,
      spocName: '',
      spocdesignation: '',
      spocemail: '',
      spocmobile: ''
    }));
  // eslint-disable-next-line
  }, [selectedCollege]);

  // When POC changes, auto-fill SPOC fields
  useEffect(() => {
    if (!selectedPoc) {
      setFormData(f => ({
        ...f,
        spocName: '',
        spocdesignation: '',
        spocemail: '',
        spocmobile: ''
      }));
      return;
    }
    const poc = pocOptions.find(p => p.value === selectedPoc.value)?.poc;
    if (poc) {
      setFormData(f => ({
        ...f,
        spocName: poc.poc_name || '',
        spocdesignation: poc.poc_designation || '',
        spocemail: poc.poc_email || '',
        spocmobile: poc.poc_contact || ''
      }));
    }
  // eslint-disable-next-line
  }, [selectedPoc]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit logic
  const handleSubmit = async () => {
    const payload = { ...formData };
    try {
      const res = await api.post('/pdf/toe', payload, {
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
    <>
      <div className='fixed w-[100vw] z-[100]'>
        <Navbar />
      </div>
      <div className="min-h-screen bg-[#ffff] flex items-center justify-center py-8 px-2">
        <div className="max-w-7xl w-full p-1 md:p-2 relative overflow-hidden">
          <div className="relative z-10 p-6 text-white mt-10">
            <h1 className="text-3xl font-bold text-[#88139a] text-center tracking-wide">TERMS OF ENGAGEMENT</h1>
            <p className="text-center text-xl text-[#88139a] mt-2">Enter Programme Details</p>
          </div>
          <form className="relative z-10 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* College select */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">College</label>
                <Select
                  options={collegeOptions}
                  value={selectedCollege}
                  onChange={setSelectedCollege}
                  placeholder="Select College"
                  isClearable
                  classNamePrefix="react-select"
                />
              </div>
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Date</label>
                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                  readOnly
                />
              </div>
              {/* Programme Name */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Programme Name</label>
                <input
                  name="programmeName"
                  value={formData.programmeName}
                  onChange={handleChange}
                  placeholder="Programme Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* Key Elements Covered */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Key Elements Covered</label>
                <input
                  name="eventsCovered"
                  value={formData.eventsCovered}
                  onChange={handleChange}
                  placeholder="Key Elements Covered"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* Mode of Training */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Mode of Training</label>
                <input
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  placeholder="Mode of Training"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* Training Duration */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Training Duration</label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Training Duration"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* Training Dates */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Training Dates</label>
                <input
                  name="dates"
                  value={formData.dates}
                  onChange={handleChange}
                  placeholder="Training Dates"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* Batch Details */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Batch Details</label>
                <input
                  name="batchDet"
                  value={formData.batchDet}
                  onChange={handleChange}
                  placeholder="Batch Details"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* Total Student Strength */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Total Student Strength</label>
                <input
                  name="strength"
                  value={formData.strength}
                  onChange={handleChange}
                  placeholder="Total Student Strength"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* No of Batches */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">No of Batches</label>
                <input
                  name="batchNum"
                  value={formData.batchNum}
                  onChange={handleChange}
                  placeholder="No of Batches"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* No. of Students per Batch */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">No. of Students per Batch</label>
                <input
                  name="studentsPerBatch"
                  value={formData.studentsPerBatch}
                  onChange={handleChange}
                  placeholder="No. of Students per Batch"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* No. of Sessions per Day */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">No. of Sessions per Day</label>
                <input
                  name="sessionsPerDay"
                  value={formData.sessionsPerDay}
                  onChange={handleChange}
                  placeholder="No. of Sessions per Day"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* Duration per Session (Hrs) */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Duration per Session (Hrs)</label>
                <input
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  placeholder="Duration per Session"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* FN Session From */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">FN Session From</label>
                <input
                  name="FNfrom"
                  value={formData.FNfrom}
                  onChange={handleChange}
                  placeholder="FN From (am)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* FN Session To */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">FN Session To</label>
                <input
                  name="FNto"
                  value={formData.FNto}
                  onChange={handleChange}
                  placeholder="FN To (pm)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* AN Session From */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">AN Session From</label>
                <input
                  name="ANfrom"
                  value={formData.ANfrom}
                  onChange={handleChange}
                  placeholder="AN From (pm)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* AN Session To */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">AN Session To</label>
                <input
                  name="ANto"
                  value={formData.ANto}
                  onChange={handleChange}
                  placeholder="AN To (pm)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* Trainers’ Travel */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Trainers’ Travel</label>
                <select
                  name="travel"
                  value={formData.travel}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                >
                  {selectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* Accommodation */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Accommodation</label>
                <select
                  name="Accomodation"
                  value={formData.Accomodation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                >
                  {selectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* Conveyance */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Conveyance</label>
                <select
                  name="conveyance"
                  value={formData.conveyance}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                >
                  {selectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* Food */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">Food</label>
                <select
                  name="food"
                  value={formData.food}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                >
                  {selectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {/* POC select */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">SPOC Name</label>
                <Select
                  options={pocOptions}
                  value={selectedPoc}
                  onChange={setSelectedPoc}
                  placeholder="Select SPOC"
                  isClearable
                  classNamePrefix="react-select"
                  isDisabled={pocOptions.length === 0}
                />
              </div>
              {/* SPOC Designation */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">SPOC Designation</label>
                <input
                  name="spocdesignation"
                  value={formData.spocdesignation}
                  onChange={handleChange}
                  placeholder="SPOC Designation"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                  readOnly
                />
              </div>
              {/* SPOC Email */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">SPOC Email</label>
                <input
                  name="spocemail"
                  value={formData.spocemail}
                  onChange={handleChange}
                  placeholder="SPOC Email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                  readOnly
                />
              </div>
              {/* SPOC Mobile */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">SPOC Mobile</label>
                <input
                  name="spocmobile"
                  value={formData.spocmobile}
                  onChange={handleChange}
                  placeholder="SPOC Mobile"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                  readOnly
                />
              </div>
              {/* SMART SPOC */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">SMART SPOC</label>
                <input
                  name="smartSpoc"
                  value={formData.smartSpoc}
                  onChange={handleChange}
                  placeholder="SMART SPOC"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* SMART Designation */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">SMART Designation</label>
                <input
                  name="smartDesgination"
                  value={formData.smartDesgination}
                  onChange={handleChange}
                  placeholder="SMART Designation"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* SMART Email */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">SMART Email</label>
                <input
                  name="smartEmail"
                  value={formData.smartEmail}
                  onChange={handleChange}
                  placeholder="SMART Email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* SMART Mobile */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">SMART Mobile</label>
                <input
                  name="smartmobile"
                  value={formData.smartmobile}
                  onChange={handleChange}
                  placeholder="SMART Mobile"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              {/* SMART Landline */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">SMART Landline</label>
                <input
                  name="landlinesmart"
                  value={formData.landlinesmart}
                  onChange={handleChange}
                  placeholder="SMART Landline"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white/80 focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
            </div>
          </form>
          <div className='w-full flex justify-center items-center mt-6 mb-8'>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="bg-gradient-to-r from-[#88139a] to-[#88139a] hover:from-[#88139a] hover:to-[#88139a] text-white font-semibold py-3 px-12 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              Generate TOE
            </button>
          </div>
          <div className="relative z-10 bg-gray-50 p-4 text-center text-sm text-gray-500 border-t rounded-b-2xl">
            Fill all fields
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Toe;
