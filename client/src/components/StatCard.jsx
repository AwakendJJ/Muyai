import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function StatCard({
  label,
  value,
  description,
  accent = false,
  accentColor = 'bg-primary',
  className,
  delay = 0,
}) {
  if (accent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={cn(`${accentColor} rounded-2xl p-6 text-white shadow-lg shadow-primary/10`, className)}
      >
        <p className="text-sm opacity-80">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold">{value}</p>
        {description && <p className="mt-2 text-sm opacity-90">{description}</p>}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn('rounded-2xl border border-border bg-white p-6 shadow-sm', className)}
    >
      <p className="text-sm text-gray-text">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      {description && <p className="mt-2 truncate text-sm text-gray-text">{description}</p>}
    </motion.div>
  );
}
