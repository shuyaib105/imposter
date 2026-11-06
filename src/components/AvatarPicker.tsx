import { AVATARS } from '../data/words';

interface AvatarPickerProps {
  value: string;
  onChange: (avatar: string) => void;
}

export default function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-1.5 max-h-44 overflow-y-auto pr-1 no-scrollbar">
      {AVATARS.map((av) => (
        <button
          key={av}
          type="button"
          onClick={() => onChange(av)}
          aria-label={av}
          aria-pressed={value === av}
          className={`aspect-square rounded-xl flex items-center justify-center text-xl border transition cursor-pointer ${
            value === av
              ? 'bg-purple-950 border-purple-400 scale-105 shadow-lg shadow-purple-900/30'
              : 'bg-slate-900 border-slate-800 hover:border-slate-600'
          }`}
        >
          {av}
        </button>
      ))}
    </div>
  );
}
