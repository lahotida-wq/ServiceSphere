// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Landing from './pages/Landing';
import DashboardLayout from './components/layout/DashboardLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorServices from './pages/vendor/VendorServices';
import VendorSlots from './pages/vendor/VendorSlots';
import VendorBookings from './pages/vendor/VendorBookings';
import VendorProfileSetup from './pages/vendor/VendorProfileSetup';
import VendorList from './pages/customer/VendorList';
import VendorDetail from './pages/customer/VendorDetail';
import MyBookings from './pages/customer/MyBookings';
import MyReviews from './pages/customer/MyReviews';

const PlaceholderPage = ({ name }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-white mb-2">{name}</h2>
      <p style={{ color: '#6b7280' }}>Coming soon</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
    <div className="text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p style={{ color: '#6b7280' }}>Page not found</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/"       element={<Landing />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Vendor Profile Setup — pehli baar login ke baad */}
      <Route path="/vendor/setup" element={
        <ProtectedRoute allowedRoles={['VENDOR']}>
          <VendorProfileSetup />
        </ProtectedRoute>
      } />

      {/* Vendor Dashboard */}
      <Route path="/vendor" element={
        <ProtectedRoute allowedRoles={['VENDOR']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="services"  element={<VendorServices />} />
        <Route path="slots"     element={<VendorSlots />} />
        <Route path="bookings"  element={<VendorBookings />} />
        <Route path="analytics" element={<PlaceholderPage name="Analytics" />} />
      </Route>

      {/* Customer Dashboard */}
      <Route path="/customer" element={
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="home"      element={<VendorList />} />
        <Route path="bookings"  element={<MyBookings />} />
        <Route path="favorites" element={<PlaceholderPage name="Favorites" />} />
        <Route path="reviews"   element={<MyReviews />} />
      </Route>

      {/* Vendor detail page */}
      <Route path="/vendor-detail/:vendorId" element={
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
          <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
            <div className="max-w-5xl mx-auto px-6 py-8">
              <VendorDetail />
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;