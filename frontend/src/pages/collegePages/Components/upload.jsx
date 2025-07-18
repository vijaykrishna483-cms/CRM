import React, { useState, useEffect } from "react";
import api from "../../../libs/apiCall.js";
import { toast } from "react-toastify";

const Upload = () => {
  const [proposalId, setProposalId] = useState("");
  const [pocRedEmail, setPocRedEmail] = useState("");
  const [zipFileLink, setZipFileLink] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const [filesWithCodes, setFilesWithCodes] = useState([]);

  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await api.get("/college/upload/get");
      setFiles(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setFiles([]);
    }
    setLoadingFiles(false);
  };

  const fetchProposals = async () => {
    setLoadingProposals(true);
    try {
      const res = await api.get("/college/getproposals");
      const proposalsList = res.data.data || [];
      setProposals(proposalsList);
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

  useEffect(() => {
    if (!loadingFiles && !loadingProposals) {
      const proposalMap = {};
      proposals.forEach((p) => {
        proposalMap[p.proposal_id] = p;
      });

      const enrichedFiles = files.map((file) => {
        const proposal = proposalMap[file.proposal_id] || {};
        return {
          ...file,
          proposal_code: proposal.proposal_code || "-",
          status: proposal.status || "-",
        };
      });

      setFilesWithCodes(enrichedFiles);
    }
  }, [files, proposals, loadingFiles, loadingProposals]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setUploadStatus("");

  if (!proposalId || !pocRedEmail || !zipFileLink) {
    setUploadStatus("Please fill all fields and provide a ZIP file link.");
    return;
  }
// console.log(files)
  const alreadyUploaded = files.some(
    (file) => file.proposal_id === proposalId
  );

  if (alreadyUploaded) {
    toast.error("This proposal has already been uploaded.");
    return;
  }

  setIsSubmitting(true); // Prevent duplicate submits
  try {
    await api.post("/college/upload/add", {
      proposal_id: proposalId,
      zip_file_link: zipFileLink,
      poc_red_email: pocRedEmail,
    });

    await api.put(`/college/proposal/${proposalId}`, {
      status: "uploaded",
    });

    setUploadStatus("Proposal file link saved successfully!");
    setProposalId("");
    setPocRedEmail("");
    setZipFileLink("");

    fetchFiles();
    fetchProposals();
  } catch (error) {
    setUploadStatus("Upload failed. Please try again.");
  } finally {
    setIsSubmitting(false); // Allow future submits
  }
};
const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "uploaded":
        return "bg-blue-100 text-blue-800";
      case "Mail Sent":
        return "bg-purple-100 text-purple-800";
      case "active":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const [redEmails, setRedEmails] = useState([]);
  const [loadingRedEmails, setLoadingRedEmails] = useState(true);

  useEffect(() => {
    const fetchRedEmails = async () => {
      setLoadingRedEmails(true);
      try {
        const res = await api.get(`/college/getpocs`);
        const emails = Array.from(
          new Set(
            res.data.data
              .flatMap((poc) => [poc.poc_email, poc.poc_red_email])
              .filter((email) => !!email && email.trim() !== "")
          )
        );
        setRedEmails(emails);
      } catch (err) {
        setRedEmails([]);
      } finally {
        setLoadingRedEmails(false);
      }
    };
    fetchRedEmails();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-[#4f378a]">
        Proposal File Uploads
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8  mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Proposal
            </label>
            {loadingProposals ? (
              <div className="text-gray-500 text-sm">Loading proposals...</div>
            ) : (
              <select
                value={proposalId}
                onChange={(e) => setProposalId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
                required
              >
                <option value="">Select Proposal</option>
                {proposals.map((proposal) => (
                  <option
                    key={proposal.proposal_id}
                    value={proposal.proposal_id}
                  >
                    {proposal.proposal_code}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Designated Mail
            </label>
            {loadingRedEmails ? (
              <div className="text-gray-500 text-sm">Loading emails...</div>
            ) : (
              <select
                value={pocRedEmail}
                onChange={(e) => setPocRedEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
                required
              >
                <option value="">Select Email</option>
                {redEmails.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ZIP File Link
            </label>
            <input
              type="url"
              value={zipFileLink}
              onChange={(e) => setZipFileLink(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6750a4]"
              placeholder="https://example.com/file.zip"
              required
            />
          </div>
        </div>

        <div className="mt-6 text-center">
        <button
  type="submit"
  disabled={isSubmitting}
  className={`bg-[#6750a4] hover:bg-[#543b90] text-white font-medium px-8 py-2 rounded-lg transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
>
  Save Link
</button>

          {uploadStatus && (
            <p className="mt-4 text-sm text-gray-600">{uploadStatus}</p>
          )}
        </div>
      </form>

      <div className="bg-white rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-semibold mb-6 text-[#4f378a]">
          Uploaded Proposal Files
        </h3>

        {loadingFiles ? (
          <div className="text-gray-500">Loading files...</div>
        ) : filesWithCodes.length === 0 ? (
          <div className="text-gray-500">No proposal files found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-[#f3e6f1] text-left text-gray-800">
                  <th className="px-4 py-2 border">Proposal Code</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">ZIP File Link</th>
                  <th className="px-4 py-2 border">Designated Mail</th>
                  <th className="px-4 py-2 border">Uploaded At</th>
                </tr>
              </thead>
              <tbody>
                {filesWithCodes
                  .filter(
                    (file) => file.status === "uploaded" || file.status === "pending"
                  )
                  .map((file, index) => (
                    <tr
                      key={file.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2 border">{file.proposal_code}</td>
                      <td className="px-4 py-2 border">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            file.status
                          )}`}
                        >
                          {file.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border break-all">
                        <a
                          href={file.zip_file_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Open
                        </a>
                      </td>
                      <td className="px-4 py-2 border">{file.poc_red_email}</td>
                      <td className="px-4 py-2 border">
                        {new Date(file.uploaded_at).toLocaleString()}
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

export default Upload;
