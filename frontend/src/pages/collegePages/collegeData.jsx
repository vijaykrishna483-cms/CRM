import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const CollegeData = () => {
  const [collegeInfo, setCollegeInfo] = useState({
    name: '',
    location: '',
    state: '',
    code: '',
  });

  const [pocInfo, setPocInfo] = useState({
    name: '',
    designation: '',
    mail: '',
    contact: '',
  });

  const [collegeIdForPOC, setCollegeIdForPOC] = useState(''); // NEW
  const [collegeData, setCollegeData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const collegesRes = await api.get(`/college/getall`);
      const colleges = collegesRes.data.data || [];

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

      setCollegeData(collegesWithPocs);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast.error('Failed to fetch colleges.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPocInfo({ ...pocInfo, [e.target.name]: e.target.value });
  };

  const handleCollegeChange = (e) => {
    setCollegeInfo({ ...collegeInfo, [e.target.name]: e.target.value });
  };

  const handleAddCollege = async () => {
    if (!collegeInfo.name || !collegeInfo.location || !collegeInfo.state || !collegeInfo.code) {
      toast.info('Please fill in all college details.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/college/addCollege`, {
        collegeName: collegeInfo.name,
        location: collegeInfo.location,
        state: collegeInfo.state,
        collegeCode: collegeInfo.code,
      });

      if (res.data.status !== 'success') throw new Error(res.data.message);

      await fetchColleges();
      setCollegeInfo({ name: '', location: '', state: '', code: '' });

      toast.success('College added successfully!');
    } catch (error) {
      toast.error(error.message || 'Error adding college');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPOC = async () => {
    if (!collegeIdForPOC || !pocInfo.name || !pocInfo.designation || !pocInfo.mail || !pocInfo.contact) {
      toast.info('Please fill all fields including college ID.');
      return;
    }

const matchedCollege = collegeData.find((col) => col.college_code.toString() === collegeIdForPOC);
    if (!matchedCollege) {
      toast.error('College ID does not exist.');
      return;
    }

    setLoading(true);
    try {
   const res = await api.post(`/college/addpoc`, {
  collegeId: matchedCollege.college_id, // ✅ Use college_id from matched college_code
  pocName: pocInfo.name,
  pocDesignation: pocInfo.designation,
  pocEmail: pocInfo.mail,
  pocContact: pocInfo.contact,
});

      if (res.data.status !== 'success') throw new Error(res.data.message);

      await fetchColleges();
      setPocInfo({ name: '', designation: '', mail: '', contact: '' });
      setCollegeIdForPOC('');
      toast.success('POC added successfully!');
    } catch (error) {
      toast.error(error.message || 'Error adding POC');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePOC = async (pocId) => {
    if (!window.confirm('Delete this POC?')) return;

    setLoading(true);
    try {
      await api.delete(`/college/delete/${pocId}`);
      await fetchColleges();
      toast.success('POC deleted');
    } catch {
      toast.error('Error deleting POC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">College Information Portal</h1>

      {/* College Add Section */}
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-6">
        <h2 className="text-lg font-semibold text-[#4f378a]">Add New College</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="College Name" value={collegeInfo.name} onChange={handleCollegeChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="location" placeholder="Location" value={collegeInfo.location} onChange={handleCollegeChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="state" placeholder="State" value={collegeInfo.state} onChange={handleCollegeChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="code" placeholder="College Code" value={collegeInfo.code} onChange={handleCollegeChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={handleAddCollege}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}>
          {loading ? 'Adding...' : 'Add College'}
        </button>
      </div>

      {/* POC Add Section */}
      <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 space-y-4">
        <h2 className="text-lg font-semibold text-[#4f378a]">Add Point of Contact</h2>
        <input type="text" placeholder="College ID" value={collegeIdForPOC}
          onChange={(e) => setCollegeIdForPOC(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="name" placeholder="POC Name" value={pocInfo.name} onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="designation" placeholder="Designation" value={pocInfo.designation} onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="mail" placeholder="Email" value={pocInfo.mail} onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <input name="contact" placeholder="Contact" value={pocInfo.contact} onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={handleAddPOC}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}>
          {loading ? 'Adding...' : 'Add POC'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4 text-[#4f378a]">College Entries</h3>
        <table className="w-full text-sm border-collapse">
          <thead className="text-gray-600 bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">College Code</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">State</th>
              <th className="p-2 text-left">POC Name</th>
              <th className="p-2 text-left">Designation</th>
              <th className="p-2 text-left">Contact</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collegeData.map((college) => (
              <React.Fragment key={college.college_id}>
                <tr className="hover:bg-gray-50 border-t">
                  <td className="p-2 text-red-500">{college.college_code}</td>
                  <td className="p-2">{college.college_name}</td>
                  <td className="p-2">{college.location}</td>
                  <td className="p-2">{college.state}</td>
                  <td colSpan="4" className="p-2">
                    {(!college.pocs || college.pocs.length === 0) ? 'No POCs' : ''}
                  </td>
                </tr>
                {(college.pocs || []).map((poc) => (
                  <tr key={poc.poc_id} className="hover:bg-gray-50 border-t">
                    <td></td><td></td><td></td><td></td>
                    <td className="p-2">{poc.poc_name}</td>
                    <td className="p-2">{poc.poc_designation}</td>
                    <td className="p-2">{poc.poc_contact}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDeletePOC(poc.poc_id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete POC"
                      >
                        <MinusCircle size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollegeData;
