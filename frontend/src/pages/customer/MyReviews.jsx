// frontend/src/pages/customer/MyReviews.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Edit2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewApi } from '../../api/reviewApi';

const StarRating = ({ rating, onRate, readonly = false, size = 20 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <motion.button key={star} type="button"
        whileHover={!readonly ? { scale: 1.2 } : {}}
        whileTap={!readonly ? { scale: 0.9 } : {}}
        onClick={() => !readonly && onRate && onRate(star)}
        style={{ cursor: readonly ? 'default' : 'pointer', background: 'none', border: 'none', padding: 0 }}>
        <Star size={size}
          fill={star <= rating ? '#f59e0b' : 'transparent'}
          style={{ color: star <= rating ? '#f59e0b' : '#374151' }} />
      </motion.button>
    ))}
  </div>
);

const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-IN',
  { day: '2-digit', month: 'short', year: 'numeric' });

export default function MyReviews() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [saving, setSaving]     = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewApi.getMyReviews({ page: 0, size: 50 });
      setReviews(res.data.data?.content || []);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const handleSave = async (reviewId) => {
    setSaving(true);
    try {
      await reviewApi.updateReview(reviewId, {
        vendorId: reviews.find(r => r.id === reviewId)?.vendorId,
        rating: editRating,
        comment: editComment,
      });
      toast.success('Review updated!');
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewApi.deleteReview(id);
      toast.success('Review deleted');
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">My Reviews</h2>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Star size={28} style={{ color: '#f59e0b' }} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No reviews yet</h3>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Book a service and leave a review to help others.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map(review => (
              <motion.div key={review.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="rounded-2xl p-5"
                style={{ background: '#111118', border: '1px solid #1f2937' }}>

                {editingId === review.id ? (
                  /* Edit mode */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{review.vendorBusinessName}</p>
                      <button onClick={() => setEditingId(null)}
                        className="text-xs cursor-pointer" style={{ color: '#6b7280' }}>Cancel</button>
                    </div>
                    <div>
                      <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Your rating</p>
                      <StarRating rating={editRating} onRate={setEditRating} size={24} />
                    </div>
                    <div>
                      <textarea
                        value={editComment}
                        onChange={e => setEditComment(e.target.value)}
                        rows={3}
                        placeholder="Update your review..."
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-none"
                        style={{ background: '#0d0d14', border: '1px solid #1f2937' }}
                        onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                        onBlur={e => e.target.style.borderColor = '#1f2937'}
                      />
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleSave(review.id)} disabled={saving}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                      style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', opacity: saving ? 0.7 : 1 }}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                  </div>
                ) : (
                  /* View mode */
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-white">{review.vendorBusinessName}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{fmtDate(review.createdAt)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(review)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                          style={{ background: 'rgba(139,92,246,0.1)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}>
                          <Edit2 size={13} style={{ color: '#a78bfa' }} />
                        </button>
                        <button onClick={() => handleDelete(review.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                          style={{ background: 'rgba(239,68,68,0.08)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                          <Trash2 size={13} style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </div>
                    <StarRating rating={review.rating} readonly size={16} />
                    {review.comment && (
                      <p className="mt-3 text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                        {review.comment}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}