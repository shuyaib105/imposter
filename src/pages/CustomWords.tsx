import React, { useState } from 'react';
import { GameSettings, WordPair } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import { Sparkles, PlusCircle, Trash2, BookPlus } from 'lucide-react';

interface CustomWordsProps {
  settings: GameSettings;
  customPairs: WordPair[];
  onAddCustomPair: (pair: WordPair) => void;
  onDeleteCustomPair: (id: string) => void;
  onBack: () => void;
}

export default function CustomWords({
  settings,
  customPairs,
  onAddCustomPair,
  onDeleteCustomPair,
  onBack,
}: CustomWordsProps) {
  const t = TRANSLATIONS[settings.language];
  const [wordA, setWordA] = useState('');
  const [wordB, setWordB] = useState('');
  const [category, setCategory] = useState('Custom');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const majorityWord = wordA.trim();
    const imposterWord = wordB.trim();

    if (!majorityWord || !imposterWord) {
      setErrorMsg(t.wordsRequired);
      return;
    }
    if (majorityWord.toLowerCase() === imposterWord.toLowerCase()) {
      setErrorMsg(t.wordsMustDiffer);
      return;
    }
    const isDuplicate = customPairs.some(
      (p) =>
        p.wordA.trim().toLowerCase() === majorityWord.toLowerCase() &&
        p.wordB.trim().toLowerCase() === imposterWord.toLowerCase()
    );
    if (isDuplicate) {
      setErrorMsg(t.duplicatePairWarning);
      return;
    }

    sound.playClick();
    const categoryName = category.trim() || 'Custom';
    const newPair: WordPair = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      category: categoryName,
      categoryBn: categoryName === 'Custom' ? 'কাস্টম' : categoryName,
      wordA: majorityWord,
      wordABn: majorityWord,
      wordB: imposterWord,
      wordBBn: imposterWord,
      difficulty: 'MEDIUM',
      isCustom: true,
    };

    onAddCustomPair(newPair);
    setWordA('');
    setWordB('');
    setErrorMsg('');
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
          <BookPlus className="w-3.5 h-3.5" />
          <span>{t.customWords}</span>
        </div>
      </div>

      {/* Add Pair Form */}
      <form onSubmit={handleAdd} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{t.addCustomPair}</span>
        </h3>

        <div>
          <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            {t.wordMajorityLabel} {t.mostPlayersHint}
          </label>
          <input
            type="text"
            required
            maxLength={30}
            value={wordA}
            onChange={(e) => setWordA(e.target.value)}
            placeholder={t.customWordAPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            {t.wordImposterLabel} {t.imposterOnlyHint}
          </label>
          <input
            type="text"
            required
            maxLength={30}
            value={wordB}
            onChange={(e) => setWordB(e.target.value)}
            placeholder={t.customWordBPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
            {t.categoryNameLabel}
          </label>
          <input
            type="text"
            maxLength={20}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t.customCategoryPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-[11px]">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{t.saveCustomPair}</span>
        </button>
      </form>

      {/* Existing Custom Pairs */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block px-1">
          {t.savedPairs} ({customPairs.length})
        </span>

        {customPairs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-500">
            {t.noCustomWords}
          </div>
        ) : (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
            {customPairs.map((cp) => (
              <div
                key={cp.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs"
              >
                <div>
                  <span className="font-bold text-white block">
                    {cp.wordA} / <span className="text-purple-300">{cp.wordB}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {settings.language === 'bn' ? cp.categoryBn || cp.category : cp.category}
                  </span>
                </div>

                {confirmDeleteId === cp.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-mono uppercase cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onDeleteCustomPair(cp.id);
                        setConfirmDeleteId(null);
                      }}
                      className="px-2 py-1 rounded-lg bg-red-600 text-white text-[10px] font-mono uppercase cursor-pointer"
                    >
                      {t.confirm}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setConfirmDeleteId(cp.id);
                    }}
                    title={t.delete}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
