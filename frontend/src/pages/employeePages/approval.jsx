import React, { useState, useEffect } from 'react';
import api from '../../libs/apiCall';
import { toast } from 'react-toastify';
const Approval = () => {
  const [reviewInfo, setReviewInfo] = useState({
    reimbursement_id: '',
    review_comment: '',
    reimbursement_amount: '',
    approved_by: ''
  });
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employee/getallreviews');
      setReviews(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch reimbursement reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setReviewInfo({ ...reviewInfo, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = async () => {
    setLoading(true);
    try {
      await api.post('/employee/addreview', reviewInfo);
      toast.success('Review submitted successfully!');
      setReviewInfo({
        reimbursement_id: '',
        review_comment: '',
        reimbursement_amount: '',
        approved_by: ''
      });
      await fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-6 sm:px-10 py-12">
      <h1 className="text-2xl font-bold text-center mb-10 text-[#4f378a]">Reimbursement Approval System</h1>

      {/* Review Submission Section */}
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-sm p-6 mb-10 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-[#4f378a]">Submit Reimbursement Review</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reimbursement ID</label>
            <input
              name="reimbursement_id"
              placeholder="Reimbursement ID"
              value={reviewInfo.reimbursement_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
            <input
              name="approved_by"
              placeholder="Approver Name"
              value={reviewInfo.approved_by}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Comment</label>
            <textarea
              name="review_comment"
              placeholder="Add review comments..."
              value={reviewInfo.review_comment}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reimbursement Amount (₹)</label>
            <input
              type="number"
              name="reimbursement_amount"
              placeholder="Amount"
              value={reviewInfo.reimbursement_amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        
        <button
          onClick={handleSubmitReview}
          className="mt-4 px-5 py-2 bg-purple-100 hover:bg-purple-200 rounded-full font-medium text-sm text-gray-700"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      {/* Reviews Table */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#4f378a]">Reimbursement Reviews</h2>
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
                  <th className="p-2 text-left">Reimbursement ID</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Approved By</th>
                  <th className="p-2 text-left">Comments</th>
                  <th className="p-2 text-left">Review Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 border-t text-left">
                    <td className="p-2">{review.reimbursement_id}</td>
                    <td className="p-2">₹{review.reimbursement_amount}</td>
                    <td className="p-2">{review.approved_by}</td>
                    <td className="p-2 max-w-xs truncate" title={review.review_comment}>
                      {review.review_comment}
                    </td>
                    <td className="p-2">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-2 text-center text-gray-400">
                      No reimbursement reviews found
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

export default Approval;
