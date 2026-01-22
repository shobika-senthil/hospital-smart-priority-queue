import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function FloatingParticles() {
  const [particles] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: `${particle.x}vw`, 
            y: '100vh',
            opacity: 0 
          }}
          animate={{ 
            y: '-10vh',
            opacity: [0, 0.6, 0.6, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear'
          }}
          className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-sm"
          style={{ 
            width: particle.size, 
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
}
