import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg relative overflow-hidden`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Animated Background Pattern */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white"
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-medium opacity-90">{title}</span>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="w-6 h-6 text-white opacity-80" />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
          className="text-3xl font-bold text-white"
        >
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {value}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
