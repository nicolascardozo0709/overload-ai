import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { User, Plus, Check, X, Sparkles, Heart } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['⚡', '🔥', '🌸', '👑', '🦁', '🏋️‍♀️', '🚀', '💎', '🤍', '💪'];
const COLOR_OPTIONS = ['#00F0FF', '#FF2D55', '#AF52DE', '#30D158', '#FF9500', '#FFCC00'];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profiles, activeProfile, switchProfile, createNewProfile, updateProfileName } = useWorkout();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🌸');
  const [selectedColor, setSelectedColor] = useState('#FF2D55');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createNewProfile(newName.trim(), selectedEmoji, selectedColor);
    setNewName('');
    setShowCreateForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-slideUp">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Perfiles de Entrenamiento</h2>
              <p className="text-xs text-slate-400">Sesiones 100% aisladas e independientes</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative banner */}
        <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Cada perfil tiene sus <strong>propias rutinas, historial, pesos y rachas</strong>. Al pasárselo a tu novia, ella puede usar su propio perfil sin alterar tus datos.
          </p>
        </div>

        {/* Existing Profiles List */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Seleccionar Perfil Activo
          </span>
          <div className="grid grid-cols-1 gap-2">
            {profiles?.map(p => {
              const isActive = p.id === activeProfile?.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    switchProfile(p.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#1E2028] to-[#14151B] border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                      : 'bg-[#18181B] border-white/5 hover:border-white/10 active:bg-[#202024]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/10"
                      style={{ backgroundColor: `${p.color}25` }}
                    >
                      {p.avatarEmoji}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        {p.name}
                        {isActive && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">
                            Activo
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isActive ? 'Sesión en uso ahora mismo' : 'Toca para cambiar a este perfil'}
                      </p>
                    </div>
                  </div>

                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 hover:text-white">
                      Cambiar ➔
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Profile Section */}
        {!showCreateForm ? (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full py-3 rounded-2xl bg-[#18181B] hover:bg-[#202024] border border-dashed border-white/20 text-cyan-400 text-xs font-black flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" /> Crear Perfil para mi Novia / Compañero
          </button>
        ) : (
          <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-[#18181B] border border-white/10 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> Nuevo Perfil Personal
              </span>
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)}
                className="text-xs text-slate-500 hover:text-white"
              >
                Cancelar
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Nombre</label>
              <input 
                type="text"
                placeholder="Ej. Valentina, Mi Novia..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1.5">Elige un Emoji</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {EMOJI_OPTIONS.map(em => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setSelectedEmoji(em)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition shrink-0 ${
                      selectedEmoji === em ? 'bg-white/20 ring-2 ring-cyan-400 scale-110' : 'bg-[#121214] border border-white/5'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1.5">Color de Tema</label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full transition ${
                      selectedColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#18181B]' : 'opacity-70'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!newName.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 active:from-pink-400 active:to-rose-500 disabled:opacity-50 text-white font-black text-xs shadow-lg shadow-pink-500/20 transition"
            >
              Guardar y Usar Perfil
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
