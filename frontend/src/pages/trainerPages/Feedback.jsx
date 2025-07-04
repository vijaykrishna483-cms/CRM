import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const Feedback = () => {
  const [reviewInfo, setReviewInfo] = useState({
    proposal_code: '',
    trainer_id: '',
    trainer_name: '',
    trainer_comment: '',
    trainer_star_rating: 3
  });
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trainer/allreviews');
      setReviews(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch trainer reviews');
    } finally {
      setLoading(false);
    }
  };

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
         toast.success('Review updated successfully!');
      } else {
        await api.post('/trainer/addreview', reviewInfo);
         toast.success('Review submitted successfully!');
      }
      setReviewInfo({
        proposal_code: '',
        trainer_id: '',
        trainer_name: '',
        trainer_comment: '',
        trainer_star_rating: 3
      });
      setEditId(null);
      await fetchReviews();
    } catch (err) {
       toast.error(err.response?.data?.error || 'Error saving review');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setReviewInfo({
      proposal_code: review.proposal_code,
      trainer_id: review.trainer_id,
      trainer_name: review.trainer_name,
      trainer_comment: review.trainer_comment,
      trainer_star_rating: review.trainer_star_rating
    });
    setEditId(review.id);
  };

  return (
    <div className="w-full h-full bg-white px-6 sm:px-10 ">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Trainer Feedbacks</h1>

      {/* Feedback Form */}
     

      {/* Reviews Table */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#4f378a]">Trainer Reviews</h2>
          <button 
            onClick={fetchReviews}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Refresh Reviews
          </button>
        </div>
        
        {loading ? (
          <p className="text-center py-4">Loading reviews...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="text-gray-600 bg-gray-100 border-b">
                <tr>
                  <th className="p-2 text-left">Proposal Code</th>
                  <th className="p-2 text-left">Trainer ID</th>
                  <th className="p-2 text-left">Trainer Name</th>
                  <th className="p-2 text-left">Rating</th>
                  <th className="p-2 text-left">Comments</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 border-t text-left">
                    <td className="p-2">{review.proposal_code}</td>
                    <td className="p-2">{review.trainer_id}</td>
                    <td className="p-2">{review.trainer_name}</td>
                    <td className="p-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-lg ${i < review.trainer_star_rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 max-w-xs truncate" title={review.trainer_comment}>
                      {review.trainer_comment}
                    </td>
                    <td className="p-2">
                      <button 
                        onClick={() => handleEdit(review)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-2 text-center text-gray-400">
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
