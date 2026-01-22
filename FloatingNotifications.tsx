import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
}

interface FloatingNotificationsProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-600',
    borderColor: 'border-green-500',
  },
  warning: {
    icon: AlertCircle,
    color: 'from-orange-500 to-red-600',
    borderColor: 'border-orange-500',
  },
  info: {
    icon: Info,
    color: 'from-blue-500 to-cyan-600',
    borderColor: 'border-blue-500',
  },
};

export function FloatingNotifications({ notifications, onRemove }: FloatingNotificationsProps) {
  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, 4000);
      return () => clearTimeout(timer);
    });
  }, [notifications, onRemove]);

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const config = notificationConfig[notification.type];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              layout
              className={`bg-gradient-to-r ${config.color} p-4 rounded-xl shadow-2xl border-2 ${config.borderColor} max-w-sm relative overflow-hidden`}
            >
              {/* Animated progress bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-white opacity-50"
              />

              <div className="flex items-start gap-3 relative z-10">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                
                <p className="flex-1 text-white font-medium">{notification.message}</p>
                
                <button
                  onClick={() => onRemove(notification.id)}
                  className="text-white hover:scale-110 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
