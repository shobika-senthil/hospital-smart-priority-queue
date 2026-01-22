import { Clock, User, AlertCircle, Heart, Users, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

interface Patient {
  id: string;
  name: string;
  age: number;
  priority: 'emergency' | 'special' | 'normal';
  tokenNumber: number;
  waitingTime: number;
  registrationTime: number;
  consultationTime: number;
}

interface QueueDisplayProps {
  patients: Patient[];
  onRemovePatient: (patientId: string) => void;
}

const priorityConfig = {
  emergency: {
    label: 'Emergency',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: AlertCircle,
  },
  special: {
    label: 'Special Care',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: Heart,
  },
  normal: {
    label: 'Normal',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: Users,
  },
};

export function QueueDisplay({ patients, onRemovePatient }: QueueDisplayProps) {
  const maxWaitingTime = Math.max(...patients.map(p => p.waitingTime), 1);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Patient Queue</h2>
      
      {patients.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
          </motion.div>
          <p>No patients in queue</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {patients.map((patient, index) => {
              const config = priorityConfig[patient.priority];
              const Icon = config.icon;
              const isEmergency = patient.priority === 'emergency';
              const progressPercentage = maxWaitingTime > 0 ? (patient.waitingTime / maxWaitingTime) * 100 : 0;
              
              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -50, rotateY: -15 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    rotateY: 0,
                    scale: isEmergency ? [1, 1.02, 1] : 1
                  }}
                  exit={{ opacity: 0, x: 100, scale: 0.8, rotateY: 15 }}
                  transition={{ 
                    delay: index * 0.05,
                    scale: isEmergency ? { duration: 1, repeat: Infinity } : undefined
                  }}
                  layout
                  className={`border-2 rounded-lg p-4 ${config.color} relative overflow-hidden`}
                  style={{ transformStyle: 'preserve-3d' }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Emergency pulsing glow effect */}
                  {isEmergency && (
                    <motion.div
                      animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-red-400 blur-xl"
                    />
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, delay: index * 0.05 + 0.1 }}
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            className="flex items-center justify-center w-16 h-16 bg-white rounded-full font-bold text-2xl shadow-md border-2 border-current relative"
                          >
                            {isEmergency && (
                              <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-red-500"
                              />
                            )}
                            <span className="relative z-10">{patient.tokenNumber}</span>
                          </motion.div>
                          <div>
                            <motion.h3 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 + 0.15 }}
                              className="font-semibold text-lg"
                            >
                              {patient.name}
                            </motion.h3>
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.75 }}
                              transition={{ delay: index * 0.05 + 0.2 }}
                              className="text-sm"
                            >
                              Age: {patient.age}
                            </motion.p>
                          </div>
                        </div>
                        
                        {/* Animated Progress Bar for Waiting Time */}
                        <div className="mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs opacity-75">Waiting Progress</span>
                            <span className="text-xs font-medium">{patient.waitingTime} min</span>
                          </div>
                          <div className="h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercentage}%` }}
                              transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                              className="h-full bg-current rounded-full relative"
                            >
                              <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
                              />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4 flex flex-col items-end gap-2">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.25, type: 'spring' }}
                          className="flex items-center gap-1 px-2 py-1 bg-white bg-opacity-50 rounded-full"
                        >
                          <motion.div
                            animate={isEmergency ? { rotate: [0, 10, -10, 0] } : {}}
                            transition={isEmergency ? { duration: 0.5, repeat: Infinity } : {}}
                          >
                            <Icon className="w-4 h-4" />
                          </motion.div>
                          <span className="text-xs font-medium">{config.label}</span>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.3 }}
                        >
                          <Button
                            size="sm"
                            className="relative overflow-hidden group"
                            onClick={() => onRemovePatient(patient.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Consulted
                            </span>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      
      {patients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Patients:</span>
            <motion.span
              key={patients.length}
              initial={{ scale: 1.5, color: '#3b82f6' }}
              animate={{ scale: 1, color: '#000' }}
              className="font-semibold"
            >
              {patients.length}
            </motion.span>
          </div>
        </motion.div>
      )}
    </div>
  );
}