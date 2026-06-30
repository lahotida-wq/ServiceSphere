// frontend/src/components/layout/DashboardLayout.jsx
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles = {
  '/vendor/dashboard': 'Dashboard',
  '/vendor/services':  'My Services',
  '/vendor/slots':     'Slot Management',
  '/vendor/bookings':  'Bookings',
  '/vendor/analytics': 'Analytics',
  '/home':             'Discover Services',
  '/bookings':         'My Bookings',
  '/favorites':        'Favorites',
  '/reviews':          'My Reviews',
};

export default function DashboardLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'ServiceSphere';

  // Close dropdowns on route change
  useEffect(() => {
    document.title = `${title} — ServiceSphere`;
  }, [title]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: '#0a0a0f' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}