// frontend/src/pages/vendor/VendorServices.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { vendorApi } from '../../api/vendorApi';
import ServiceCard from '../../components/ui/ServiceCard';
import ServiceFormModal from '../../components/ui/ServiceFormModal';
import { ServiceCardSkeleton } from '../../components/ui/SkeletonCard';

const EmptyState = ({ onAdd }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
      style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
      <Package size={36} style={{ color: '#8b5cf6' }} />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No services yet</h3>
    <p className="mb-6 max-w-sm" style={{ color: '#6b7280' }}>
      Add your first service to start accepting bookings from customers.
    </p>
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onAdd}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
    >
      <Plus size={18} /> Add Your First Service
    </motion.button>
  </motion.div>
);

export default function VendorServices() {
  const [services, setServices]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editData, setEditData]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vendorApi.getMyServices();
      setServices(res.data.data || []);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleOpenAdd = () => { setEditData(null); setModalOpen(true); };
  const handleOpenEdit = (service) => { setEditData(service); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditData(null); };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        name: data.name,
        description: data.description || '',
        price: parseFloat(data.price),
        durationMinutes: parseInt(data.durationMinutes),
      };
      if (editData) {
        await vendorApi.updateService(editData.id, payload);
        toast.success('Service updated!');
      } else {
        await vendorApi.addService(payload);
        toast.success('Service added!');
      }
      handleClose();
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete "${service.name}"? This action cannot be undone.`)) return;
    try {
      await vendorApi.deleteService(service.id);
      toast.success('Service deleted');
      fetchServices();
    } catch {
      toast.error('Failed to delete service');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Services</h2>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            {services.length} service{services.length !== 1 ? 's' : ''} listed
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white text-sm cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
        >
          <Plus size={16} /> Add Service
        </motion.button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <ServiceCardSkeleton key={i} />)}
        </div>
      ) : services.length === 0 ? (
        <EmptyState onAdd={handleOpenAdd} />
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Modal */}
      <ServiceFormModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editData={editData}
        loading={submitting}
      />
    </div>
  );
}