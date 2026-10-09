import React from 'react';
import { IncidentSeverity } from '../../types';
import { AlertCircle, AlertOctagon, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SeverityBadge: React.FC<{ severity: IncidentSeverity; showIcon?: boolean; size?: 'sm' | 'md' }> = ({
  severity,
  showIcon = true,
  size = 'md'
}) => {
  const labels: Record<IncidentSeverity, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };

  const styleMap: Record<IncidentSeverity, { bg: string; text: string; border: string; icon: any }> = {
    critical: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: AlertOctagon
    },
    high: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: AlertTriangle
    },
    medium: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: AlertCircle
    },
    low: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: ShieldCheck
    }
  };

  const current = styleMap[severity] || styleMap.medium;
  const Icon = current.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-bold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border uppercase tracking-wider font-mono ${sizeClasses} ${current.bg} ${current.text} ${current.border}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      {labels[severity]}
    </span>
  );
};
