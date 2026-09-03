import React, { useState } from 'react';
import { generateUUIDBatch } from '../services/cryptoService';
import { UUIDConfig } from '../types';
import { Hash, Copy, Check, RefreshCw, Download, Sparkles, Clock, Shuffle, Layers } from 'lucide-react';

export const UUIDStudio: React.FC = () => {
  const [config, setConfig] = useState<UUIDConfig>({
    type: 'v7',
    quantity: 5,
    uppercase: false,
    hyphens: true,
  });

  const [generatedList, setGeneratedList] = useState<string[]>(() => generateUUIDBatch(config));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleRegenerate = () => {
    setGeneratedList(generateUUIDBatch(config));
  };

  const updateConfig = (patch: Partial<UUIDConfig>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    setGeneratedList(generateUUIDBatch(next));
  };

  const copyItem = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const copyAll = async () => {
    copyItem('all', generatedList.join('\n'));
  };

  const downloadText = () => {
    const blob = new Blob([generatedList.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cipherlab-${config.type}-batch-${config.quantity}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Config Controls Bar */}
      <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Format Selector Pills */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Identifier Standard & Specification:
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => updateConfig({ type: 'v7' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  config.type === 'v7'
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'bg-background-tertiary text-text-secondary hover:text-text-primary border border-border'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>UUID v7 (Time-Ordered)</span>
              </button>

              <button
                onClick={() => updateConfig({ type: 'v4' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  config.type === 'v4'
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'bg-background-tertiary text-text-secondary hover:text-text-primary border border-border'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>UUID v4 (Random)</span>
              </button>

              <button
                onClick={() => updateConfig({ type: 'ulid' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  config.type === 'ulid'
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'bg-background-tertiary text-text-secondary hover:text-text-primary border border-border'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>ULID (Base32)</span>
              </button>

              <button
                onClick={() => updateConfig({ type: 'nanoid' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  config.type === 'nanoid'
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'bg-background-tertiary text-text-secondary hover:text-text-primary border border-border'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>NanoID (Compact)</span>
              </button>
            </div>
          </div>

          {/* Regenerate Action */}
          <button
            onClick={handleRegenerate}
            className="px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-bold shadow-md shadow-accent/20 hover:opacity-95 flex items-center space-x-2 shrink-0 self-start sm:self-end"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Fresh Batch</span>
          </button>
        </div>

        {/* Quantity & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60 text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-text-secondary">Quantity:</span>
            {[1, 5, 10, 25, 50, 100].map((qty) => (
              <button
                key={qty}
                onClick={() => updateConfig({ quantity: qty })}
                className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                  config.quantity === qty
                    ? 'bg-accent text-white font-bold'
                    : 'bg-background-tertiary text-text-muted hover:text-text-primary'
                }`}
              >
                {qty}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer text-text-secondary select-none">
              <input
                type="checkbox"
                checked={config.uppercase}
                onChange={(e) => updateConfig({ uppercase: e.target.checked })}
                className="rounded bg-background-tertiary border-border text-accent focus:ring-0"
              />
              <span>UPPERCASE</span>
            </label>

            {config.type !== 'ulid' && config.type !== 'nanoid' && (
              <label className="flex items-center space-x-1.5 cursor-pointer text-text-secondary select-none">
                <input
                  type="checkbox"
                  checked={config.hyphens}
                  onChange={(e) => updateConfig({ hyphens: e.target.checked })}
                  className="rounded bg-background-tertiary border-border text-accent focus:ring-0"
                />
                <span>Include Hyphens</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Generated Batch List Card */}
      <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Batch Output ({generatedList.length} Identifiers)
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={copyAll}
              className="px-3 py-1.5 rounded-xl bg-background-tertiary hover:bg-background-elevated border border-border text-text-primary flex items-center space-x-1.5 transition-colors"
            >
              {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all' ? 'All Copied' : 'Copy All'}</span>
            </button>

            <button
              onClick={downloadText}
              className="p-1.5 rounded-xl bg-background-tertiary hover:bg-background-elevated border border-border text-text-secondary hover:text-text-primary transition-colors"
              title="Download as .txt file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
          {generatedList.map((id, index) => (
            <div
              key={`${id}-${index}`}
              className="p-3 rounded-xl bg-background-tertiary border border-border flex items-center justify-between font-mono text-xs hover:border-accent/40 transition-colors group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span className="text-[10px] text-text-muted select-none w-6">#{index + 1}</span>
                <span className="text-text-primary font-semibold truncate select-all">{id}</span>
              </div>

              <button
                onClick={() => copyItem(`item-${index}`, id)}
                className="p-1.5 rounded-lg bg-background-elevated hover:bg-background-secondary text-text-muted hover:text-text-primary border border-border transition-colors shrink-0"
                title="Copy Identifier"
              >
                {copiedKey === `item-${index}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
