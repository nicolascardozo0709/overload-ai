import React, { useState, useRef, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { aiCoachAgent, ChatMessage } from '../services/aiCoachAgent';
import { Sparkles, X, Send, Key, Check, ExternalLink, Cpu } from 'lucide-react';

interface AICoachChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_CHIPS = [
  { label: '🔄 Máquina ocupada', prompt: 'La máquina de mi ejercicio está ocupada, ¿qué alternativa hago?' },
  { label: '⚡ Me siento cansado', prompt: 'Hoy dormí poco y tengo fatiga, ¿cómo ajusto el entrenamiento?' },
  { label: '📈 ¿Cómo aplico sobrecarga?', prompt: '¿Cómo decido cuándo subir de peso o repeticiones hoy?' },
  { label: '🏃 Corro 21K, ¿cómo combino?', prompt: '¿Cómo combino mi entrenamiento de pierna con mis carreras y 21K?' },
  { label: '🩹 Molestia articular', prompt: 'Tengo una ligera molestia articular, ¿qué precauciones tomo?' }
];

const AVAILABLE_MODELS = [
  { id: 'gemini-2.0-flash', label: '⚡ Gemini 2.0 Flash (Más reciente y veloz)' },
  { id: 'gemini-1.5-pro', label: '🧠 Gemini 1.5 Pro (Máximo razonamiento - Pro)' },
  { id: 'gemini-1.5-flash', label: '🔹 Gemini 1.5 Flash (Ligero)' }
];

export const AICoachChatModal: React.FC<AICoachChatModalProps> = ({ isOpen, onClose }) => {
  const { activeProfile, activeWorkout, workoutHistory, routines, exercises, stats } = useWorkout();
  
  const [apiKey, setApiKey] = useState(aiCoachAgent.getApiKey());
  const [selectedModel, setSelectedModel] = useState(aiCoachAgent.getModel());
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola ' + (activeProfile?.name || 'Nico') + '! ⚡ Soy tu **Coach Virtual de Sobrecarga e IA**.\n\nEstoy aquí para ayudarte en tiempo real durante tu entrenamiento. Pregúntame lo que quieras o toca uno de los botones rápidos de abajo.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 50);
    }
  }, [isOpen, messages, isTyping]);

  if (!isOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    aiCoachAgent.setApiKey(inputKey);
    aiCoachAgent.setModel(selectedModel);
    setApiKey(inputKey.trim());
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeySettings(false);
    }, 1500);
  };

  const handleSend = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const responseText = await aiCoachAgent.getResponse(message, {
        profileName: activeProfile?.name || 'Nico',
        activeWorkout,
        workoutHistory,
        routines,
        exercises,
        stats,
        chatHistory: messages
      });

      const assistantMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          text: 'Disculpa, tuve un momento de desconexión. Vuelve a intentarlo.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-lg bg-[#141416] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl flex flex-col h-[85vh] max-h-[90dvh] sm:h-[620px] shadow-2xl overflow-hidden relative z-[101]"
        style={{ touchAction: 'pan-y' }}
      >
        
        {/* Grab Handle */}
        <div className="w-full pt-2.5 pb-1 flex justify-center cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1 bg-white/20 hover:bg-white/40 rounded-full transition" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-[#1A1A1E]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-black shadow-md shadow-cyan-500/20 font-black">
                <Sparkles className="w-4 h-4 fill-black" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1A1A1E] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">Coach Virtual IA</h3>
                {apiKey ? (
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> {selectedModel.replace('gemini-', 'Gemini ').replace('-', ' ')}
                  </span>
                ) : (
                  <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Coach Activo
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[190px]">
                {activeWorkout ? '⚡ ' + activeWorkout.routineName : 'Asesor en tiempo real'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeySettings(!showKeySettings)}
              className={'w-8 h-8 rounded-full flex items-center justify-center transition text-xs ' + 
                (apiKey ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-slate-300 hover:text-white')}
              title="Configurar Modelo y API"
            >
              <Cpu className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panel de Configuración Gemini (Desplegable) */}
        {showKeySettings && (
          <div className="p-3.5 bg-[#18181C] border-b border-white/10 animate-fadeIn text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Modelo de Inteligencia Artificial
              </span>
              <button onClick={() => setShowKeySettings(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Versión del Modelo</label>
              <select
                value={selectedModel}
                onChange={e => {
                  setSelectedModel(e.target.value);
                  aiCoachAgent.setModel(e.target.value);
                }}
                className="w-full bg-[#101012] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {AVAILABLE_MODELS.map(m => (
                  <option key={m.id} value={m.id} className="bg-[#18181C] text-white">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">API Key de Google (Gratis)</label>
              <form onSubmit={handleSaveKey} className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={inputKey}
                  onChange={e => setInputKey(e.target.value)}
                  className="flex-1 bg-[#101012] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-cyan-400 text-black font-black text-xs hover:bg-cyan-300 transition"
                >
                  {keySavedMessage ? '¡Listo!' : 'Guardar'}
                </button>
              </form>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <a 
                href="https://aistudio.google.com/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                Obtener clave gratis en Google AI Studio <ExternalLink className="w-2.5 h-2.5" />
              </a>
              {apiKey && (
                <button
                  type="button"
                  onClick={() => {
                    aiCoachAgent.setApiKey('');
                    setApiKey('');
                    setInputKey('');
                  }}
                  className="text-red-400 hover:underline"
                >
                  Quitar clave
                </button>
              )}
            </div>
          </div>
        )}

        {/* Message Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0E0E10] no-scrollbar"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={'flex flex-col ' + (isUser ? 'items-end' : 'items-start')}
              >
                <div
                  className={'max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ' +
                    (isUser
                      ? 'bg-cyan-500 text-black font-semibold rounded-br-none shadow-sm'
                      : 'bg-[#1E1E22] border border-white/10 text-slate-100 rounded-bl-none shadow-sm'
                    )
                  }
                >
                  <div className="whitespace-pre-wrap">
                    {m.text}
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 bg-[#1E1E22] border border-white/10 rounded-2xl px-3.5 py-2 w-fit rounded-bl-none">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-slate-400 font-bold ml-1">Consultando {selectedModel.includes('2.0') ? 'Gemini 2.0...' : 'Coach IA...'}</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div 
          className="px-3 py-2 bg-[#141416] border-t border-white/5 overflow-x-auto no-scrollbar flex gap-2 shrink-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(chip.prompt)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#202024] border border-white/10 hover:border-cyan-400/50 text-slate-200 hover:text-white shrink-0 active:scale-95 transition"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#1A1A1E] border-t border-white/10 pb-[max(18px,env(safe-area-inset-bottom,18px))] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Escribe tu mensaje al Coach IA..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ fontSize: '16px' }}
              className="flex-1 bg-[#101012] border border-white/15 rounded-2xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-10 h-10 rounded-2xl bg-cyan-400 active:bg-cyan-300 disabled:opacity-40 text-black flex items-center justify-center font-black transition active:scale-95 shrink-0 shadow-md shadow-cyan-400/20"
              aria-label="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
