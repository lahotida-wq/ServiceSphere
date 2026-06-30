// frontend/src/pages/vendor/VendorBookings.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, User, CheckCircle,
  X, Package, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingApi } from '../../api/bookingApi';

const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-IN',
  { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
const fmtTime = (dt) => new Date(dt).toLocaleTimeString('en-IN',
  { hour: '2-digit', minute: '2-digit', hour12: true });

const isToday = (dt) => {
  const d = new Date(dt);
  const t = new Date();
  return d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear();
};

const StatusBadge = ({ status }) => {
  const config = {
    CONFIRMED: { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', label: 'Confirmed' },
    CANCELLED: { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Cancelled' },
    COMPLETED: { bg: 'rgba(139,92,246,0.12)',  color: '#8b5cf6', label: 'Completed' },
  };
  const { bg, color, label } = config[status] || config.CONFIRMED;
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: bg, color }}>
      {label}
    </span>
  );
};

const BookingRow = ({ booking, onCancel }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-4 p-4 rounded-2xl"
    style={{ background: '#111118', border: '1px solid #1f2937' }}
  >
    {/* Avatar */}
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
      style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
      {booking.customerName?.charAt(0).toUpperCase()}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-white text-sm">{booking.customerName}</span>
        {isToday(booking.slotStartTime) && (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            Today
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 mt-1 flex-wrap">
        <span className="text-xs" style={{ color: '#9ca3af' }}>{booking.serviceName}</span>
        <span className="text-xs flex items-center gap-1" style={{ color: '#6b7280' }}>
          <Calendar size={11} /> {fmtDate(booking.slotStartTime)}
        </span>
        <span className="text-xs flex items-center gap-1" style={{ color: '#6b7280' }}>
          <Clock size={11} /> {fmtTime(booking.slotStartTime)} – {fmtTime(booking.slotEndTime)}
        </span>
      </div>
    </div>

    {/* Status + Action */}
    <div className="flex items-center gap-3 flex-shrink-0">
      <StatusBadge status={booking.status} />
      {booking.status === 'CONFIRMED' && (
        <button
          onClick={() => onCancel(booking.id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
          style={{ background: 'rgba(239,68,68,0.08)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          title="Cancel booking"
        >
          <X size={14} style={{ color: '#ef4444' }} />
        </button>
      )}
    </div>
  </motion.div>
);

export default function VendorBookings() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('ALL');
  const [page, setPage]           = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getVendorBookings({ page, size: 20 });
      const data = res.data.data;
      setBookings(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [page]);

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

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const todayCount     = bookings.filter(b => isToday(b.slotStartTime) && b.status === 'CONFIRMED').length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const cancelledCount = bookings.filter(b => b.status === 'CANCELLED').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Bookings</h2>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Manage all customer bookings for your services
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',     value: bookings.length, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
          { label: "Today",     value: todayCount,      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
          { label: 'Confirmed', value: confirmedCount,  color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
          { label: 'Cancelled', value: cancelledCount,  color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-4"
            style={{ background: stat.bg, border: `1px solid ${stat.color}22` }}>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {['ALL', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all flex-shrink-0"
            style={{
              background: filter === f ? 'rgba(139,92,246,0.2)' : '#111118',
              border: filter === f ? '1px solid #8b5cf6' : '1px solid #1f2937',
              color: filter === f ? '#a78bfa' : '#9ca3af',
            }}>
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            {f === 'ALL' && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>
              {bookings.length}
            </span>}
          </button>
        ))}
      </div>

      {/* Booking list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="h-20 rounded-2xl"
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ background: 'linear-gradient(90deg,#1a1a2e 25%,#252540 50%,#1a1a2e 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Package size={28} style={{ color: '#8b5cf6' }} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            {filter === 'ALL'
              ? 'No customers have booked your services yet.'
              : `No ${filter.toLowerCase()} bookings.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(b => (
              <BookingRow key={b.id} booking={b} onCancel={handleCancel} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-40"
            style={{ background: '#111118', border: '1px solid #1f2937', color: '#9ca3af' }}>
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className="w-9 h-9 rounded-xl text-sm font-medium cursor-pointer"
              style={{
                background: page === i ? 'rgba(139,92,246,0.2)' : '#111118',
                border: page === i ? '1px solid #8b5cf6' : '1px solid #1f2937',
                color: page === i ? '#a78bfa' : '#9ca3af',
              }}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
            className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-40"
            style={{ background: '#111118', border: '1px solid #1f2937', color: '#9ca3af' }}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}