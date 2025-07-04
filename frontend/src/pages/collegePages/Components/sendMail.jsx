import React, { useEffect, useState } from 'react';
import api from '../../../libs/apiCall.js';

const getStatusBadge = (status) => {
  const value = status?.toLowerCase();
  if (value === 'success' || value === 'sendmail') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        Sent
      </span>
    );
  }
  if (value === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
        <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
      -
    </span>
  );
};

const SendMail = () => {
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [filesWithCodes, setFilesWithCodes] = useState([]);
  const [sendingId, setSendingId] = useState(null);

  // Fetch uploaded files
  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await api.get('/college/upload/get');
      setFiles(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setFiles([]);
    }
    setLoadingFiles(false);
  };

  // Fetch proposals
const fetchProposals = async () => {
  setLoadingProposals(true);
  try {
    const res = await api.get("/college/getproposals");
    const proposalsList = res.data.data || [];

    const filteredProposals = proposalsList.filter(
      proposal => proposal.status === 'sendMail' || proposal.status === 'uploaded'
    );

    setProposals(filteredProposals);
  } catch (err) {
    setProposals([]);
  } finally {
    setLoadingProposals(false);
  }
};


  useEffect(() => {
    fetchFiles();
    fetchProposals();
  }, []);

  // Merge proposal info into files
  useEffect(() => {
    if (!loadingFiles && !loadingProposals) {
      const proposalMap = {};
      proposals.forEach(p => {
        proposalMap[p.proposal_id] = p;
      });

      const enrichedFiles = files.map(file => {
        const proposal = proposalMap[file.proposal_id] || {};
        return {
          ...file,
          proposal_code: proposal.proposal_code || '-',
          status: proposal.status || '-'
        };
      });

      setFilesWithCodes(enrichedFiles);
    }
  }, [files, proposals, loadingFiles, loadingProposals]);

  // Send Mail Handler
  const handleSendMail = async (proposalId) => {
    setSendingId(proposalId);
    try {
      await api.put(`/college/proposal/${proposalId}`, { status: 'sendMail' });
      fetchFiles(); 
      fetchProposals(); // Refresh proposals to update status
    } catch (err) {
      alert('Failed to send mail. Please try again.');
    } finally {
      setSendingId(null);
    }
  };
   const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800';
      case 'sendMail':
        return 'bg-purple-100 text-purple-800';
      case 'active':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-8 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-[#4f378a] text-center">Mail Sent Updation</h3>

        {loadingFiles ? (
          <div className="text-gray-500 text-center py-8">Loading files...</div>
        ) : filesWithCodes.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No proposal files found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-[#f3e6f1] text-left text-gray-800">
                  {/* <th className="px-4 py-3 border-b">ID</th> */}
                  <th className="px-4 py-3 border-b">Proposal Code</th>
                  <th className="px-4 py-3 border-b">Status</th>
                  <th className="px-4 py-3 border-b">ZIP File</th>
                  <th className="px-4 py-3 border-b">POC Red Email</th>
                  <th className="px-4 py-3 border-b">Uploaded At</th>
                  <th className="px-4 py-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
{filesWithCodes
  .filter(file => file.status === 'sendMail' || file.status === 'uploaded')
  .map((file, index) => (                  <tr
                    key={file.id}
                    className={
                      (index % 2 === 0 ? 'bg-white' : 'bg-gray-50') +
                      ' transition hover:bg-[#f9f6fd]'
                    }
                  >
                    {/* <td className="px-4 py-2 border-b font-medium">{file.id}</td> */}
                    <td className="px-4 py-2 border-b">{file.proposal_code}</td>
<td className="px-4 py-2 border-b">
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(file.status)}`}>
    {file.status}
  </span>
</td>                    <td className="px-4 py-2 border-b break-all">
                      <a
                        href={file.zip_file_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline font-medium"
                      >
                        Open
                      </a>
                    </td>
                    <td className="px-4 py-2 border-b">{file.poc_red_email}</td>
                    <td className="px-4 py-2 border-b">{new Date(file.uploaded_at).toLocaleString()}</td>
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => handleSendMail(file.proposal_id)}
                        disabled={file.status === 'sendMail' || sendingId === file.proposal_id}
                        className={`px-5 py-1.5 rounded font-semibold text-xs transition-all ${
                          file.status === 'sendMail'
                            ? 'bg-green-200 text-green-800 cursor-not-allowed'
                            : sendingId === file.proposal_id
                            ? 'bg-[#4f378a] text-white opacity-70 cursor-wait'
                            : 'bg-[#4f378a] hover:bg-[#372966] text-white'
                        }`}
                      >
                        {file.status === 'sendMail'
                          ? 'Sent'
                          : sendingId === file.proposal_id
                          ? 'Sending...'
                          : 'Send'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMail;
