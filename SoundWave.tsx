import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface SoundWaveProps {
  isActive?: boolean;
}

export function SoundWave({ isActive = true }: SoundWaveProps) {
  const [bars] = useState(Array.from({ length: 5 }, (_, i) => i));

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          animate={isActive ? {
            scaleY: [0.3, 1, 0.3],
          } : { scaleY: 0.3 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: bar * 0.1,
            ease: 'easeInOut'
          }}
          className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
          style={{ height: '100%' }}
        />
      ))}
    </div>
  );
}
