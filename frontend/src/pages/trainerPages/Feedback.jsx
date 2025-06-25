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
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Trainer Feedback System</h1>

      {/* Feedback Form */}
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200 text-left">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">
          {editId ? 'Edit Trainer Review' : 'Submit New Trainer Review'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="proposal_code"
            placeholder="Proposal Code"
            value={reviewInfo.proposal_code}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            name="trainer_id"
            placeholder="Trainer ID"
            value={reviewInfo.trainer_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            name="trainer_name"
            placeholder="Trainer Name"
            value={reviewInfo.trainer_name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`text-2xl ${star <= reviewInfo.trainer_star_rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {reviewInfo.trainer_star_rating} of 5
              </span>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
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
          {loading ? (editId ? 'Updating...' : 'Submitting...') : (editId ? 'Update Review' : 'Submit Review')}
        </button>
      </div>

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
