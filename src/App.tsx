import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HashStudio } from './components/HashStudio';
import { HmacStudio } from './components/HmacStudio';
import { SymmetricStudio } from './components/SymmetricStudio';
import { UUIDStudio } from './components/UUIDStudio';
import { EncoderStudio } from './components/EncoderStudio';
import { PasswordStudio } from './components/PasswordStudio';
import { CryptoStudioTab } from './types';
import {
  Hash,
  KeyRound,
  Lock,
  Binary,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
  FileCode2,
} from 'lucide-react';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'midnight' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<CryptoStudioTab>('hash');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('grassroot_theme') as 'dark' | 'midnight' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.remove('dark', 'midnight', 'light');
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'midnight' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('grassroot_theme', newTheme);
    document.documentElement.classList.remove('dark', 'midnight', 'light');
    document.documentElement.classList.add(newTheme);
  };

  const tabs: { id: CryptoStudioTab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'hash',
      label: 'Cryptographic Hashes',
      icon: <Hash className="w-4 h-4" />,
      desc: 'SHA-256, SHA-512, MD5 & CRC32',
    },
    {
      id: 'hmac',
      label: 'HMAC Signatures',
      icon: <KeyRound className="w-4 h-4" />,
      desc: 'Keyed message authentication',
    },
    {
      id: 'symmetric',
      label: 'AES-256 Encryption',
      icon: <Lock className="w-4 h-4" />,
      desc: 'WebCrypto AES-GCM & CBC',
    },
    {
      id: 'uuid',
      label: 'UUID & Identifiers',
      icon: <Layers className="w-4 h-4" />,
      desc: 'UUID v7, v4, ULID & NanoID',
    },
    {
      id: 'encoder',
      label: 'Encoder / Converter',
      icon: <Binary className="w-4 h-4" />,
      desc: 'Base64, Hex, Binary & URL',
    },
    {
      id: 'password',
      label: 'Password Generator',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Entropy & API tokens',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary selection:bg-accent selection:text-white antialiased">
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onThemeChange={handleThemeChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Studio Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-background-secondary border-accent shadow-lg shadow-accent/10 ring-1 ring-accent scale-[1.02]'
                    : 'bg-background-secondary/70 border-border hover:border-accent/40 hover:bg-background-secondary'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-accent text-white' : 'bg-background-tertiary text-text-muted'}`}>
                    {tab.icon}
                  </div>
                  <span className="font-heading font-bold text-xs text-text-primary truncate">
                    {tab.label}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted mt-2 truncate block">
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        <div className="pt-2">
          {activeTab === 'hash' && <HashStudio />}
          {activeTab === 'hmac' && <HmacStudio />}
          {activeTab === 'symmetric' && <SymmetricStudio />}
          {activeTab === 'uuid' && <UUIDStudio />}
          {activeTab === 'encoder' && <EncoderStudio />}
          {activeTab === 'password' && <PasswordStudio />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-border py-4 mt-auto select-none text-xs text-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-text-primary">CipherLab</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Cloud Local Memory Execution</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://grassroot.digital"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              grassroot.digital
            </a>
            <a
              href="https://endly.grassroot.digital"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              Endly API
            </a>
            <a
              href="https://tokenlens.grassroot.digital"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              TokenLens
            </a>
            <a
              href="https://jsonlens.grassroot.digital"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              JSONLens
            </a>
            <a
              href="https://regexforge.grassroot.digital"
              className="text-text-secondary hover:text-accent transition-colors"
            >
              RegexForge
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
