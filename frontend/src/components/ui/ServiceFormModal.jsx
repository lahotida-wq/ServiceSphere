// frontend/src/components/ui/ServiceFormModal.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, Clock, FileText, Tag } from 'lucide-react';

export default function ServiceFormModal({ isOpen, onClose, onSubmit, editData, loading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        description: editData.description,
        price: editData.price,
        durationMinutes: editData.durationMinutes,
      });
    } else {
      reset({ name: '', description: '', price: '', durationMinutes: '' });
    }
  }, [editData, isOpen, reset]);

  const inputStyle = (hasError) => ({
    background: '#0d0d14',
    border: hasError ? '1px solid #ef4444' : '1px solid #1f2937',
    color: '#fff',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-2xl p-6"
              style={{ background: '#111118', border: '1px solid #1f2937' }}>

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {editData ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                  style={{ background: '#1a1a2e' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2a2a3e'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1a1a2e'}>
                  <X size={16} style={{ color: '#9ca3af' }} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>
                    Service Name
                  </label>
                  <div className="relative">
                    <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                    <input
                      {...register('name', { required: 'Service name is required' })}
                      placeholder="e.g. Haircut & Styling"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                      style={inputStyle(errors.name)}
                      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={e => e.target.style.borderColor = errors.name ? '#ef4444' : '#1f2937'}
                    />
                  </div>
                  {errors.name && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>
                    Description <span style={{ color: '#6b7280' }}>(optional)</span>
                  </label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3 top-3" style={{ color: '#6b7280' }} />
                    <textarea
                      {...register('description')}
                      placeholder="Describe your service..."
                      rows={3}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                      style={inputStyle(false)}
                      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={e => e.target.style.borderColor = '#1f2937'}
                    />
                  </div>
                </div>

                {/* Price + Duration row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>
                      Price (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                      <input
                        type="number"
                        step="0.01"
                        {...register('price', {
                          required: 'Required',
                          min: { value: 1, message: 'Min ₹1' },
                        })}
                        placeholder="300"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                        style={inputStyle(errors.price)}
                        onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                        onBlur={e => e.target.style.borderColor = errors.price ? '#ef4444' : '#1f2937'}
                      />
                    </div>
                    {errors.price && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#d1d5db' }}>
                      Duration (min)
                    </label>
                    <div className="relative">
                      <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
                      <input
                        type="number"
                        {...register('durationMinutes', {
                          required: 'Required',
                          min: { value: 5, message: 'Min 5 min' },
                          max: { value: 480, message: 'Max 480 min' },
                        })}
                        placeholder="30"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                        style={inputStyle(errors.durationMinutes)}
                        onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                        onBlur={e => e.target.style.borderColor = errors.durationMinutes ? '#ef4444' : '#1f2937'}
                      />
                    </div>
                    {errors.durationMinutes && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.durationMinutes.message}</p>}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                    style={{ background: '#1a1a2e', color: '#9ca3af', border: '1px solid #1f2937' }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      background: loading ? '#4c1d95' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                      />
                    ) : editData ? 'Save Changes' : 'Add Service'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}