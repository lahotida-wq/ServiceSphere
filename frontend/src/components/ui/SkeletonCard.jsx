// frontend/src/components/ui/SkeletonCard.jsx
import { motion } from 'framer-motion';

const shimmer = {
  animate: { backgroundPosition: ['200% 0', '-200% 0'] },
  transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
};

const SkeletonBox = ({ className = '', style = {} }) => (
  <motion.div
    {...shimmer}
    className={`rounded-lg ${className}`}
    style={{
      background: 'linear-gradient(90deg, #1a1a2e 25%, #252540 50%, #1a1a2e 75%)',
      backgroundSize: '200% 100%',
      ...style,
    }}
  />
);

export const ServiceCardSkeleton = () => (
  <div className="rounded-2xl p-5 space-y-4"
    style={{ background: '#111118', border: '1px solid #1f2937' }}>
    <div className="flex items-start justify-between">
      <SkeletonBox style={{ width: 120, height: 20 }} />
      <SkeletonBox style={{ width: 60, height: 24, borderRadius: 20 }} />
    </div>
    <SkeletonBox style={{ width: '80%', height: 14 }} />
    <SkeletonBox style={{ width: '60%', height: 14 }} />
    <div className="flex gap-3 pt-2">
      <SkeletonBox style={{ width: 80, height: 14 }} />
      <SkeletonBox style={{ width: 80, height: 14 }} />
    </div>
    <div className="flex gap-2 pt-1">
      <SkeletonBox style={{ flex: 1, height: 36, borderRadius: 10 }} />
      <SkeletonBox style={{ flex: 1, height: 36, borderRadius: 10 }} />
    </div>
  </div>
);

export default SkeletonBox;