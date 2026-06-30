// frontend/src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Briefcase,
  Star, Heart, Bell, BarChart2,
  LogOut, Zap, ChevronLeft, ChevronRight,
  Clock, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const vendorLinks = [
  { to: '/vendor/dashboard', icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/vendor/services',  icon: Briefcase,       label: 'My Services' },
  { to: '/vendor/slots',     icon: Clock,           label: 'Slots'       },
  { to: '/vendor/bookings',  icon: Calendar,        label: 'Bookings'    },
  { to: '/vendor/analytics', icon: BarChart2,       label: 'Analytics'   },
];

const customerLinks = [
  { to: '/customer/home',      icon: Search,   label: 'Discover'    },
  { to: '/customer/bookings',  icon: Calendar, label: 'My Bookings' },
  { to: '/customer/favorites', icon: Heart,    label: 'Favorites'   },
  { to: '/customer/reviews',   icon: Star,     label: 'My Reviews'  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isVendor } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const links = isVendor ? vendorLinks : customerLinks;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen flex-shrink-0 overflow-hidden"
      style={{ background: '#0d0d14', borderRight: '1px solid #1a1a2e' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0"
        style={{ borderBottom: '1px solid #1a1a2e', minHeight: 68 }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
          <Zap size={18} color="white" fill="white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-white text-base whitespace-nowrap"
            >
              ServiceSphere
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center z-10 cursor-pointer"
        style={{ background: '#8b5cf6', border: '2px solid #0d0d14' }}
      >
        {collapsed
          ? <ChevronRight size={12} color="white" />
          : <ChevronLeft size={12} color="white" />}
      </button>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 4 }}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
                style={{
                  background: active ? 'rgba(139,92,246,0.15)' : 'transparent',
                  color: active ? '#a78bfa' : '#6b7280',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#d1d5db'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#6b7280'; }}
              >
                <Icon size={20} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-0 w-1 h-6 rounded-l-full"
                    style={{ background: '#8b5cf6' }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile + Logout */}
      <div className="px-3 py-4 flex-shrink-0" style={{ borderTop: '1px solid #1a1a2e' }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs truncate max-w-[120px]" style={{ color: '#6b7280' }}>
                  {user?.role || ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full cursor-pointer transition-colors"
          style={{ color: '#6b7280' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}