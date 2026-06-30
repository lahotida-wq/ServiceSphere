// frontend/src/pages/customer/VendorDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Clock, IndianRupee, ArrowLeft, Calendar, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { vendorApi } from '../../api/vendorApi';
import { slotApi } from '../../api/slotApi';
import { bookingApi } from '../../api/bookingApi';
import { reviewApi } from '../../api/reviewApi';

const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-IN',
  { weekday: 'short', day: '2-digit', month: 'short' });
const fmtTime = (dt) => new Date(dt).toLocaleTimeString('en-IN',
  { hour: '2-digit', minute: '2-digit', hour12: true });

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

export default function VendorDetail() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor]               = useState(null);
  const [services, setServices]           = useState([]);
  const [selectedSvc, setSelectedSvc]     = useState(null);
  const [slots, setSlots]                 = useState([]);
  const [selectedSlot, setSelectedSlot]   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [loadingSlots, setLoadingSlots]   = useState(false);
  const [booking, setBooking]             = useState(false);
  const [booked, setBooked]               = useState(false);

  // Reviews state
  const [reviews, setReviews]             = useState([]);
  const [reviewRating, setReviewRating]   = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed]     = useState(false);

  // Load vendor + services
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [vRes, sRes] = await Promise.all([
          vendorApi.getVendorById(vendorId),
          vendorApi.getServicesByVendor(vendorId),
        ]);
        setVendor(vRes.data.data);
        const svcs = sRes.data.data || [];
        setServices(svcs);
        if (svcs.length > 0) setSelectedSvc(svcs[0]);
      } catch {
        toast.error('Failed to load vendor');
        navigate('/customer/home');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vendorId, navigate]);

  // Load reviews
  useEffect(() => {
    if (!vendorId) return;
    reviewApi.getVendorReviews(vendorId, { page: 0, size: 10 })
      .then(res => setReviews(res.data.data?.content || []))
      .catch(() => {});
  }, [vendorId]);

  // Load slots when service changes
  useEffect(() => {
    if (!selectedSvc) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    slotApi.getAvailableSlots(selectedSvc.id)
      .then(res => setSlots(res.data.data || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedSvc]);

  // Group slots by date
  const slotsByDate = slots.reduce((acc, s) => {
    const d = fmtDate(s.startTime);
    if (!acc[d]) acc[d] = [];
    acc[d].push(s);
    return acc;
  }, {});

  const handleBook = async () => {
    if (!selectedSlot) return toast.error('Please select a slot');
    setBooking(true);
    try {
      await bookingApi.createBooking({ slotId: selectedSlot.id, notes: '' });
      setBooked(true);
      toast.success('Booking confirmed! 🎉');
      setTimeout(() => navigate('/customer/bookings'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) return toast.error('Please select a rating');
    setSubmittingReview(true);
    try {
      const res = await reviewApi.createReview({
        vendorId: parseInt(vendorId),
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews(prev => [res.data.data, ...prev]);
      setHasReviewed(true);
      toast.success('Review submitted! ⭐');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!vendor) return null;

  const gradients = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
  ];
  const gradient = gradients[vendor.id % gradients.length];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button onClick={() => navigate('/customer/home')}
        className="flex items-center gap-2 mb-6 text-sm cursor-pointer transition-colors"
        style={{ color: '#9ca3af' }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
        <ArrowLeft size={16} /> Back to vendors
      </button>

      {/* Vendor Header */}
      <div className="rounded-2xl overflow-hidden mb-6"
        style={{ background: '#111118', border: '1px solid #1f2937' }}>
        <div className="h-40 flex items-center justify-center" style={{ background: gradient }}>
          <span className="text-6xl font-bold text-white opacity-20">
            {vendor.businessName?.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{vendor.businessName}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
                  {vendor.category}
                </span>
                {vendor.city && (
                  <span className="flex items-center gap-1 text-sm" style={{ color: '#9ca3af' }}>
                    <MapPin size={13} /> {vendor.city}, {vendor.state}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm" style={{ color: '#f59e0b' }}>
                  <Star size={13} fill="#f59e0b" />
                  {vendor.averageRating > 0 ? vendor.averageRating.toFixed(1) : 'New'}
                  {vendor.totalReviews > 0 && (
                    <span style={{ color: '#6b7280' }}>({vendor.totalReviews} reviews)</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          {vendor.description && (
            <p className="mt-3 text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
              {vendor.description}
            </p>
          )}
        </div>
      </div>

      {/* Services + Slot Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Services */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold text-white mb-3">Services</h2>
          <div className="space-y-2">
            {services.map(svc => (
              <motion.div key={svc.id} whileHover={{ x: 2 }}
                onClick={() => setSelectedSvc(svc)}
                className="p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: selectedSvc?.id === svc.id ? 'rgba(139,92,246,0.12)' : '#111118',
                  border: selectedSvc?.id === svc.id ? '1.5px solid #8b5cf6' : '1px solid #1f2937',
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-white">{svc.name}</span>
                  {selectedSvc?.id === svc.id && (
                    <div className="w-2 h-2 rounded-full" style={{ background: '#8b5cf6' }} />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#a78bfa' }}>
                    <IndianRupee size={11} /> ₹{svc.price}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#6b7280' }}>
                    <Clock size={11} /> {svc.durationMinutes} min
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Slot Picker */}
        <div className="lg:col-span-3">
          <h2 className="text-base font-semibold text-white mb-3">
            Available Slots
            {selectedSvc && (
              <span className="ml-2 text-sm font-normal" style={{ color: '#6b7280' }}>
                — {selectedSvc.name}
              </span>
            )}
          </h2>

          {loadingSlots ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            </div>
          ) : Object.keys(slotsByDate).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 rounded-2xl text-center"
              style={{ background: '#111118', border: '1px solid #1f2937' }}>
              <Calendar size={32} style={{ color: '#374151' }} className="mb-3" />
              <p className="text-white font-medium mb-1">No slots available</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>
                The vendor hasn't added slots for this service yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {Object.entries(slotsByDate).map(([date, daySlots]) => (
                <div key={date}>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                    style={{ color: '#8b5cf6' }}>
                    <Calendar size={12} /> {date}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {daySlots.map(slot => (
                      <motion.button key={slot.id}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedSlot(slot)}
                        className="py-2 px-3 rounded-xl text-xs font-medium cursor-pointer text-center"
                        style={{
                          background: selectedSlot?.id === slot.id
                            ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.07)',
                          border: selectedSlot?.id === slot.id
                            ? '1.5px solid #8b5cf6' : '1px solid rgba(139,92,246,0.2)',
                          color: selectedSlot?.id === slot.id ? '#e9d5ff' : '#a78bfa',
                        }}>
                        {fmtTime(slot.startTime)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Booking summary + confirm button */}
          <AnimatePresence>
            {selectedSlot && !booked && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }} className="mt-4 p-4 rounded-xl"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-white">{selectedSvc?.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                      {fmtDate(selectedSlot.startTime)} · {fmtTime(selectedSlot.startTime)} – {fmtTime(selectedSlot.endTime)}
                    </p>
                  </div>
                  <p className="text-lg font-bold" style={{ color: '#a78bfa' }}>₹{selectedSvc?.price}</p>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handleBook} disabled={booking}
                  className="w-full py-3 rounded-xl font-semibold text-white text-sm cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', opacity: booking ? 0.7 : 1 }}>
                  {booking
                    ? <motion.div animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" />
                    : <><Calendar size={16} /> Confirm Booking</>}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Booking success */}
          <AnimatePresence>
            {booked && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-5 rounded-xl text-center"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <CheckCircle size={32} className="mx-auto mb-2" style={{ color: '#10b981' }} />
                <p className="font-semibold text-white">Booking Confirmed!</p>
                <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Redirecting to your bookings...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="rounded-2xl p-5"
        style={{ background: '#111118', border: '1px solid #1f2937' }}>
        <div className="flex items-center gap-2 mb-5">
          <Star size={18} fill="#f59e0b" style={{ color: '#f59e0b' }} />
          <h2 className="text-base font-semibold text-white">
            Reviews ({reviews.length})
          </h2>
        </div>

        {/* Write a review */}
        {!hasReviewed && (
          <div className="mb-5 p-4 rounded-xl"
            style={{ background: '#0d0d14', border: '1px solid #1f2937' }}>
            <p className="text-sm font-medium text-white mb-3">Leave a Review</p>
            <div className="mb-3">
              <StarRating rating={reviewRating} onRate={setReviewRating} size={22} />
            </div>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              rows={2}
              placeholder="Share your experience..."
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none resize-none mb-3"
              style={{ background: '#111118', border: '1px solid #1f2937' }}
              onFocus={e => e.target.style.borderColor = '#8b5cf6'}
              onBlur={e => e.target.style.borderColor = '#1f2937'}
            />
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              disabled={reviewRating === 0 || submittingReview}
              onClick={handleSubmitReview}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
              style={{
                background: reviewRating === 0 ? '#1f2937' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
                opacity: submittingReview ? 0.7 : 1,
              }}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </motion.button>
          </div>
        )}

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#6b7280' }}>
            No reviews yet. Be the first!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="pb-4" style={{ borderBottom: '1px solid #1a1a2e' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{r.customerName}</span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN',
                      { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-1.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13}
                      fill={s <= r.rating ? '#f59e0b' : 'transparent'}
                      style={{ color: s <= r.rating ? '#f59e0b' : '#374151' }} />
                  ))}
                </div>
                {r.comment && (
                  <p className="text-sm" style={{ color: '#9ca3af' }}>{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}