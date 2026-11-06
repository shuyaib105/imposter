import { useState } from 'react';
import { GameSettings, GameDifficulty } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CATEGORIES } from '../data/words';
import { sound } from '../utils/sound';
import { saveSettings } from '../utils/storage';
import {
  Settings as SettingsIcon,
  Volume2,
  Languages,
  Sparkles,
  Zap,
  Check,
  Moon,
  Sun,
} from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onBack: () => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onBack,
}: SettingsModalProps) {
  const [current, setCurrent] = useState<GameSettings>({ ...settings });
  const t = TRANSLATIONS[current.language];

  const handleToggleLang = (lang: 'en' | 'bn') => {
    sound.playClick();
    const updated = { ...current, language: lang };
    setCurrent(updated);
    onUpdateSettings(updated);
    saveSettings(updated);
  };

  const handleToggleSound = () => {
    sound.playClick();
    const updated = { ...current, soundEnabled: !current.soundEnabled };
    sound.setEnabled(updated.soundEnabled);
    setCurrent(updated);
    onUpdateSettings(updated);
    saveSettings(updated);
  };

  const handleToggleAnimations = () => {
    sound.playClick();
    const updated = { ...current, animationsEnabled: !current.animationsEnabled };
    setCurrent(updated);
    onUpdateSettings(updated);
    saveSettings(updated);
  };

  const handleToggleTheme = () => {
    sound.playClick();
    const updated = { ...current, darkMode: !current.darkMode };
    setCurrent(updated);
    onUpdateSettings(updated);
    saveSettings(updated);
  };

  const handleChangeDifficulty = (diff: GameDifficulty) => {
    sound.playClick();
    const updated = { ...current, defaultDifficulty: diff };
    setCurrent(updated);
    onUpdateSettings(updated);
    saveSettings(updated);
  };

  const handleToggleCategory = (catId: string) => {
    sound.playClick();
    let updatedCats = [...current.preferredCategories];
    if (updatedCats.includes(catId)) {
      if (updatedCats.length > 1) {
        updatedCats = updatedCats.filter((c) => c !== catId);
      }
    } else {
      updatedCats.push(catId);
    }
    const updated = { ...current, preferredCategories: updatedCats };
    setCurrent(updated);
    onUpdateSettings(updated);
    saveSettings(updated);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-xs uppercase font-mono tracking-widest text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 transition cursor-pointer"
        >
          ← {t.back}
        </button>
        <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>{t.settings}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Language selector */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.language}</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleToggleLang('en')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                current.language === 'en'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {current.language === 'en' && <Check className="w-3.5 h-3.5" />}
              <span>{t.english}</span>
            </button>

            <button
              onClick={() => handleToggleLang('bn')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                current.language === 'bn'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {current.language === 'bn' && <Check className="w-3.5 h-3.5" />}
              <span>{t.bangla}</span>
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              {current.darkMode ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
              <div>
                <span className="block">{t.darkMode}</span>
              </div>
            </div>
            <button
              onClick={handleToggleTheme}
              role="switch"
              aria-checked={current.darkMode}
              aria-label={t.darkMode}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                current.darkMode ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#fff] transition-transform absolute top-0.5 ${
                  current.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Audio / FX switches */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span>{t.sound}</span>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                current.soundEnabled ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#fff] transition-transform absolute top-0.5 ${
                  current.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{t.animations}</span>
            </div>
            <button
              onClick={handleToggleAnimations}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                current.animationsEnabled ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#fff] transition-transform absolute top-0.5 ${
                  current.animationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Default Difficulty */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.difficulty}</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'EASY' as GameDifficulty, label: t.difficultyEasy },
              { id: 'MEDIUM' as GameDifficulty, label: t.difficultyMedium },
              { id: 'HARD' as GameDifficulty, label: t.difficultyHard },
            ].map(({ id: d, label }) => (
              <button
                key={d}
                onClick={() => handleChangeDifficulty(d)}
                className={`py-2 px-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                  current.defaultDifficulty === d
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Categories */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
            {t.activeWordCategories}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = current.preferredCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleToggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950 border border-purple-500/60 text-purple-200'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {current.language === 'bn' ? cat.bn : cat.en}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
