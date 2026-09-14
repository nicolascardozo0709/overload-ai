import React, { useState, useRef, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { aiCoachAgent, ChatMessage } from '../services/aiCoachAgent';
import { Sparkles, X, Send, Bot, Dumbbell, Zap, ArrowDown } from 'lucide-react';

interface AICoachChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_CHIPS = [
  { label: '🔄 Máquina ocupada', prompt: 'La máquina de mi ejercicio está ocupada, ¿qué alternativa hago?' },
  { label: '⚡ Me siento cansado', prompt: 'Hoy dormí poco y tengo fatiga, ¿cómo ajusto el entrenamiento?' },
  { label: '📈 ¿Cómo aplico sobrecarga?', prompt: '¿Cómo decido cuándo subir de peso o repeticiones hoy?' },
  { label: '🏃 Corro 21K, ¿cómo combino?', prompt: '¿Cómo combino mi entrenamiento de pierna con mis carreras y 21K?' },
  { label: '🩹 Molestia en hombro o rodilla', prompt: 'Tengo una ligera molestia articular, ¿qué precauciones tomo?' }
];

export const AICoachChatModal: React.FC<AICoachChatModalProps> = ({ isOpen, onClose }) => {
  const { activeProfile, activeWorkout, workoutHistory, routines, exercises, stats } = useWorkout();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola ' + (activeProfile?.name || 'Nico') + '! ⚡ Soy tu **Coach Virtual de Sobrecarga e IA**.\n\nEstoy aquí para ayudarte durante tus entrenamientos en tiempo real: si una máquina está ocupada, si tienes fatiga, dudas con la técnica de tus ejercicios o quieres saber cómo progresar en tus series de hoy.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages, isTyping]);

  if (!isOpen) return null;

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
        stats
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#121214] border border-white/10 rounded-t-3xl sm:rounded-3xl flex flex-col h-[90vh] sm:h-[650px] shadow-2xl overflow-hidden animate-slideUp">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#18181B]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#18181B] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-tight">Coach Virtual IA</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  En vivo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {activeWorkout ? '⚡ Entrenando: ' + activeWorkout.routineName : 'Asesor de sobrecarga y técnica'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#202024] flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-[#0E0E10]">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={'flex flex-col ' + (isUser ? 'items-end' : 'items-start')}
              >
                <div
                  className={'max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ' +
                    (isUser
                      ? 'bg-cyan-500 text-black font-semibold rounded-br-none shadow-md shadow-cyan-500/20'
                      : 'bg-[#1C1C1E] border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
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
            <div className="flex items-center gap-2 bg-[#1C1C1E] border border-white/10 rounded-2xl px-4 py-2.5 w-fit rounded-bl-none">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[10px] text-slate-400 font-bold ml-1">Analizando entreno...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[#141416] border-t border-white/5 overflow-x-auto no-scrollbar flex gap-2">
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip.prompt)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#1F1F23] border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white shrink-0 active:scale-95 transition"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#18181B] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Pregúntale a tu Coach IA..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#101012] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-10 h-10 rounded-2xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-cyan-400 text-black flex items-center justify-center font-black transition active:scale-95 shrink-0 shadow-lg shadow-cyan-400/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
