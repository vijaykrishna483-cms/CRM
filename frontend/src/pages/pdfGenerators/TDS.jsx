import React, { useState, useRef } from 'react';
import api from '../../libs/apiCall';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function ZipUploader() {
  const [tableData, setTableData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('zipFile', file);

    setUploading(true);
    try {
      const res = await api.post('/zip/upload', formData);
      setTableData(res.data);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-start pt-32 px-4">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Upload ZIP File</h2>

          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept=".zip"
              onChange={handleUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md text-sm font-medium transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Select ZIP File to Upload'}
            </button>
          </div>

          {tableData.length > 0 && (
            <div className="mt-10 overflow-x-auto border rounded-lg">
              <table className="min-w-full bg-white border-collapse">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">File Name</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">PAN</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tableData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-700">{row.fileName}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{row.pan}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ZipUploader;
