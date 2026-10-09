import React from 'react';
import { IncidentStatus } from '../../types';
import { Clock, Eye, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const StatusBadge: React.FC<{ status: IncidentStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md'
}) => {
  const { t } = useLanguage();

  const labels: Record<IncidentStatus, string> = {
    awaiting_review: t.statusPending,
    under_review: t.statusUnderReview,
    action_recorded: t.statusActionRecorded,
    resolved: t.statusResolved
  };

  const styleMap: Record<IncidentStatus, { bg: string; text: string; border: string; icon: any }> = {
    awaiting_review: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: Clock
    },
    under_review: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: Eye
    },
    action_recorded: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      icon: ShieldAlert
    },
    resolved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: CheckCircle2
    }
  };

  const current = styleMap[status] || styleMap.awaiting_review;
  const Icon = current.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-bold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${current.bg} ${current.text} ${current.border}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {labels[status]}
    </span>
  );
};
