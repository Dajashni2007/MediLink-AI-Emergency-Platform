import React, { useState, useRef, useEffect } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useLocation } from '../context/LocationContext';
import { Sparkles, Send, Mic, MicOff, Volume2, VolumeX, X, Bot, User, AlertTriangle, Hospital, Siren, ShieldAlert } from 'lucide-react';

interface AIChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSos: () => void;
  onSearchCategory: (cat: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'I have a high fever & chills.',
  'My child has sudden severe stomach pain.',
  'I need the nearest orthopedic hospital for a fracture.',
  'Find nearby emergency ICU ambulance immediately.',
  'What are early signs of heart attack?'
];

export const AIChatbotDrawer: React.FC<AIChatbotDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSos,
  onSearchCategory
}) => {
  const { language } = useThemeLanguage();
  const { location } = useLocation();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: "Hello! I am your **MediLink AI Health Assistant**.\n\nDescribe your symptoms or ask me to locate specialized hospitals, doctors, or emergency ambulances.\n\n*Note: In life-threatening emergencies, please click the 🚨 SOS button immediately or call 112 / 108.*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || !ttsEnabled) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const promptText = queryText || input;
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          locationContext: location,
          language
        })
      });

      const data = await response.json();
      const replyText = data.reply || "I recommend consulting a physician or visiting the nearest hospital emergency room.";

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(replyText);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: "I am having trouble connecting to the AI medical server. If you have severe pain, difficulty breathing, or chest tightness, please press the **🚨 SOS Button** or call **108** immediately.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slide-left">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-700 via-blue-700 to-slate-900 text-white flex items-center justify-between border-b border-indigo-600 shadow">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm flex items-center space-x-1.5">
              <span>MediLink AI Doctor</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-black uppercase">
                Gemini 3.6
              </span>
            </h3>
            <p className="text-[11px] text-indigo-200">24/7 Smart Health Guidance & Triage</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            title={ttsEnabled ? 'Mute AI Voice' : 'Enable AI Voice Readout'}
            className={`p-1.5 rounded-lg transition-colors ${
              ttsEnabled ? 'bg-amber-400 text-slate-950' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow ${
                msg.sender === 'user' ? 'bg-blue-600' : 'bg-indigo-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.text.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-1.5 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              <span
                className={`block text-[10px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl w-fit animate-pulse">
            <Bot className="w-4 h-4" />
            <span>Analyzing health query with Gemini AI...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
          Quick Health Queries
        </p>
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-medium whitespace-nowrap hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:border-indigo-300 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Shortcuts Bar */}
      <div className="px-3 py-2 bg-red-50 dark:bg-red-950/50 border-t border-red-200 dark:border-red-900 flex items-center justify-between text-xs">
        <button
          onClick={onOpenSos}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-black rounded-lg flex items-center space-x-1 shadow"
        >
          <Siren className="w-3.5 h-3.5" />
          <span>Trigger SOS</span>
        </button>
        <button
          onClick={() => { onSearchCategory('Hospital'); onClose(); }}
          className="text-red-700 dark:text-red-300 font-bold hover:underline flex items-center space-x-1"
        >
          <Hospital className="w-3.5 h-3.5" />
          <span>Find Hospital</span>
        </button>
      </div>

      {/* Input Field */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type symptoms or ask health question..."
          className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleVoiceInput}
          className={`p-2 rounded-xl text-xs transition-colors ${
            isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
