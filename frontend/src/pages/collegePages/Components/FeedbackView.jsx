import React, { useEffect, useState, useMemo } from "react";
import api from "../../../libs/apiCall";

const FeedbackView = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/trainer/allreviews");
      setReviews(res.data || []);
    } catch {
    
    }
  };

  const grouped = useMemo(() => {
    const map = {};
    reviews.forEach((r) => {
      if (!map[r.trainer_id]) {
        map[r.trainer_id] = {
          trainer_name: r.trainer_name,
          trainer_id: r.trainer_id,
          reviews: [],
        };
      }
      map[r.trainer_id].reviews.push(r);
    });
    return Object.values(map);
  }, [reviews]);

  // Filter by search term (trainer name, proposal code, or star rating)
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return grouped;
    return grouped
      .map((trainer) => {
        // Filter this trainer's reviews
        const filteredReviews = trainer.reviews.filter(
          (r) =>
            r.proposal_code?.toLowerCase().includes(term) ||
            r.trainer_name?.toLowerCase().includes(term) ||
            r.trainer_id?.toLowerCase().includes(term) ||
            String(r.trainer_star_rating).includes(term)
        );
        if (
          trainer.trainer_name?.toLowerCase().includes(term) ||
          trainer.trainer_id?.toLowerCase().includes(term)
        ) {
      
          return trainer;
        }
        if (filteredReviews.length > 0) {
          return { ...trainer, reviews: filteredReviews };
        }
        return null;
      })
      .filter(Boolean);
  }, [grouped, searchTerm]);

  const getAverage = (reviews) => {
    if (!reviews.length) return "-";
    const sum = reviews.reduce((acc, r) => acc + Number(r.trainer_star_rating), 0);
    return (sum / reviews.length).toFixed(2);
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-8">
   
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Search by trainer, proposal, or rating..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No feedback found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((trainer) => (
            <div
              key={trainer.trainer_id}
              className="bg-gray-50 border h-[250px] overflow-hidden rounded-xl shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-lg font-semibold text-[#4f378a]">
                    {trainer.trainer_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {trainer.trainer_id}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-600">Avg. Rating</span>
                  <span className="text-xl font-bold text-yellow-500">
                    {getAverage(trainer.reviews)}{" "}
                    <span className="text-base text-yellow-400">★</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    ({trainer.reviews.length} review
                    {trainer.reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              </div>
              <div className="mt-2 flex-1">
                {trainer.reviews.map((r, idx) => (
                  <div
                    key={r.proposal_code + idx}
                    className="mb-4 pb-4 border-b last:border-b-0 last:mb-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#6750a4]">
                        Proposal: {r.proposal_code}
                      </span>
                      <span className="text-yellow-500 font-bold">
                        {r.trainer_star_rating} ★
                      </span>
                    </div>
                    {r.trainer_comment && (
                      <div className="mt-1 text-gray-700 text-sm">
                        <span className="font-medium text-gray-500">Comment:</span>{" "}
                        {r.trainer_comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackView;
