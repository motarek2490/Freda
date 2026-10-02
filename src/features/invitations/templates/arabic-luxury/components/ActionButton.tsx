import React from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  label: string; onClick: () => void; icon?: LucideIcon; variant?: 'outline' | 'gold'; fullWidth?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, icon: Icon, variant = 'outline', fullWidth = false }) => (
  <motion.button onClick={onClick} className={`frida-btn-primary ${variant === 'gold' ? 'frida-btn-gold' : ''}`}
    style={{ width: fullWidth ? '100%' : 'auto' }} whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3 }}>
    {Icon && <Icon className="w-4 h-4" />}
    <span>{label}</span>
  </motion.button>
);
