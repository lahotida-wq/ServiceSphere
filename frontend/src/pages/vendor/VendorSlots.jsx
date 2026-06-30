// frontend/src/pages/vendor/VendorSlots.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Plus, Clock, Trash2, Calendar, ChevronDown, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { vendorApi } from '../../api/vendorApi';
import { slotApi } from '../../api/slotApi';
import { ServiceCardSkeleton } from '../../components/ui/SkeletonCard';

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (dt) =>
  new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

const fmtTime = (dt) =>
  new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const fmtDate = (dt) =>
  new Date(dt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const today = () => new Date().toISOString().split('T')[0];

// ── Slot Badge ─────────────────────────────────────────────────────────────
const SlotBadge = ({ slot, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="flex items-center justify-between px-3 py-2 rounded-xl"
    style={{
      background: slot.booked ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
      border: `1px solid ${slot.booked ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
    }}
  >
    <div className="flex items-center gap-2">
      <Clock size={13} style={{ color: slot.booked ? '#ef4444' : '#10b981' }} />
      <span className="text-sm font-medium text-white">
        {fmtTime(slot.startTime)} – {fmtTime(slot.endTime)}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
          background: slot.booked ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
          color: slot.booked ? '#ef4444' : '#10b981',
        }}>
        {slot.booked ? 'Booked' : 'Free'}
      </span>
      {!slot.booked && (
        <button
          onClick={() => onDelete(slot.id)}
          className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
          style={{ background: 'rgba(239,68,68,0.1)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
        >
          <Trash2 size={11} style={{ color: '#ef4444' }} />
        </button>
      )}
    </div>
  </motion.div>
);

// ── Generate Slots Modal ───────────────────────────────────────────────────
const GenerateModal = ({ isOpen, onClose, services, onGenerate, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      startDate: today(),
      endDate: today(),
      workStartTime: '09:00',
      workEndTime: '18:00',
      breakStartTime: '13:00',
      breakEndTime: '14:00',
    },
  });

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white";
  const inputStyle = (err) => ({
    background: '#0d0d14',
    border: err ? '1px solid #ef4444' : '1px solid #1f2937',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: '#111118', border: '1px solid #1f2937' }}>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.15)' }}>
                  <Zap size={18} style={{ color: '#8b5cf6' }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Generate Slots</h2>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Auto-create time slots for a date range</p>
                </div>
                <button onClick={onClose} className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                  style={{ background: '#1a1a2e', color: '#9ca3af' }}>✕</button>
              </div>

              <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
                {/* Service selector */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>Service</label>
                  <div className="relative">
                    <select {...register('serviceId', { required: 'Select a service' })}
                      className={inputCls} style={{ ...inputStyle(errors.serviceId), appearance: 'none' }}>
                      <option value="">Select a service...</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min)</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6b7280' }} />
                  </div>
                  {errors.serviceId && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.serviceId.message}</p>}
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>Start Date</label>
                    <input type="date" {...register('startDate', { required: 'Required' })}
                      className={inputCls} style={inputStyle(errors.startDate)}
                      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={e => e.target.style.borderColor = '#1f2937'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>End Date</label>
                    <input type="date" {...register('endDate', { required: 'Required' })}
                      className={inputCls} style={inputStyle(errors.endDate)}
                      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={e => e.target.style.borderColor = '#1f2937'} />
                  </div>
                </div>

                {/* Work hours */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>Work Start</label>
                    <input type="time" {...register('workStartTime', { required: 'Required' })}
                      className={inputCls} style={inputStyle(errors.workStartTime)}
                      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={e => e.target.style.borderColor = '#1f2937'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>Work End</label>
                    <input type="time" {...register('workEndTime', { required: 'Required' })}
                      className={inputCls} style={inputStyle(errors.workEndTime)}
                      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={e => e.target.style.borderColor = '#1f2937'} />
                  </div>
                </div>

                {/* Break hours */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>
                    Break Time <span style={{ color: '#6b7280' }}>(optional — set same time if no break)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="time" {...register('breakStartTime', { required: 'Required' })}
                      placeholder="Break start" className={inputCls} style={inputStyle(false)}
                      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={e => e.target.style.borderColor = '#1f2937'} />
                    <input type="time" {...register('breakEndTime', { required: 'Required' })}
                      placeholder="Break end" className={inputCls} style={inputStyle(false)}
                      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={e => e.target.style.borderColor = '#1f2937'} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                    style={{ background: '#1a1a2e', color: '#9ca3af', border: '1px solid #1f2937' }}>
                    Cancel
                  </button>
                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: loading ? '#4c1d95' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)', opacity: loading ? 0.7 : 1 }}>
                    {loading
                      ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" />
                      : <><Zap size={15} /> Generate Slots</>}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────
export default function VendorSlots() {
  const [services, setServices]         = useState([]);
  const [selectedService, setSelected] = useState(null);
  const [slots, setSlots]               = useState([]);
  const [loadingSvc, setLoadingSvc]     = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [modalOpen, setModalOpen]       = useState(false);
  const [generating, setGenerating]     = useState(false);

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = fmtDate(slot.startTime);
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  const fetchServices = useCallback(async () => {
    setLoadingSvc(true);
    try {
      const res = await vendorApi.getMyServices();
      const svcs = res.data.data || [];
      setServices(svcs);
      if (svcs.length > 0) setSelected(svcs[0]);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoadingSvc(false);
    }
  }, []);

  const fetchSlots = useCallback(async (serviceId) => {
    setLoadingSlots(true);
    try {
      const res = await slotApi.getAllSlots(serviceId);
      setSlots(res.data.data || []);
    } catch {
      toast.error('Failed to load slots');
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);
  useEffect(() => {
    if (selectedService) fetchSlots(selectedService.id);
  }, [selectedService, fetchSlots]);

  const handleGenerate = async (data) => {
    setGenerating(true);
    try {
      await slotApi.generateSlots({
        serviceId:      parseInt(data.serviceId),
        startDate:      data.startDate,
        endDate:        data.endDate,
        workStartTime:  data.workStartTime + ':00',
        workEndTime:    data.workEndTime   + ':00',
        breakStartTime: data.breakStartTime + ':00',
        breakEndTime:   data.breakEndTime   + ':00',
      });
      toast.success('Slots generated successfully!');
      setModalOpen(false);
      // Refresh slots for the selected service
      const svc = services.find(s => s.id === parseInt(data.serviceId));
      if (svc) { setSelected(svc); fetchSlots(svc.id); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate slots');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await slotApi.deleteSlot(slotId);
      toast.success('Slot deleted');
      if (selectedService) fetchSlots(selectedService.id);
    } catch {
      toast.error('Failed to delete slot');
    }
  };

  const totalFree   = slots.filter(s => !s.booked).length;
  const totalBooked = slots.filter(s => s.booked).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Slot Management</h2>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Generate and manage availability slots for your services
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white text-sm cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
          <Plus size={16} /> Generate Slots
        </motion.button>
      </div>

      {/* Service Tabs */}
      {loadingSvc ? (
        <div className="flex gap-3 mb-6">
          {[...Array(3)].map((_, i) => (
            <motion.div key={i} className="h-10 w-32 rounded-xl"
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ background: 'linear-gradient(90deg, #1a1a2e 25%, #252540 50%, #1a1a2e 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20">
          <Calendar size={48} style={{ color: '#374151' }} className="mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">No services found</p>
          <p className="text-sm" style={{ color: '#6b7280' }}>Add a service first, then generate slots for it.</p>
        </div>
      ) : (
        <>
          {/* Service selector tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {services.map(svc => (
              <button key={svc.id} onClick={() => setSelected(svc)}
                className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer transition-all flex-shrink-0"
                style={{
                  background: selectedService?.id === svc.id ? 'rgba(139,92,246,0.2)' : '#111118',
                  border: selectedService?.id === svc.id ? '1px solid #8b5cf6' : '1px solid #1f2937',
                  color: selectedService?.id === svc.id ? '#a78bfa' : '#9ca3af',
                }}>
                {svc.name}
              </button>
            ))}
          </div>

          {/* Stats row */}
          {selectedService && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Slots', value: slots.length, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
                { label: 'Available',   value: totalFree,    color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                { label: 'Booked',      value: totalBooked,  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl p-4 flex items-center gap-4"
                  style={{ background: stat.bg, border: `1px solid ${stat.color}22` }}>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slots by date */}
          {loadingSlots ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <ServiceCardSkeleton key={i} />)}
            </div>
          ) : Object.keys(slotsByDate).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Calendar size={28} style={{ color: '#8b5cf6' }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No slots yet</h3>
              <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                Generate slots for <span style={{ color: '#a78bfa' }}>{selectedService?.name}</span> to start accepting bookings.
              </p>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                <Zap size={15} /> Generate Slots Now
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(slotsByDate).map(([date, daySlots]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full"
                      style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <Calendar size={13} style={{ color: '#8b5cf6' }} />
                      <span className="text-xs font-semibold" style={{ color: '#a78bfa' }}>{date}</span>
                    </div>
                    <span className="text-xs" style={{ color: '#6b7280' }}>
                      {daySlots.filter(s => !s.booked).length} free · {daySlots.filter(s => s.booked).length} booked
                    </span>
                  </div>
                  <AnimatePresence>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                      {daySlots.map(slot => (
                        <SlotBadge key={slot.id} slot={slot} onDelete={handleDelete} />
                      ))}
                    </div>
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Generate Modal */}
      <GenerateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        services={services}
        onGenerate={handleGenerate}
        loading={generating}
      />
    </div>
  );
}