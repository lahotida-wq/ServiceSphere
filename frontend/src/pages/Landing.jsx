// frontend/src/pages/Landing.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Zap, Star, Shield, Clock, ArrowRight,
  Calendar, Users, TrendingUp, CheckCircle,
  Scissors, Stethoscope, Dumbbell, BookOpen,
  Wrench, Camera
} from 'lucide-react';

// ── Animated counter ───────────────────────────────────────────────────────
const useCounter = (end, duration = 2000, started) => {
  const [count, setCount] = [end, () => {}];
  return started ? end : 0;
};

// ── Section fade-in wrapper ────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
};

// ── Data ───────────────────────────────────────────────────────────────────
const STATS = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Verified Vendors' },
  { value: '50K+', label: 'Bookings Done' },
  { value: '4.9★', label: 'Average Rating' },
];

const FEATURES = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered slot suggestions based on your preferences and peak hours. Never miss the perfect time.',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
  },
  {
    icon: Shield,
    title: 'Secure Bookings',
    description: 'JWT-secured transactions with concurrency protection. Your slot is guaranteed once booked.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
  },
  {
    icon: TrendingUp,
    title: 'Vendor Analytics',
    description: 'Real-time dashboard with booking trends, occupancy rates, and revenue insights for vendors.',
    color: '#60a5fa',
    bg: 'rgba(59,130,246,0.1)',
  },
  {
    icon: Star,
    title: 'Reviews & Ratings',
    description: 'Verified customer reviews help you choose the best service providers with confidence.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Instant booking confirmations and notifications. Know the status of your appointment always.',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.1)',
  },
  {
    icon: Users,
    title: 'Multi-vendor Platform',
    description: 'One platform for salons, clinics, tutors, repair shops and more. Discover them all in one place.',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
  },
];

const CATEGORIES = [
  { icon: Scissors,     label: 'Salons',      color: '#f43f5e', count: '120+' },
  { icon: Stethoscope,  label: 'Clinics',     color: '#10b981', count: '85+'  },
  { icon: Dumbbell,     label: 'Fitness',     color: '#f59e0b', count: '60+'  },
  { icon: BookOpen,     label: 'Tutors',      color: '#60a5fa', count: '200+' },
  { icon: Wrench,       label: 'Repair',      color: '#8b5cf6', count: '45+'  },
  { icon: Camera,       label: 'Photography', color: '#ec4899', count: '30+'  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Find a Service',    desc: 'Browse vendors by category, location, or search for exactly what you need.' },
  { step: '02', title: 'Pick a Slot',       desc: 'Choose from available time slots that fit your schedule perfectly.' },
  { step: '03', title: 'Confirm Booking',   desc: 'One-tap confirmation with instant notification to you and the vendor.' },
  { step: '04', title: 'Show Up & Enjoy',   desc: 'Arrive at your booked time and experience the service. Review afterwards.' },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0a0a0f', color: '#fff', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span className="font-bold text-white text-lg">ServiceSphere</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Categories', 'How it works'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm transition-colors cursor-pointer"
              style={{ color: '#9ca3af' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium cursor-pointer transition-colors rounded-xl"
            style={{ color: '#d1d5db' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}>
            Sign in
          </button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/signup')}
            className="px-4 py-2 text-sm font-semibold text-white rounded-xl cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
            Get Started
          </motion.button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full"
            style={{ width: 600, height: 600, background: 'radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)', top: '-10%', left: '-10%' }} />
          <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full"
            style={{ width: 500, height: 500, background: 'radial-gradient(circle,rgba(96,165,250,0.1) 0%,transparent 70%)', bottom: '-10%', right: '-5%' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
            <Zap size={14} fill="#a78bfa" />
            Smart Booking Platform for Local Services
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Book Local Services,{' '}
            <span style={{
              background: 'linear-gradient(135deg,#8b5cf6,#60a5fa,#8b5cf6)',
              backgroundSize: '200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 3s ease infinite',
            }}>
              Effortlessly.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#9ca3af' }}>
            Connect with verified salons, clinics, tutors, and more. Schedule appointments in seconds,
            track bookings in real-time, and never miss a slot again.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/signup')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-lg cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
              Start Booking Free <ArrowRight size={20} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/signup?role=vendor')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
              List Your Business
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -2 }}
                className="text-center p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-2xl font-bold" style={{ color: '#a78bfa' }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold mb-3" style={{ color: '#8b5cf6' }}>EXPLORE BY CATEGORY</p>
              <h2 className="text-4xl font-bold text-white mb-4">Every service, one platform</h2>
              <p className="text-lg" style={{ color: '#6b7280' }}>
                From haircuts to home repairs — find exactly what you need.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <motion.button
                  whileHover={{ y: -6, boxShadow: `0 20px 40px ${cat.color}22` }}
                  onClick={() => navigate('/signup')}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer w-full"
                  style={{ background: '#111118', border: '1px solid #1f2937' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${cat.color}15` }}>
                    <cat.icon size={22} style={{ color: cat.color }} />
                  </div>
                  <span className="font-semibold text-white text-sm">{cat.label}</span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>{cat.count} vendors</span>
                </motion.button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6"
        style={{ background: 'linear-gradient(180deg,transparent,rgba(139,92,246,0.03),transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold mb-3" style={{ color: '#8b5cf6' }}>WHY SERVICESPHERE</p>
              <h2 className="text-4xl font-bold text-white mb-4">Built for real users, not demos</h2>
              <p className="text-lg" style={{ color: '#6b7280' }}>
                Every feature solves a real problem that customers and vendors face daily.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl h-full"
                  style={{ background: '#111118', border: '1px solid #1f2937' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: f.bg }}>
                    <f.icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{f.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold mb-3" style={{ color: '#8b5cf6' }}>HOW IT WORKS</p>
              <h2 className="text-4xl font-bold text-white mb-4">Book in 4 simple steps</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="relative">
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px z-0"
                      style={{ background: 'linear-gradient(90deg,#8b5cf6,transparent)' }} />
                  )}
                  <div className="relative z-10 p-6 rounded-2xl text-center"
                    style={{ background: '#111118', border: '1px solid #1f2937' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                      style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <motion.div whileHover={{ scale: 1.01 }}
              className="relative rounded-3xl p-12 text-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#1a0a2e,#0d1a3a)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.2) 0%,transparent 70%)', top: -100, right: -50 }} />
                <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.15) 0%,transparent 70%)', bottom: -50, left: -30 }} />
              </div>

              <div className="relative z-10">
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                  ))}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to simplify your bookings?
                </h2>
                <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: '#9ca3af' }}>
                  Join thousands of customers and vendors already using ServiceSphere to save time and grow their business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/signup')}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
                    Create Free Account <ArrowRight size={18} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 rounded-2xl font-semibold cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
                    Sign In
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6" style={{ borderTop: '1px solid #1a1a2e' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span className="font-bold text-white">ServiceSphere</span>
          </div>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            © 2026 ServiceSphere. Built with ❤️ for the hackathon.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <span key={item} className="text-sm cursor-pointer transition-colors"
                style={{ color: '#6b7280' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* Gradient animation keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}