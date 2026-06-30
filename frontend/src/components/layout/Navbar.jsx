// frontend/src/components/layout/Navbar.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Navbar({ title = 'Dashboard' }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Mock notifications — real ones come in Milestone 18
  const notifications = [
    { id: 1, text: 'New booking confirmed for Haircut & Styling', time: '2 min ago', unread: true },
    { id: 2, text: 'Your slot at 11:00 AM has been cancelled', time: '1 hr ago', unread: true },
    { id: 3, text: 'Review received — 5 stars ⭐', time: '3 hrs ago', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header
      className="flex items-center justify-between px-6 py-4 flex-shrink-0"
      style={{
        background: '#0a0a0f',
        borderBottom: '1px solid #1a1a2e',
        height: 68,
      }}
    >
      {/* Page title */}
      <h1 className="text-lg font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-3">

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: '#111118', border: '1px solid #1f2937', width: 220 }}>
          <Search size={15} style={{ color: '#6b7280' }} />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-full"
            style={{ color: '#d1d5db' }}
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: '#111118', border: '1px solid #1f2937' }}
          >
            <Bell size={17} style={{ color: '#9ca3af' }} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold"
                style={{ background: '#8b5cf6', fontSize: 10 }}>
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden z-50"
                style={{ background: '#111118', border: '1px solid #1f2937', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
              >
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid #1f2937' }}>
                  <span className="font-semibold text-white text-sm">Notifications</span>
                  <span className="text-xs cursor-pointer" style={{ color: '#8b5cf6' }}>Mark all read</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 flex gap-3 cursor-pointer"
                    style={{ borderBottom: '1px solid #0d0d14', background: n.unread ? 'rgba(139,92,246,0.04)' : 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'rgba(139,92,246,0.04)' : 'transparent'}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: n.unread ? '#8b5cf6' : 'transparent' }} />
                    <div>
                      <p className="text-xs text-white leading-relaxed">{n.text}</p>
                      <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3 text-center">
                  <span className="text-xs cursor-pointer" style={{ color: '#8b5cf6' }}>View all notifications</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors"
            style={{ background: '#111118', border: '1px solid #1f2937' }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium hidden md:block" style={{ color: '#d1d5db' }}>
              {user?.fullName?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={14} style={{ color: '#6b7280' }} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-52 rounded-2xl overflow-hidden z-50"
                style={{ background: '#111118', border: '1px solid #1f2937', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #1f2937' }}>
                  <p className="text-sm font-semibold text-white">{user?.fullName}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{user?.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>
                    {user?.role}
                  </span>
                </div>
                {[
                  { icon: User, label: 'Profile' },
                  { icon: Settings, label: 'Settings' },
                ].map(({ icon: Icon, label }) => (
                  <button key={label}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors cursor-pointer"
                    style={{ color: '#9ca3af' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #1f2937' }}>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm cursor-pointer transition-colors"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}