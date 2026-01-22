import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
}

export function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; rotation: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 360,
      }));
      
      setParticles(newParticles);
      
      setTimeout(() => setParticles([]), 2000);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: '50vw', 
            y: '50vh', 
            scale: 0, 
            opacity: 1,
            rotate: 0 
          }}
          animate={{ 
            x: `calc(50vw + ${particle.x}vw)`,
            y: `calc(50vh + ${particle.y}vh)`,
            scale: [0, 1, 1, 0.5],
            opacity: [1, 1, 0.8, 0],
            rotate: particle.rotation
          }}
          transition={{ 
            duration: 1.5,
            ease: 'easeOut'
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
}
