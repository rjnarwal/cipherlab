import React, { useState, useEffect } from 'react';
import { computeAllHashes } from '../services/cryptoService';
import { HashResult } from '../types';
import { Hash, Copy, Check, Sparkles, RefreshCw, FileText } from 'lucide-react';

export const HashStudio: React.FC = () => {
  const [plaintext, setPlaintext] = useState<string>('Grassroot Digital - Privacy First Developer Suite');
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [format, setFormat] = useState<'hex' | 'base64'>('hex');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    computeAllHashes(plaintext).then((res) => {
      if (!isCancelled) setHashes(res);
    });
    return () => {
      isCancelled = true;
    };
  }, [plaintext]);

  const copyHash = async (key: string, val: string) => {
    try {
      const textToCopy = uppercase ? val.toUpperCase() : val.toLowerCase();
      await navigator.clipboard.writeText(textToCopy);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Input String / Payload to Hash
            </span>
          </div>

          <span className="text-xs text-text-muted font-mono">
            {plaintext.length} chars • {new TextEncoder().encode(plaintext).length} bytes
          </span>
        </div>

        <textarea
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          placeholder="Enter text or paste raw payload to calculate cryptographic hashes in real time..."
          className="w-full h-28 bg-background-tertiary border border-border rounded-xl p-3.5 font-mono text-xs sm:text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent resize-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Hash Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background-secondary/60 border border-border p-3.5 rounded-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-text-secondary">Output Format:</span>
          <div className="flex items-center bg-background-tertiary border border-border rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setFormat('hex')}
              className={`px-3 py-1 rounded-md transition-all ${
                format === 'hex' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Hexadecimal
            </button>
            <button
              onClick={() => setFormat('base64')}
              className={`px-3 py-1 rounded-md transition-all ${
                format === 'base64' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Base64
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <label className="flex items-center space-x-1.5 cursor-pointer text-text-secondary select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded bg-background-tertiary border-border text-accent focus:ring-0"
            />
            <span>UPPERCASE Hex</span>
          </label>
        </div>
      </div>

      {/* Hashes List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hashes.map((item) => {
          const rawValue = format === 'hex' ? item.hex : item.base64;
          const displayValue = uppercase ? rawValue.toUpperCase() : rawValue.toLowerCase();

          return (
            <div
              key={item.algorithm}
              className="p-4 rounded-xl bg-background-secondary border border-border hover:border-pink-500/40 transition-all space-y-2.5 shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-heading font-bold text-sm text-text-primary">
                    {item.algorithm}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-background-tertiary border border-border text-text-muted">
                    {item.bits} bits
                  </span>
                </div>

                <button
                  onClick={() => copyHash(item.algorithm, displayValue)}
                  className="px-2.5 py-1 rounded-lg bg-background-tertiary hover:bg-background-elevated border border-border text-text-secondary hover:text-text-primary text-xs flex items-center space-x-1 transition-colors"
                  title="Copy Hash Value"
                >
                  {copiedKey === item.algorithm ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-background-tertiary border border-border/70 font-mono text-xs text-text-primary break-all leading-relaxed select-all">
                {displayValue || '...'}
              </div>

              <div className="text-[11px] text-text-muted flex items-center justify-between">
                <span>{item.name}</span>
                <span className="font-mono">{displayValue.length} chars</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
