
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

type MetricCardProps = {
  title: string;
  value: number | null;
  icon: LucideIcon;
  isLoading?: boolean;
};

export default function MetricCard({ title, value, icon: Icon, isLoading = false }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-white/70"
    >
      <div className="flex items-center  justify-between">
        <div className="flex flex-col">
          {isLoading ? (
            <>
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-300" />
              <div className="mt-2 h-8 w-16 animate-pulse rounded bg-neutral-400" />
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-[#0b0146]">{title}</span>
              <span className="mt-1 text-3xl font-bold text-[#0b0146]">{value}</span>
            </>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e25b2a] ">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
