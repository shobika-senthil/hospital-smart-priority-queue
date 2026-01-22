import { motion } from 'motion/react';
import { CheckCircle, Clock, User } from 'lucide-react';
import { useEffect } from 'react';

interface TokenDisplayProps {
  tokenNumber: number;
  patientName: string;
  waitingTime: number;
  priority: 'emergency' | 'special' | 'normal';
  onClose: () => void;
}

const priorityLabels = {
  emergency: 'Emergency',
  special: 'Special Care',
  normal: 'Normal',
};

const priorityColors = {
  emergency: 'from-red-500 to-red-600',
  special: 'from-orange-500 to-orange-600',
  normal: 'from-blue-500 to-blue-600',
};

export function TokenDisplay({ tokenNumber, patientName, waitingTime, priority, onClose }: TokenDisplayProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        exit={{ scale: 0.5, rotateY: 180 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className={`bg-gradient-to-br ${priorityColors[priority]} p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background pattern */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-10"
        >
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '30px 30px'
          }} />
        </motion.div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center mb-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.6, repeat: 3 }}
            >
              <CheckCircle className="w-16 h-16 text-white drop-shadow-lg" />
            </motion.div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-center text-2xl font-semibold mb-2"
          >
            Registration Successful!
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 mb-4 shadow-xl"
          >
            <div className="text-center mb-4">
              <p className="text-gray-600 text-sm mb-2">Your Token Number</p>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                className="inline-block relative"
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0)',
                      '0 0 0 20px rgba(59, 130, 246, 0)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`bg-gradient-to-br ${priorityColors[priority]} text-white rounded-2xl w-32 h-32 flex items-center justify-center shadow-lg`}
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-6xl font-bold"
                  >
                    {tokenNumber}
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-3 mt-6"
            >
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-3"
              >
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-900">{patientName}</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-3"
              >
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Estimated Waiting Time</p>
                  <p className="font-semibold text-gray-900">{waitingTime} minutes</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-gray-100 rounded-lg p-3 text-center"
              >
                <p className="text-sm font-medium text-gray-700">
                  Priority: {priorityLabels[priority]}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 1.1 }}
            className="text-white text-center text-sm"
          >
            Please wait for your token to be called
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}