import { GameSettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import PageHeader from '../components/PageHeader';
import { UserRound, Briefcase, GraduationCap } from 'lucide-react';

interface DeveloperPageProps {
  settings: GameSettings;
  onBack: () => void;
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M1.636 20.091h3.819v-8.364L0 7.545v10.91c0 .902.732 1.636 1.636 1.636z" />
      <path fill="#34A853" d="M18.545 20.091h3.819c.904 0 1.636-.734 1.636-1.636V7.545l-5.455 4.182z" />
      <path fill="#FBBC04" d="M18.545 3.909v7.818L24 7.545V4.818c0-2.023-2.309-3.176-3.927-1.964z" />
      <path fill="#EA4335" d="M5.455 11.727V3.909L12 8.818l6.545-4.909v7.818L12 16.636z" />
      <path fill="#C5221F" d="M0 4.818v2.727l5.455 4.182V3.909L3.927 2.854C2.309 1.64 0 2.795 0 4.818z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#229ED9" />
      <path
        fill="#fff"
        d="M5.5 11.9 18.9 6.7c.6-.2 1.1.1.9.9l-2.3 10.9c-.2.7-.6.9-1.2.5l-3.3-2.4-1.6 1.5c-.2.2-.3.3-.7.3l.2-3.3 6-5.4c.3-.2-.1-.4-.4-.2l-7.4 4.7-3.2-1c-.7-.2-.7-.7.1-1z"
      />
    </svg>
  );
}

export default function DeveloperPage({ settings, onBack }: DeveloperPageProps) {
  const t = TRANSLATIONS[settings.language];

  const handleBack = () => {
    sound.playClick();
    onBack();
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 animate-fadeIn">
      <PageHeader
        title={t.developerSection}
        subtitle={t.developerSubtitle}
        code="SYS / CREDITS"
        backLabel={t.back}
        onBack={handleBack}
      />

      <div className="space-y-3">
        <div className="border border-purple-500/30 bg-slate-950/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-slate-800/80 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.3em] text-slate-500">
            <span className="text-purple-400">// DEV-01</span>
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <p className="flex items-center gap-2 border-b border-slate-800/70 px-3 py-3 text-[11px]">
            <UserRound className="h-4 w-4 shrink-0 text-purple-400" />
            <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-widest text-slate-500">
              {t.developerName}
            </span>
            <span className="font-bold text-white">Md. Shuyaib Islam</span>
          </p>

          <p className="flex items-center gap-2 border-b border-slate-800/70 px-3 py-3 text-[11px]">
            <Briefcase className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-widest text-slate-500">
              {t.developerRole}
            </span>
            <span className="text-slate-200">{t.roleDeveloper}</span>
          </p>

          <p className="flex items-center gap-2 border-b border-slate-800/70 px-3 py-3 text-[11px]">
            <GraduationCap className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-widest text-slate-500">
              {t.developerDept}
            </span>
            <span className="text-slate-200">ESE, KUET</span>
          </p>

          <a
            href="mailto:mdshuyaibislam5050@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 border-b border-slate-800/70 px-3 py-3 text-[11px] text-slate-300 transition-colors hover:bg-slate-900/60 hover:text-purple-300"
          >
            <GmailIcon className="h-4 w-4 shrink-0" />
            <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-widest text-slate-500">
              {t.developerEmail}
            </span>
            <span className="min-w-0 flex-1 break-all">mdshuyaibislam5050@gmail.com</span>
          </a>

          <a
            href="https://github.com/shuyaib105"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 border-b border-slate-800/70 px-3 py-3 text-[11px] text-slate-300 transition-colors hover:bg-slate-900/60 hover:text-purple-300"
          >
            <GithubIcon className="h-4 w-4 shrink-0 text-slate-100" />
            <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-widest text-slate-500">
              {t.developerGithub}
            </span>
            <span className="min-w-0 flex-1">shuyaib105</span>
          </a>

          <a
            href="https://t.me/shu_yaib"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-3 text-[11px] text-slate-300 transition-colors hover:bg-slate-900/60 hover:text-purple-300"
          >
            <TelegramIcon className="h-4 w-4 shrink-0" />
            <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-widest text-slate-500">
              {t.developerTelegram}
            </span>
            <span className="min-w-0 flex-1">Shu Yaib</span>
          </a>
        </div>

        <div className="border border-slate-800/80 bg-slate-950/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-slate-800/80 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.3em] text-slate-500">
            <span className="text-purple-400">// DEV-02</span>
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <p className="flex items-center gap-2 border-b border-slate-800/70 px-3 py-3 text-[11px]">
            <UserRound className="h-4 w-4 shrink-0 text-purple-400" />
            <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-widest text-slate-500">
              {t.developerName}
            </span>
            <span className="font-bold text-white">Nirob</span>
          </p>

          <p className="flex items-center gap-2 border-b border-slate-800/70 px-3 py-3 text-[11px]">
            <Briefcase className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-widest text-slate-500">
              {t.developerRole}
            </span>
            <span className="text-slate-200">{t.roleFounder}</span>
          </p>

          <p className="flex items-center gap-2 px-3 py-3 text-[11px]">
            <GraduationCap className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="w-16 shrink-0 font-mono text-[9px] uppercase tracking-widest text-slate-500">
              {t.developerDept}
            </span>
            <span className="text-slate-200">Civil, KUET</span>
          </p>
        </div>
      </div>
    </div>
  );
}