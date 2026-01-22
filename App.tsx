import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RegistrationForm } from './components/RegistrationForm';
import { QueueDisplay } from './components/QueueDisplay';
import { TokenDisplay } from './components/TokenDisplay';
import { StatsCard } from './components/StatsCard';
import { LiveClock } from './components/LiveClock';
import { Confetti } from './components/Confetti';
import { NowServing } from './components/NowServing';
import { FloatingParticles } from './components/FloatingParticles';
import { FloatingNotifications } from './components/FloatingNotifications';
import { QueueTrend } from './components/QueueTrend';
import { Typewriter } from './components/Typewriter';
import { GoogleBadge } from './components/GoogleBadge';
import { Activity, AlertCircle, Heart, Users } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  priority: 'emergency' | 'special' | 'normal';
  tokenNumber: number;
  waitingTime: number;
  registrationTime: number;
  consultationTime: number; // Individual consultation time based on priority
}

// Base consultation time
const BASE_CONSULTATION_TIME = 15;

// Consultation time varies by priority
const PRIORITY_TIME_MULTIPLIER = {
  emergency: 0.7,  // Emergency cases handled quickly (30% faster)
  special: 1.0,    // Normal consultation time
  normal: 1.2,     // Regular patients might need more thorough checkups (20% longer)
};

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showToken, setShowToken] = useState(false);
  const [latestPatient, setLatestPatient] = useState<Patient | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; type: 'success' | 'warning' | 'info'; message: string }>>([]);
  const [lastConsultedPatient, setLastConsultedPatient] = useState<{ tokenNumber: number; name: string } | null>(null);

  // Calculate stats
  const emergencyCount = patients.filter(p => p.priority === 'emergency').length;
  const specialCount = patients.filter(p => p.priority === 'special').length;
  const normalCount = patients.filter(p => p.priority === 'normal').length;

  const calculateWaitingTime = (
    newPriority: 'emergency' | 'special' | 'normal',
    currentPatients: Patient[]
  ): number => {
    let waitingTime = 0;
    
    // Count patients ahead in queue based on priority
    for (const patient of currentPatients) {
      if (newPriority === 'emergency') {
        // Emergency patients only wait for other emergency patients
        if (patient.priority === 'emergency') {
          waitingTime += patient.consultationTime;
        }
      } else if (newPriority === 'special') {
        // Special patients wait for emergency and special patients
        if (patient.priority === 'emergency' || patient.priority === 'special') {
          waitingTime += patient.consultationTime;
        }
      } else {
        // Normal patients wait for everyone
        waitingTime += patient.consultationTime;
      }
    }
    
    return Math.round(waitingTime);
  };

  const assignTokenNumber = (
    priority: 'emergency' | 'special' | 'normal',
    currentPatients: Patient[]
  ): number => {
    // Find the position in queue based on priority
    let position = 0;
    
    for (const patient of currentPatients) {
      if (priority === 'emergency') {
        // Emergency goes before everyone except other emergencies
        if (patient.priority === 'emergency') {
          position++;
        }
      } else if (priority === 'special') {
        // Special goes after emergency but before normal
        if (patient.priority === 'emergency' || patient.priority === 'special') {
          position++;
        }
      } else {
        // Normal goes after everyone
        position++;
      }
    }
    
    return position + 1;
  };

  const reorderPatients = (patientsList: Patient[]): Patient[] => {
    // Sort by priority: emergency > special > normal
    // Within same priority, maintain registration order
    const priorityOrder = { emergency: 0, special: 1, normal: 2 };
    
    const sorted = [...patientsList].sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.registrationTime - b.registrationTime;
    });
    
    // Recalculate waiting times for each patient based on their position in priority queue
    // Token numbers remain fixed based on registration order
    let cumulativeTime = 0;
    return sorted.map((patient) => {
      const waitingTime = cumulativeTime;
      cumulativeTime += patient.consultationTime;
      
      return {
        ...patient,
        waitingTime: Math.round(waitingTime),
      };
    });
  };

  const handleRegister = (patientData: {
    name: string;
    age: number;
    priority: 'emergency' | 'special' | 'normal';
  }) => {
    const consultationTime = Math.round(PRIORITY_TIME_MULTIPLIER[patientData.priority] * BASE_CONSULTATION_TIME);
    const waitingTime = calculateWaitingTime(patientData.priority, patients);
    
    // Token number is sequential based on registration order
    const tokenNumber = patients.length + 1;

    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      name: patientData.name,
      age: patientData.age,
      priority: patientData.priority,
      tokenNumber,
      waitingTime,
      registrationTime: Date.now(),
      consultationTime,
    };

    const updatedPatients = reorderPatients([...patients, newPatient]);
    setPatients(updatedPatients);
    
    // Find the registered patient in the updated list
    const registeredPatient = updatedPatients.find(p => p.id === newPatient.id);
    if (registeredPatient) {
      setLatestPatient(registeredPatient);
      setShowToken(true);
      setShowConfetti(true);
      
      // Add notification
      const notificationId = `notif-${Date.now()}`;
      const notificationType = patientData.priority === 'emergency' ? 'warning' : 'success';
      const message = patientData.priority === 'emergency' 
        ? `🚨 Emergency patient ${patientData.name} registered! Token #${tokenNumber}`
        : `✅ ${patientData.name} registered successfully! Token #${tokenNumber}`;
      
      setNotifications(prev => [...prev, { id: notificationId, type: notificationType, message }]);
    }
  };

  const handleRemovePatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      // Set the consulted patient to display in "Now Serving"
      setLastConsultedPatient({ tokenNumber: patient.tokenNumber, name: patient.name });
      
      // Add notification
      const notificationId = `notif-${Date.now()}`;
      setNotifications(prev => [...prev, { 
        id: notificationId, 
        type: 'info', 
        message: `Token #${patient.tokenNumber} (${patient.name}) has been consulted` 
      }]);
      
      // Clear after 3 seconds
      setTimeout(() => {
        setLastConsultedPatient(null);
      }, 3000);
    }
    
    const updatedPatients = reorderPatients(patients.filter(p => p.id !== patientId));
    setPatients(updatedPatients);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Live Clock */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex-1"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Activity className="w-10 h-10 text-blue-600" />
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900">Patient Queue Management</h1>
            </div>
            <p className="text-gray-600">Register patients and manage waiting queue efficiently</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <LiveClock />
          </motion.div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatsCard
            title="Emergency"
            value={emergencyCount}
            icon={AlertCircle}
            color="from-red-500 to-red-600"
            delay={0}
          />
          <StatsCard
            title="Special Care"
            value={specialCount}
            icon={Heart}
            color="from-orange-500 to-orange-600"
            delay={0.1}
          />
          <StatsCard
            title="Normal"
            value={normalCount}
            icon={Users}
            color="from-blue-500 to-blue-600"
            delay={0.2}
          />
        </div>

        {/* Now Serving Display Board */}
        {patients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <NowServing
              currentToken={lastConsultedPatient?.tokenNumber ?? patients[0]?.tokenNumber ?? null}
              patientName={lastConsultedPatient?.name ?? patients[0]?.name ?? null}
            />
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RegistrationForm onRegister={handleRegister} />
            <QueueDisplay patients={patients} onRemovePatient={handleRemovePatient} />
          </div>
          
          <div>
            <QueueTrend patients={patients} />
          </div>
        </div>
      </div>

      {/* Floating Background Particles */}
      <FloatingParticles />

      {/* Modals and Effects */}
      <AnimatePresence>
        {showToken && latestPatient && (
          <TokenDisplay
            tokenNumber={latestPatient.tokenNumber}
            patientName={latestPatient.name}
            waitingTime={latestPatient.waitingTime}
            priority={latestPatient.priority}
            onClose={() => setShowToken(false)}
          />
        )}
      </AnimatePresence>

      <Confetti trigger={showConfetti} />
      
      {/* Floating Notifications */}
      <FloatingNotifications
        notifications={notifications}
        onRemove={removeNotification}
      />
      
      {/* Google Technology Badge */}
      <GoogleBadge />
    </div>
  );
}