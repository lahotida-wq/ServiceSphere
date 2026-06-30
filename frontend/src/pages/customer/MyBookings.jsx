// frontend/src/pages/customer/MyBookings.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, X, CheckCircle, AlertCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingApi } from '../../api/bookingApi';

const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-IN',
  { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
const fmtTime = (dt) => new Date(dt).toLocaleTimeString('en-IN',
  { hour: '2-digit', minute: '2-digit', hour12: true });

const StatusBadge = ({ status }) => {
  const config = {
    CONFIRMED: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', icon: CheckCircle, label: 'Confirmed' },
    CANCELLED: { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', icon: X,            label: 'Cancelled'  },
    COMPLETED: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', icon: CheckCircle,  label: 'Completed'  },
  };
  const { bg, color, icon: Icon, label } = config[status] || config.CONFIRMED;
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: bg, color }}>
      <Icon size={11} /> {label}
    </span>
  );
};

const BookingCard = ({ booking, onCancel }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl p-5" style={{ background: '#111118', border: '1px solid #1f2937' }}>
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="font-semibold text-white">{booking.serviceName}</h3>
        <p className="text-sm mt-0.5" style={{ color: '#9ca3af' }}>{booking.vendorBusinessName}</p>
      </div>
      <StatusBadge status={booking.status} />
    </div>

    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.1)' }}>
          <Calendar size={14} style={{ color: '#8b5cf6' }} />
        </div>
        <div>
          <p className="text-xs" style={{ color: '#6b7280' }}>Date</p>
          <p className="text-xs font-medium text-white">{fmtDate(booking.slotStartTime).split(',')[0]}, {new Date(booking.slotStartTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(59,130,246,0.1)' }}>
          <Clock size={14} style={{ color: '#60a5fa' }} />
        </div>
        <div>
          <p className="text-xs" style={{ color: '#6b7280' }}>Time</p>
          <p className="text-xs font-medium text-white">
            {fmtTime(booking.slotStartTime)} – {fmtTime(booking.slotEndTime)}
          </p>
        </div>
      </div>
    </div>

    {booking.status === 'CONFIRMED' && (
      <button onClick={() => onCancel(booking.id)}
        className="w-full py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
        Cancel Booking
      </button>
    )}
  </motion.div>
);

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('ALL');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getMyBookings({ page: 0, size: 50 });
      setBookings(res.data.data?.content || []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingApi.cancelBooking(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">My Bookings</h2>
        <p className="text-sm" style={{ color: '#6b7280' }}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['ALL', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
            style={{
              background: filter === f ? 'rgba(139,92,246,0.2)' : '#111118',
              border: filter === f ? '1px solid #8b5cf6' : '1px solid #1f2937',
              color: filter === f ? '#a78bfa' : '#9ca3af',
            }}>
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Package size={28} style={{ color: '#8b5cf6' }} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            {filter === 'ALL' ? "You haven't made any bookings yet." : `No ${filter.toLowerCase()} bookings.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}