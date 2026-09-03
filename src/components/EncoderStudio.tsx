import React, { useState } from 'react';
import { convertEncodings } from '../services/cryptoService';
import { Binary, Copy, Check, FileText, Sparkles } from 'lucide-react';

export const EncoderStudio: React.FC = () => {
  const [input, setInput] = useState<string>('Hello, World! 🔐 grassroot.digital');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const encodings = convertEncodings(input);

  const copyValue = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
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
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Source String (UTF-8 Input)
            </span>
          </div>
          <span className="text-xs text-text-muted font-mono">{input.length} chars</span>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste any text to convert to Base64, Hex, Binary, URL & HTML encodings..."
          className="w-full h-24 bg-background-tertiary border border-border rounded-xl p-3 font-mono text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent resize-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Multi-Format Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {encodings.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-background-secondary border border-border hover:border-cyan-500/40 transition-all space-y-2.5 shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs sm:text-sm text-text-primary">
                {item.label}
              </span>

              <button
                onClick={() => copyValue(item.id, item.encodedValue)}
                className="px-2.5 py-1 rounded-lg bg-background-tertiary hover:bg-background-elevated border border-border text-text-secondary hover:text-text-primary text-xs flex items-center space-x-1 transition-colors"
                title="Copy Value"
              >
                {copiedId === item.id ? (
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

            <div className="p-2.5 rounded-lg bg-background-tertiary border border-border/70 font-mono text-xs text-text-primary break-all leading-relaxed max-h-28 overflow-y-auto select-all">
              {item.encodedValue || '...'}
            </div>

            <div className="text-[11px] text-text-muted text-right font-mono">
              {item.encodedValue.length} characters
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
