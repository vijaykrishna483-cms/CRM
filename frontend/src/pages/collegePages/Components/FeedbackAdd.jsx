import React, { useState, useEffect } from "react";
import api from "../../../libs/apiCall";
import { toast } from "react-toastify";
import usePageAccess from "../../../components/useAccessPage";

const FeedbackAdd = () => {
  const { allowed, loading: permissionLoading } = usePageAccess(
    "trainerfeedbackeditor"
  );

  const [reviewInfo, setReviewInfo] = useState({
    proposal_code: "",
    trainer_id: "",
    trainer_name: "",
    trainer_comment: "",
    trainer_star_rating: 3,
  });

  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [allocations, setAllocations] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);

  // Fetch allocations on mount
  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/college/alloted");
      setAllocations(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch trainer allocations");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique proposal codes for the proposal select
  const uniqueProposalCodes = Array.from(
    new Set(allocations.map((a) => a.proposal_code))
  );

  // Filter trainers when proposal_code changes
  useEffect(() => {
    if (!reviewInfo.proposal_code) {
      setFilteredTrainers([]);
      setReviewInfo((prev) => ({ ...prev, trainer_id: "", trainer_name: "" }));
      return;
    }
    const filtered = allocations.filter(
      (a) => a.proposal_code === reviewInfo.proposal_code
    );
    setFilteredTrainers(filtered);

    // Reset trainer if not in filtered list
    if (!filtered.some((t) => t.trainer_id === reviewInfo.trainer_id)) {
      setReviewInfo((prev) => ({ ...prev, trainer_id: "", trainer_name: "" }));
    }
  }, [reviewInfo.proposal_code, allocations]);

  // Auto-fill trainer name when trainer_id changes
  useEffect(() => {
    if (!reviewInfo.trainer_id) {
      setReviewInfo((prev) => ({ ...prev, trainer_name: "" }));
      return;
    }
    const trainer = allocations.find(
      (t) => t.trainer_id === reviewInfo.trainer_id
    );
    setReviewInfo((prev) => ({
      ...prev,
      trainer_name: trainer ? trainer.trainer_name : "",
    }));
  }, [reviewInfo.trainer_id, allocations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewInfo({ ...reviewInfo, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setReviewInfo({ ...reviewInfo, trainer_star_rating: rating });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/trainer/updatereview/${editId}`, reviewInfo);
        toast.success("Review updated successfully!");
      } else {
        await api.post("/trainer/addreview", reviewInfo);
        toast.success("Review submitted successfully!");
      }
      setReviewInfo({
        proposal_code: "",
        trainer_id: "",
        trainer_name: "",
        trainer_comment: "",
        trainer_star_rating: 3,
      });
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error saving review");
    } finally {
      setLoading(false);
    }
  };

  if (!allowed && !permissionLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center bg-white px-8 py-10 ">
          <svg
            className="w-14 h-14 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="#fee2e2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9l-6 6m0-6l6 6"
              stroke="red"
              strokeWidth="2"
            />
          </svg>
          <h2 className="text-2xl font-bold text-[#6750a4] mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 text-center mb-4">
            You do not have permission to view this page.
            <br />
            Please contact the administrator if you believe this is a mistake.
          </p>
          <button
            className="mt-2 px-5 py-2 rounded-lg bg-[#6750a4] text-white font-semibold hover:bg-[#01291f] transition"
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  if (permissionLoading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full bg-white px-6 sm:px-10 ">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">
        Trainer Feedback System
      </h1>

      {/* Feedback Form */}
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 text-left">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">
          {editId ? "Edit Trainer Review" : "Submit New Trainer Review"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proposal Code Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposal Code
            </label>
            <select
              name="proposal_code"
              value={reviewInfo.proposal_code}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
            >
              <option value="">Select Proposal</option>
              {uniqueProposalCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          {/* Trainer Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trainer
            </label>
            <select
              name="trainer_id"
              value={reviewInfo.trainer_id}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
              disabled={!reviewInfo.proposal_code}
            >
              <option value="">Select Trainer</option>
              {filteredTrainers.map((trainer) => (
                <option key={trainer.trainer_id} value={trainer.trainer_id}>
                  {trainer.trainer_name} ({trainer.trainer_id})
                </option>
              ))}
            </select>
          </div>
          {/* Trainer Name (auto-filled, read-only) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trainer Name
            </label>
            <input
              name="trainer_name"
              value={reviewInfo.trainer_name}
              className="border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm w-full"
              readOnly
              tabIndex={-1}
            />
          </div>
          {/* Rating */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
         <div className="flex items-center space-x-1">
  {[1, 2, 3, 4, 5].map((i) => (
    <button
      key={i}
      type="button"
      onClick={() =>
        handleRatingChange(
          reviewInfo.trainer_star_rating === i - 0.5 ? i : i - 0.5
        )
      }
      onDoubleClick={() => handleRatingChange(i)}
      className="text-2xl text-yellow-400 transition duration-150 hover:scale-110"
      aria-label={`${reviewInfo.trainer_star_rating === i - 0.5 ? i : i - 0.5} star`}
    >
      {reviewInfo.trainer_star_rating >= i
        ? "★"
        : reviewInfo.trainer_star_rating >= i - 0.5
        ? "⯨"
        : "☆"}
    </button>
  ))}
  <span className="ml-2 text-sm text-gray-500">
    {reviewInfo.trainer_star_rating} of 5
  </span>
</div>


          </div>
          {/* Comments */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              name="trainer_comment"
              placeholder="Your feedback about the trainer..."
              value={reviewInfo.trainer_comment}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}
        >
          {loading
            ? editId
              ? "Updating..."
              : "Submitting..."
            : editId
            ? "Update Review"
            : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default FeedbackAdd;
