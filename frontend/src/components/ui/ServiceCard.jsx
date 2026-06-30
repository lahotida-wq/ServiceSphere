// frontend/src/components/ui/ServiceCard.jsx
import { motion } from 'framer-motion';
import { Edit2, Trash2, Clock, IndianRupee, CheckCircle, XCircle } from 'lucide-react';

export default function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: '#111118',
        border: '1px solid #1f2937',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-white text-base leading-tight">{service.name}</h3>
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
          style={{
            background: service.active ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            color: service.active ? '#10b981' : '#ef4444',
          }}
        >
          {service.active
            ? <><CheckCircle size={11} /> Active</>
            : <><XCircle size={11} /> Inactive</>}
        </span>
      </div>

      {/* Description */}
      {service.description && (
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#9ca3af' }}>
          {service.description}
        </p>
      )}

      {/* Price + Duration */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.15)' }}>
            <IndianRupee size={13} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: '#6b7280' }}>Price</p>
            <p className="text-sm font-semibold text-white">₹{service.price}</p>
          </div>
        </div>
        <div className="w-px h-8" style={{ background: '#1f2937' }} />
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.15)' }}>
            <Clock size={13} style={{ color: '#60a5fa' }} />
          </div>
          <div>
            <p className="text-xs" style={{ color: '#6b7280' }}>Duration</p>
            <p className="text-sm font-semibold text-white">{service.durationMinutes} min</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onEdit(service)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
          style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.12)'}
        >
          <Edit2 size={14} /> Edit
        </button>
        <button
          onClick={() => onDelete(service)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </motion.div>
  );
}