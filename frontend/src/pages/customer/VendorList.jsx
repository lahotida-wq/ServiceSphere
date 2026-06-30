// frontend/src/pages/customer/VendorList.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Filter, X, ChevronRight } from 'lucide-react';
import { vendorApi } from '../../api/vendorApi';

const CATEGORIES = ['All','Salon','Clinic','Tutor','Repair','Fitness','Spa','Photography','Other'];

const VendorCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden" style={{ background: '#111118', border: '1px solid #1f2937' }}>
    <motion.div className="h-36 w-full"
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ background: 'linear-gradient(90deg,#1a1a2e 25%,#252540 50%,#1a1a2e 75%)', backgroundSize: '200% 100%' }} />
    <div className="p-4 space-y-3">
      <motion.div className="h-5 w-3/4 rounded-lg"
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ background: 'linear-gradient(90deg,#1a1a2e 25%,#252540 50%,#1a1a2e 75%)', backgroundSize: '200% 100%' }} />
      <motion.div className="h-4 w-1/2 rounded-lg"
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ background: 'linear-gradient(90deg,#1a1a2e 25%,#252540 50%,#1a1a2e 75%)', backgroundSize: '200% 100%' }} />
    </div>
  </div>
);

const VendorCard = ({ vendor, onClick }) => {
  const initials = vendor.businessName?.slice(0, 2).toUpperCase() || 'SS';
  const gradients = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
  ];
  const gradient = gradients[vendor.id % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(139,92,246,0.15)' }}
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: '#111118', border: '1px solid #1f2937' }}
    >
      {/* Cover */}
      <div className="h-36 flex items-center justify-center relative"
        style={{ background: gradient }}>
        <span className="text-4xl font-bold text-white opacity-30">{initials}</span>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', backdropFilter: 'blur(8px)' }}>
          {vendor.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white text-base leading-tight">{vendor.businessName}</h3>
          <ChevronRight size={16} style={{ color: '#6b7280', flexShrink: 0 }} />
        </div>

        {vendor.description && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: '#9ca3af' }}>{vendor.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} style={{ color: '#6b7280' }} />
            <span className="text-xs" style={{ color: '#9ca3af' }}>{vendor.city || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />
            <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
              {vendor.averageRating > 0 ? vendor.averageRating.toFixed(1) : 'New'}
            </span>
            {vendor.totalReviews > 0 && (
              <span className="text-xs" style={{ color: '#6b7280' }}>({vendor.totalReviews})</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function VendorList() {
  const [vendors, setVendors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 12 };
      if (search.trim()) params.keyword = search.trim();
      else if (category !== 'All') params.category = category;

      const res = await vendorApi.getAllVendors(params);
      const data = res.data.data;
      setVendors(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch {
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => { setPage(0); fetchVendors(); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Discover Services</h2>
        <p className="text-sm" style={{ color: '#6b7280' }}>Find and book local services near you</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search vendors, categories, cities..."
            className="w-full pl-11 pr-10 py-3 rounded-xl text-sm text-white outline-none"
            style={{ background: '#111118', border: '1px solid #1f2937' }}
            onFocus={e => e.target.style.borderColor = '#8b5cf6'}
            onBlur={e => e.target.style.borderColor = '#1f2937'}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: '#6b7280' }}>
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setCategory(cat); setPage(0); }}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all flex-shrink-0"
            style={{
              background: category === cat ? 'rgba(139,92,246,0.2)' : '#111118',
              border: category === cat ? '1px solid #8b5cf6' : '1px solid #1f2937',
              color: category === cat ? '#a78bfa' : '#9ca3af',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <VendorCardSkeleton key={i} />)}
        </div>
      ) : vendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No vendors found</h3>
          <p className="text-sm" style={{ color: '#6b7280' }}>Try a different search term or category.</p>
          {search && (
            <button onClick={() => setSearch('')}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {vendors.map(v => (
                <VendorCard key={v.id} vendor={v}
                  onClick={() => navigate(`/vendor-detail/${v.id}`)} />
              ))}
            </div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
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
        </>
      )}
    </div>
  );
}