import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface RegistrationFormProps {
  onRegister: (patient: {
    name: string;
    age: number;
    priority: 'emergency' | 'special' | 'normal';
  }) => void;
}

export function RegistrationForm({ onRegister }: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [priority, setPriority] = useState<'emergency' | 'special' | 'normal'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        onRegister({
          name,
          age: parseInt(age),
          priority,
        });
        // Reset form
        setName('');
        setAge('');
        setPriority('normal');
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-lg relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-5 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"
        style={{ backgroundSize: '200% 200%' }}
      />
      
      <div className="relative z-10">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-semibold text-gray-900 mb-6"
        >
          Patient Registration
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="name">Patient Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter patient name"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            min="1"
            max="120"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Label>Priority Type</Label>
          <RadioGroup value={priority} onValueChange={(value) => setPriority(value as any)}>
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RadioGroupItem value="emergency" id="emergency" />
              <Label htmlFor="emergency" className="font-normal cursor-pointer flex-1">
                🚨 Emergency (Highest Priority)
              </Label>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <RadioGroupItem value="special" id="special" />
              <Label htmlFor="special" className="font-normal cursor-pointer flex-1">
                💙 Pregnancy / Elderly / Disabled
              </Label>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal" className="font-normal cursor-pointer flex-1">
                👤 Normal
              </Label>
            </motion.div>
          </RadioGroup>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            type="submit" 
            className="w-full relative overflow-hidden group" 
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Registering...
                </>
              ) : (
                '✨ Register Patient'
              )}
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}