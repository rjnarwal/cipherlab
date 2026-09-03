import React from 'react';
import {
  ShieldCheck,
  ExternalLink,
  Moon,
  Sun,
  Lock,
  Binary,
  KeyRound,
  FileCode2,
  Zap,
  Home,
  Sliders,
  Terminal,
} from 'lucide-react';

import { isDesktopEnvironment, isMacDesktopEnvironment } from '../utils/platform';

interface NavbarProps {
  theme: 'dark' | 'midnight' | 'light';
  onThemeChange: (theme: 'dark' | 'midnight' | 'light') => void;
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  activeTab,
  onTabChange,
}) => {
  const isDesktop = isDesktopEnvironment();
  const isMac = isMacDesktopEnvironment();

  return (
    <header className={`bg-background-secondary border-b border-border select-none sticky top-0 z-40 app-drag-region ${
      isMac ? 'pl-24 pr-4' : 'px-4'
    }`}>
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
        {/* Left: Brand & Product Info */}
        <div className="flex items-center space-x-3 no-drag">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-bold text-sm tracking-tight text-text-primary">
                  CipherLab
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-pink-500/15 text-pink-400 font-mono font-bold border border-pink-500/30">
                  Crypto Studio
                </span>
              </div>
              <span className="text-[10px] text-text-muted font-mono -mt-0.5">
                by grassroot.digital
              </span>
            </div>
          </div>

          {/* Ecosystem Navigation Links (Shown ONLY on Web, hidden on Desktop App) */}
          {!isDesktop && (
            <div className="hidden lg:flex items-center space-x-1 pl-4 border-l border-border/80 text-xs">
              <a
                href="https://grassroot.digital"
                className="px-2.5 py-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors flex items-center space-x-1"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hub</span>
              </a>
              <a
                href="https://endly.grassroot.digital"
                className="px-2.5 py-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors flex items-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                <span>Endly API</span>
              </a>
              <a
                href="https://tokenlens.grassroot.digital"
                className="px-2.5 py-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors flex items-center space-x-1"
              >
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                <span>TokenLens</span>
              </a>
              <a
                href="https://jsonlens.grassroot.digital"
                className="px-2.5 py-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors flex items-center space-x-1"
              >
                <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>JSONLens</span>
              </a>
              <a
                href="https://regexforge.grassroot.digital"
                className="px-2.5 py-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors flex items-center space-x-1"
              >
                <span className="text-emerald-400 font-mono font-bold text-[11px]">.*</span>
                <span>RegexForge</span>
              </a>
            </div>
          )}
        </div>

        {/* Right: Security Badge & Theme Switcher */}
        <div className="flex items-center space-x-3 no-drag">
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% In-Memory WebCrypto</span>
          </div>

          {/* Desktop App Download (Only on Web) */}
          {!isDesktop && (
            <a
              href="https://github.com/rjnarwal/cipherlab/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/40 text-xs text-pink-400 font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
              title="Download CipherLab Native Desktop App (Mac / Windows / Linux)"
            >
              <span className="hidden sm:inline">Desktop App ▾</span>
              <span className="sm:hidden">App ▾</span>
            </a>
          )}

          {/* Theme Switcher */}
          <div className="flex items-center bg-background-tertiary border border-border rounded-xl p-0.5 shadow-sm">
            <button
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'dark' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
              title="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('midnight')}
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono transition-all ${
                theme === 'midnight' ? 'bg-blue-600 text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
              title="Midnight Navy Theme"
            >
              Navy
            </button>
            <button
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                theme === 'light' ? 'bg-amber-500 text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
              title="Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
