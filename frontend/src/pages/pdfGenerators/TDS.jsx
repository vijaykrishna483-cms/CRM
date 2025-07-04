import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../libs/apiCall';

function ZipUploader() {
  const [tableData, setTableData] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('zipFile', file);

    try {
      const res = await api.post('/zip/upload', formData);
      setTableData(res.data);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar/>
      <div className="max-w-3xl h-full pb-40 mx-auto  p-6  pt-40">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Upload ZIP File</h2>

        <div className="flex items-center justify-center">
          <input
            type="file"
            accept=".zip"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />
        </div>

        {tableData.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">File Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">PAN</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
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
      <Footer/>
    </div>
  );
}

export default ZipUploader;
