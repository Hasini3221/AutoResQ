import React from 'react';
import { 
  Car, 
  Flame, 
  HeartPulse, 
  Building2, 
  Waves, 
  AlertTriangle 
} from 'lucide-react';
import { EmergencyCategory } from '../../types';

interface CategoryIconProps {
  category: EmergencyCategory;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-5 h-5' }) => {
  switch (category) {
    case 'accident':
      return <Car className={`${className} text-amber-400`} />;
    case 'fire':
      return <Flame className={`${className} text-rose-500`} />;
    case 'medical':
      return <HeartPulse className={`${className} text-red-400`} />;
    case 'collapse':
      return <Building2 className={`${className} text-orange-400`} />;
    case 'flood':
      return <Waves className={`${className} text-sky-400`} />;
    case 'other':
    default:
      return <AlertTriangle className={`${className} text-purple-400`} />;
  }
};
