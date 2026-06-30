// frontend/src/pages/vendor/VendorProfileSetup.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Zap, Briefcase, MapPin, Phone, FileText, Tag } from 'lucide-react';
import { vendorApi } from '../../api/vendorApi';

const CATEGORIES = ['Salon', 'Clinic', 'Tutor', 'Repair', 'Fitness', 'Spa', 'Photography', 'Other'];

export default function VendorProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Agar profile already exist karta hai toh dashboard pe redirect karo
  useEffect(() => {
    vendorApi.getMyProfile()
      .then(() => navigate('/vendor/dashboard', { replace: true }))
      .catch(() => setChecking(false));
  }, [navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await vendorApi.createProfile(data);
      toast.success('Vendor profile created! 🎉');
      navigate('/vendor/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full py-3 rounded-xl text-white text-sm outline-none transition-all";
  const inputStyle = (err) => ({
    background: '#111118',
    border: err ? '1px solid #ef4444' : '1px solid #1f2937',
    paddingLeft: '2.75rem',
    paddingRight: '1rem',
  });

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0a0a0f' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
            <Zap size={28} color="white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Set Up Your Business</h1>
          <p style={{ color: '#6b7280' }}>Complete your vendor profile to start accepting bookings</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl p-6" style={{ background: '#111118', border: '1px solid #1f2937' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>
                Business Name *
              </label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                <input
                  {...register('businessName', { required: 'Business name is required' })}
                  placeholder="e.g. Devesh Hair Studio"
                  className={inputCls}
                  style={inputStyle(errors.businessName)}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = errors.businessName ? '#ef4444' : '#1f2937'}
                />
              </div>
              {errors.businessName && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.businessName.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>
                Category *
              </label>
              <div className="relative">
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6b7280' }} />
                <select
                  {...register('category', { required: 'Category is required' })}
                  className={inputCls}
                  style={{ ...inputStyle(errors.category), appearance: 'none', cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = errors.category ? '#ef4444' : '#1f2937'}
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {errors.category && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.category.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>
                Description <span style={{ color: '#6b7280' }}>(optional)</span>
              </label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-3 pointer-events-none" style={{ color: '#6b7280' }} />
                <textarea
                  {...register('description')}
                  placeholder="Describe your business..."
                  rows={3}
                  className="w-full py-3 rounded-xl text-white text-sm outline-none transition-all resize-none"
                  style={{ background: '#111118', border: '1px solid #1f2937', paddingLeft: '2.75rem', paddingRight: '1rem' }}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = '#1f2937'}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                <input
                  {...register('phone', {
                    pattern: { value: /^[+]?[0-9]{7,15}$/, message: 'Enter a valid phone number' }
                  })}
                  placeholder="9876543210"
                  className={inputCls}
                  style={inputStyle(errors.phone)}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = errors.phone ? '#ef4444' : '#1f2937'}
                />
              </div>
              {errors.phone && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.phone.message}</p>}
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>City *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                  <input
                    {...register('city', { required: 'City is required' })}
                    placeholder="Mumbai"
                    className={inputCls}
                    style={inputStyle(errors.city)}
                    onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={e => e.target.style.borderColor = errors.city ? '#ef4444' : '#1f2937'}
                  />
                </div>
                {errors.city && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>State</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                  <input
                    {...register('state')}
                    placeholder="Maharashtra"
                    className={inputCls}
                    style={inputStyle(false)}
                    onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={e => e.target.style.borderColor = '#1f2937'}
                  />
                </div>
              </div>
            </div>

            {/* Address + Pincode */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                  <input
                    {...register('address')}
                    placeholder="123 MG Road"
                    className={inputCls}
                    style={inputStyle(false)}
                    onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={e => e.target.style.borderColor = '#1f2937'}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>Pincode</label>
                <input
                  {...register('pincode', {
                    pattern: { value: /^[0-9]{6}$/, message: '6 digits' }
                  })}
                  placeholder="400001"
                  className="w-full px-3 py-3 rounded-xl text-white text-sm outline-none transition-all"
                  style={{ background: '#111118', border: errors.pincode ? '1px solid #ef4444' : '1px solid #1f2937' }}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = errors.pincode ? '#ef4444' : '#1f2937'}
                />
                {errors.pincode && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.pincode.message}</p>}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-white mt-2 flex items-center justify-center gap-2"
              style={{
                background: loading ? '#4c1d95' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" />
                  Creating Profile...
                </>
              ) : 'Create Vendor Profile →'}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#6b7280' }}>
          You can update this information later from your dashboard settings.
        </p>
      </motion.div>
    </div>
  );
}