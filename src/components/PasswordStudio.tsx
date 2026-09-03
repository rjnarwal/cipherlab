import React, { useState, useEffect } from 'react';
import { generatePassword, calculatePasswordStrength } from '../services/cryptoService';
import { PasswordConfig, PasswordStrength } from '../types';
import { KeyRound, Copy, Check, RefreshCw, ShieldCheck, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

export const PasswordStudio: React.FC = () => {
  const [config, setConfig] = useState<PasswordConfig>({
    length: 20,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: true,
  });

  const [password, setPassword] = useState<string>(() => generatePassword(config));
  const [strength, setStrength] = useState<PasswordStrength>(() => calculatePasswordStrength(password));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStrength(calculatePasswordStrength(password));
  }, [password]);

  const handleGenerate = () => {
    const next = generatePassword(config);
    setPassword(next);
  };

  const updateConfig = (patch: Partial<PasswordConfig>) => {
    const nextConfig = { ...config, ...patch };
    setConfig(nextConfig);
    const nextPass = generatePassword(nextConfig);
    setPassword(nextPass);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const STRENGTH_STYLES: Record<string, { color: string; bg: string }> = {
    'Very Weak': { color: 'text-red-400', bg: 'bg-red-500' },
    Weak: { color: 'text-orange-400', bg: 'bg-orange-500' },
    Fair: { color: 'text-amber-400', bg: 'bg-amber-500' },
    Strong: { color: 'text-blue-400', bg: 'bg-blue-500' },
    Unbreakable: { color: 'text-emerald-400', bg: 'bg-emerald-500' },
  };

  const style = STRENGTH_STYLES[strength.label] || STRENGTH_STYLES.Fair;

  return (
    <div className="space-y-6">
      {/* Generated Password & Entropy Display Card */}
      <div className="bg-background-secondary border border-border rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Generated Secure Password / Token
          </span>

          <div className="flex items-center space-x-2">
            <span className={`text-xs font-bold font-mono ${style.color}`}>
              {strength.label} ({strength.entropyBits} bits entropy)
            </span>
          </div>
        </div>

        {/* Display Field & Copy Button */}
        <div className="relative flex items-center">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full bg-background-tertiary border border-border rounded-xl py-3.5 pl-4 pr-24 font-mono text-sm sm:text-base text-text-primary focus:outline-none focus:border-accent select-all tracking-wide"
          />

          <div className="absolute right-2 flex items-center space-x-1">
            <button
              onClick={handleGenerate}
              className="p-2 rounded-lg bg-background-elevated hover:bg-background-secondary text-text-muted hover:text-text-primary border border-border transition-colors"
              title="Generate New Password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={copyPassword}
              className="px-3 py-2 rounded-lg bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20 hover:opacity-90 flex items-center space-x-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full bg-background-tertiary h-2 rounded-full overflow-hidden border border-border/60">
            <div
              className={`h-full transition-all duration-300 ${style.bg}`}
              style={{ width: `${Math.min(100, Math.max(10, strength.score))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span>Estimated Brute-Force Crack Time:</span>
            <span className="font-semibold text-text-primary">{strength.crackTime}</span>
          </div>
        </div>
      </div>

      {/* Generator Configuration Controls */}
      <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-5">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Password Complexity & Rule Generator
          </span>
        </div>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-secondary">Password Length:</span>
            <span className="font-mono font-bold text-accent px-2 py-0.5 rounded bg-background-tertiary border border-border">
              {config.length} characters
            </span>
          </div>

          <input
            type="range"
            min={8}
            max={64}
            value={config.length}
            onChange={(e) => updateConfig({ length: parseInt(e.target.value, 10) })}
            className="w-full accent-accent cursor-pointer"
          />
        </div>

        {/* Character Set Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <label className="p-3 rounded-xl bg-background-tertiary border border-border flex items-center justify-between cursor-pointer hover:border-accent/40 transition-colors">
            <span className="font-semibold text-text-primary">Uppercase Letters (A-Z)</span>
            <input
              type="checkbox"
              checked={config.includeUppercase}
              onChange={(e) => updateConfig({ includeUppercase: e.target.checked })}
              className="rounded bg-background-elevated border-border text-accent focus:ring-0"
            />
          </label>

          <label className="p-3 rounded-xl bg-background-tertiary border border-border flex items-center justify-between cursor-pointer hover:border-accent/40 transition-colors">
            <span className="font-semibold text-text-primary">Lowercase Letters (a-z)</span>
            <input
              type="checkbox"
              checked={config.includeLowercase}
              onChange={(e) => updateConfig({ includeLowercase: e.target.checked })}
              className="rounded bg-background-elevated border-border text-accent focus:ring-0"
            />
          </label>

          <label className="p-3 rounded-xl bg-background-tertiary border border-border flex items-center justify-between cursor-pointer hover:border-accent/40 transition-colors">
            <span className="font-semibold text-text-primary">Numbers / Digits (0-9)</span>
            <input
              type="checkbox"
              checked={config.includeNumbers}
              onChange={(e) => updateConfig({ includeNumbers: e.target.checked })}
              className="rounded bg-background-elevated border-border text-accent focus:ring-0"
            />
          </label>

          <label className="p-3 rounded-xl bg-background-tertiary border border-border flex items-center justify-between cursor-pointer hover:border-accent/40 transition-colors">
            <span className="font-semibold text-text-primary">Symbols (!@#$%^&*)</span>
            <input
              type="checkbox"
              checked={config.includeSymbols}
              onChange={(e) => updateConfig({ includeSymbols: e.target.checked })}
              className="rounded bg-background-elevated border-border text-accent focus:ring-0"
            />
          </label>

          <label className="p-3 rounded-xl bg-background-tertiary border border-border flex items-center justify-between cursor-pointer hover:border-accent/40 transition-colors sm:col-span-2">
            <div>
              <span className="font-semibold text-text-primary block">Avoid Ambiguous Characters</span>
              <span className="text-[10px] text-text-muted">Excludes confusing chars like O, 0, l, 1, I</span>
            </div>
            <input
              type="checkbox"
              checked={config.excludeAmbiguous}
              onChange={(e) => updateConfig({ excludeAmbiguous: e.target.checked })}
              className="rounded bg-background-elevated border-border text-accent focus:ring-0"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
