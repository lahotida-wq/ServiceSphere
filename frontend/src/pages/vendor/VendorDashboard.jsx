// frontend/src/pages/vendor/VendorDashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Briefcase, Clock, TrendingUp,
  ArrowRight, CheckCircle, X, BarChart2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { analyticsApi } from '../../api/analyticsApi';
import { bookingApi } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const fmtTime = (dt) => new Date(dt).toLocaleTimeString('en-IN',
  { hour: '2-digit', minute: '2-digit', hour12: true });
const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-IN',
  { day: '2-digit', month: 'short' });

const StatCard = ({ label, value, icon: Icon, color, bg, suffix = '' }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="rounded-2xl p-5 flex items-center gap-4"
    style={{ background: '#111118', border: '1px solid #1f2937' }}>
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ background: bg }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}{suffix}</p>
      <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>{label}</p>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-sm"
        style={{ background: '#1a1a2e', border: '1px solid #2d2d4e' }}>
        <p style={{ color: '#9ca3af' }}>{label}</p>
        <p className="font-semibold" style={{ color: '#a78bfa' }}>
          {payload[0].value} bookings
        </p>
      </div>
    );
  }
  return null;
};

export default function VendorDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [aRes, bRes] = await Promise.all([
          analyticsApi.getVendorAnalytics(),
          bookingApi.getVendorBookings({ page: 0, size: 5 }),
        ]);
        setAnalytics(aRes.data.data);
        setRecentBookings(bRes.data.data?.content || []);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <motion.div key={i} className="h-24 rounded-2xl"
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ background: 'linear-gradient(90deg,#1a1a2e 25%,#252540 50%,#1a1a2e 75%)', backgroundSize: '200% 100%' }} />
      ))}
    </div>
  );

  const chartData = analytics?.dailyStats?.length > 0
    ? analytics.dailyStats.map(d => ({ date: d.date.slice(5), bookings: d.count }))
    : [{ date: 'No data', bookings: 0 }];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.fullName?.split(' ')[0]}! 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
          Here's what's happening with your business today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings"  value={analytics?.totalBookings   ?? 0} icon={Calendar}  color="#8b5cf6" bg="rgba(139,92,246,0.12)" />
        <StatCard label="Confirmed"       value={analytics?.confirmedBookings ?? 0} icon={CheckCircle} color="#10b981" bg="rgba(16,185,129,0.12)" />
        <StatCard label="Total Slots"     value={analytics?.totalSlots       ?? 0} icon={Clock}     color="#60a5fa" bg="rgba(59,130,246,0.12)" />
        <StatCard label="Occupancy"       value={analytics?.occupancyRate    ?? 0} icon={TrendingUp} color="#f59e0b" bg="rgba(245,158,11,0.12)" suffix="%" />
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Booking Chart */}
        <div className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: '#111118', border: '1px solid #1f2937' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-white">Booking Trend</h3>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Last 14 days</p>
            </div>
            <BarChart2 size={18} style={{ color: '#6b7280' }} />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
              <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === chartData.length - 1 ? '#8b5cf6' : '#3b2d6e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions + Slot Stats */}
        <div className="space-y-4">
          {/* Slot Availability */}
          <div className="rounded-2xl p-5" style={{ background: '#111118', border: '1px solid #1f2937' }}>
            <h3 className="font-semibold text-white mb-4">Slot Overview</h3>
            <div className="space-y-3">
              {[
                { label: 'Available', value: analytics?.availableSlots ?? 0, color: '#10b981', pct: analytics?.totalSlots ? ((analytics.availableSlots / analytics.totalSlots) * 100) : 0 },
                { label: 'Booked',    value: analytics?.bookedSlots ?? 0,    color: '#8b5cf6', pct: analytics?.occupancyRate ?? 0 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{item.label}</span>
                    <span className="text-xs font-semibold text-white">{item.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: '#1f2937' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(item.pct, 100)}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full" style={{ background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl p-5" style={{ background: '#111118', border: '1px solid #1f2937' }}>
            <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Manage Services', path: '/vendor/services', icon: Briefcase },
                { label: 'Generate Slots',  path: '/vendor/slots',    icon: Clock     },
                { label: 'View Bookings',   path: '/vendor/bookings', icon: Calendar  },
              ].map(({ label, path, icon: Icon }) => (
                <button key={path} onClick={() => navigate(path)}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl cursor-pointer transition-all text-sm"
                  style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', color: '#d1d5db' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; e.currentTarget.style.color = '#d1d5db'; }}>
                  <span className="flex items-center gap-2"><Icon size={15} />{label}</span>
                  <ArrowRight size={14} style={{ color: '#8b5cf6' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl p-5" style={{ background: '#111118', border: '1px solid #1f2937' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Recent Bookings</h3>
          <button onClick={() => navigate('/vendor/bookings')}
            className="flex items-center gap-1 text-xs cursor-pointer"
            style={{ color: '#8b5cf6' }}>
            View all <ArrowRight size={12} />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={32} className="mx-auto mb-2" style={{ color: '#374151' }} />
            <p className="text-sm" style={{ color: '#6b7280' }}>No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center gap-4 py-2"
                style={{ borderBottom: '1px solid #1a1a2e' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
                  {b.customerName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{b.customerName}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>
                    {b.serviceName} · {fmtDate(b.slotStartTime)} {fmtTime(b.slotStartTime)}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                  style={{
                    background: b.status === 'CONFIRMED' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: b.status === 'CONFIRMED' ? '#10b981' : '#ef4444',
                  }}>
                  {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}