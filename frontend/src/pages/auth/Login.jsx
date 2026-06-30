// frontend/src/pages/auth/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      login(res.data.data);
      toast.success('Welcome back! 👋');
      const role = res.data.data.user.role;
      navigate(role === 'VENDOR' ? '/vendor/dashboard' : '/customer/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${120 + i * 80}px`,
                height: `${120 + i * 80}px`,
                background: `rgba(139, 92, 246, ${0.04 + i * 0.02})`,
                top: `${10 + i * 12}%`,
                left: `${5 + i * 8}%`,
              }}
              animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
              <Zap size={20} color="white" fill="white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ServiceSphere</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Book services,<br />
              <span style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                effortlessly.
              </span>
            </h1>
            <p className="text-lg opacity-70 leading-relaxed mb-12">
              Connect with top-rated local vendors. Schedule appointments, track bookings, and manage your time — all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { value: '10K+', label: 'Customers' },
              { value: '500+', label: 'Vendors' },
              { value: '50K+', label: 'Bookings' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{stat.value}</div>
                <div className="text-sm opacity-60 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ background: '#0a0a0f' }}
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
              <Zap size={16} color="white" fill="white" />
            </div>
            <span className="text-xl font-bold text-white">ServiceSphere</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="mb-8" style={{ color: '#6b7280' }}>
              Sign in to your account to continue
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
                  style={{
                    background: '#111118',
                    border: errors.email ? '1px solid #ef4444' : '1px solid #1f2937',
                  }}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : '#1f2937'}
                />
              </div>
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium" style={{ color: '#d1d5db' }}>Password</label>
                <span className="text-xs cursor-pointer" style={{ color: '#8b5cf6' }}>Forgot password?</span>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
                  style={{
                    background: '#111118',
                    border: errors.password ? '1px solid #ef4444' : '1px solid #1f2937',
                  }}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = errors.password ? '#ef4444' : '#1f2937'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#6b7280' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-white mt-2 flex items-center justify-center gap-2 transition-opacity"
              style={{
                background: loading ? '#4c1d95' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                  />
                  Signing in...
                </>
              ) : 'Sign in'}
            </motion.button>
          </motion.form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: '#1f2937' }} />
            <span className="text-sm" style={{ color: '#6b7280' }}>or</span>
            <div className="flex-1 h-px" style={{ background: '#1f2937' }} />
          </div>

          <p className="text-center text-sm" style={{ color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#a78bfa' }}>
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}