// frontend/src/pages/auth/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Zap, Briefcase, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

const RoleCard = ({ icon: Icon, title, description, selected, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full p-4 rounded-xl text-left transition-all"
    style={{
      background: selected ? 'rgba(139, 92, 246, 0.15)' : '#111118',
      border: selected ? '1.5px solid #8b5cf6' : '1.5px solid #1f2937',
    }}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: selected ? 'rgba(139,92,246,0.3)' : '#1a1a2e' }}>
        <Icon size={20} style={{ color: selected ? '#a78bfa' : '#6b7280' }} />
      </div>
      <div>
        <div className="font-semibold text-sm" style={{ color: selected ? '#e9d5ff' : '#d1d5db' }}>{title}</div>
        <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{description}</div>
      </div>
      <div className="ml-auto">
        <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: selected ? '#8b5cf6' : '#374151' }}>
          {selected && <div className="w-2 h-2 rounded-full" style={{ background: '#8b5cf6' }} />}
        </div>
      </div>
    </div>
  </motion.button>
);

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('CUSTOMER');
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'CUSTOMER' } });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, role: selectedRole };
      const res = await authApi.signup(payload);
      login(res.data.data);
      toast.success('Account created! Welcome to ServiceSphere 🎉');
      navigate(selectedRole === 'VENDOR' ? '/vendor/setup' : '/customer/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      {/* Left Branding Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center px-16"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{
                width: `${100 + i * 100}px`,
                height: `${100 + i * 100}px`,
                background: `rgba(99, 102, 241, ${0.05 + i * 0.02})`,
                top: `${15 + i * 15}%`,
                right: `${-10 + i * 5}%`,
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="relative z-10 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
              <Zap size={20} color="white" fill="white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ServiceSphere</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Join thousands of<br />
              <span style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                happy users.
              </span>
            </h1>
            <p className="text-lg opacity-70 leading-relaxed mb-12">
              Whether you're looking to book services or offer them — ServiceSphere is the platform built for you.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }} className="space-y-4">
            {[
              { icon: '⚡', text: 'Set up your profile in under 2 minutes' },
              { icon: '🔒', text: 'Secure JWT-based authentication' },
              { icon: '📅', text: 'Smart booking with concurrency protection' },
              { icon: '📊', text: 'Real-time analytics dashboard' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="opacity-70">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Form Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto"
      >
        <div className="w-full max-w-md py-8">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
              <Zap size={16} color="white" fill="white" />
            </div>
            <span className="text-xl font-bold text-white">ServiceSphere</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
            <p className="mb-8" style={{ color: '#6b7280' }}>Start your journey with ServiceSphere</p>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }} onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#d1d5db' }}>I want to</label>
              <div className="grid grid-cols-2 gap-3">
                <RoleCard icon={ShoppingBag} title="Book Services" description="Find & book local services"
                  selected={selectedRole === 'CUSTOMER'} onClick={() => setSelectedRole('CUSTOMER')} />
                <RoleCard icon={Briefcase} title="Offer Services" description="List & manage bookings"
                  selected={selectedRole === 'VENDOR'} onClick={() => setSelectedRole('VENDOR')} />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>Full name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                <input type="text" placeholder="Your full name"
                  {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
                  style={{ background: '#111118', border: errors.fullName ? '1px solid #ef4444' : '1px solid #1f2937' }}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = errors.fullName ? '#ef4444' : '#1f2937'} />
              </div>
              {errors.fullName && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                <input type="email" placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
                  style={{ background: '#111118', border: errors.email ? '1px solid #ef4444' : '1px solid #1f2937' }}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : '#1f2937'} />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-white placeholder-gray-600 outline-none transition-all"
                  style={{ background: '#111118', border: errors.password ? '1px solid #ef4444' : '1px solid #1f2937' }}
                  onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={e => e.target.style.borderColor = errors.password ? '#ef4444' : '#1f2937'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.password.message}</p>}
            </div>

            {/* Terms */}
            <p className="text-xs" style={{ color: '#6b7280' }}>
              By creating an account, you agree to our{' '}
              <span className="cursor-pointer hover:underline" style={{ color: '#a78bfa' }}>Terms of Service</span>{' '}
              and{' '}
              <span className="cursor-pointer hover:underline" style={{ color: '#a78bfa' }}>Privacy Policy</span>.
            </p>

            {/* Submit */}
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
              style={{
                background: loading ? '#4c1d95' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </>
              ) : 'Create account'}
            </motion.button>
          </motion.form>

          <p className="text-center text-sm mt-6" style={{ color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#a78bfa' }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}