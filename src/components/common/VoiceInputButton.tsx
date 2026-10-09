import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, AlertCircle, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SPEECH_LANG_MAP } from '../../i18n/translations';

interface VoiceInputButtonProps {
  onTranscript: (newText: string, isAppend: boolean) => void;
  appendMode?: boolean;
  fieldLabel?: string;
  size?: 'sm' | 'md';
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  appendMode = false,
  fieldLabel,
  size = 'md'
}) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const startListening = () => {
    setErrorMessage(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(t.voiceNotSupported);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Configure recognition
      const targetLang = SPEECH_LANG_MAP[language] || 'en-IN';
      recognition.lang = targetLang;
      recognition.continuous = appendMode;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript.trim()) {
          onTranscript(finalTranscript.trim(), appendMode);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage(t.voicePermissionDenied);
        } else if (event.error === 'no-speech') {
          setErrorMessage(t.voiceTryAgain);
        } else if (event.error === 'network') {
          setErrorMessage('Network error during voice recognition. You can type manually.');
        } else {
          setErrorMessage(t.voiceTryAgain);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.warn('SpeechRecognition initiation failed:', err);
      setIsListening(false);
      setErrorMessage(t.voiceTryAgain);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  if (!isSupported) {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          disabled
          className="p-2 rounded-xl text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed text-xs flex items-center gap-1 opacity-70"
          title={t.voiceNotSupported}
        >
          <MicOff className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] hidden sm:inline">Voice unsupported</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-2">
        {isListening ? (
          <button
            type="button"
            onClick={stopListening}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-600/30 animate-pulse hover:bg-rose-700 transition"
            title={t.voiceStop}
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{t.voiceStop}</span>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </button>
        ) : (
          <button
            type="button"
            onClick={startListening}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-slate-700 font-semibold text-xs shadow-2xs transition active:scale-95 group`}
            title={t.voiceTapToSpeak}
          >
            <Mic className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            <span>{t.voiceTapToSpeak}</span>
          </button>
        )}

        {isListening && (
          <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
            <Volume2 className="w-3.5 h-3.5 animate-bounce text-rose-600" />
            <span>{t.voiceListening}</span>
            <span className="text-[10px] text-slate-500 font-mono">
              ({SPEECH_LANG_MAP[language] || 'en-IN'})
            </span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 mt-0.5 max-w-sm">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-amber-800 font-bold ml-1 hover:underline"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
