import React from 'react';
import { ShieldAlert, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SafetyNoticeBanner: React.FC<{ compact?: boolean }> = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-amber-50 border-b border-amber-200/80 text-amber-950 py-2 px-4 text-xs font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong className="font-bold text-amber-900 mr-1">Emergency Notice:</strong>
            {t.safetyDisclaimer}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] font-bold font-mono">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-800 underline decoration-rose-300"
          >
            <PhoneCall className="w-3 h-3 text-rose-600" />
            <span>SOS 112</span>
          </a>
          <span>•</span>
          <a
            href="tel:108"
            className="text-amber-900 hover:text-black underline decoration-amber-400"
          >
            Ambulance 108
          </a>
          <span>•</span>
          <a
            href="tel:101"
            className="text-amber-900 hover:text-black underline decoration-amber-400"
          >
            Fire 101
          </a>
        </div>
      </div>
    </div>
  );
};
