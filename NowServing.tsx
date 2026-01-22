import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

interface NowServingProps {
  currentToken: number | null;
  patientName: string | null;
}

export function NowServing({ currentToken, patientName }: NowServingProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 shadow-xl relative overflow-hidden border-2 border-blue-200"
    >
      {/* Animated scanline effect */}
      <motion.div
        animate={{ y: [-100, 400] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-20"
      />

      {/* Subtle border glow animation */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-2xl border-2 border-blue-400"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bell className="w-6 h-6 text-blue-600" />
          </motion.div>
          <h3 className="text-blue-700 text-xl font-bold tracking-wider">NOW SERVING</h3>
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -15, 15, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bell className="w-6 h-6 text-blue-600" />
          </motion.div>
        </div>

        {currentToken !== null ? (
          <>
            <motion.div
              key={currentToken}
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              className="bg-white rounded-xl p-8 mb-4 border-2 border-blue-300 shadow-lg"
            >
              <div className="text-center">
                <p className="text-blue-600 text-sm mb-2 tracking-widest font-medium">TOKEN NUMBER</p>
                <motion.div
                  animate={{ 
                    textShadow: [
                      '0 0 10px rgba(59, 130, 246, 0.3)',
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                      '0 0 10px rgba(59, 130, 246, 0.3)',
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-8xl font-bold text-blue-600 font-mono"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  {String(currentToken).padStart(3, '0')}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-gray-800 text-lg font-semibold">
                {patientName}
                <span className="text-blue-500 ml-2">{dots}</span>
              </p>
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-blue-600 text-sm mt-2 font-medium"
              >
                Please proceed to the consultation room
              </motion.div>
            </motion.div>
          </>
        ) : (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center py-8"
          >
            <div className="text-6xl font-bold text-gray-400 font-mono">
              ---
            </div>
            <p className="text-gray-500 mt-4">Waiting for next patient</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}