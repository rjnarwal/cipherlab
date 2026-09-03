import React, { useState, useEffect } from 'react';
import { computeHmac, bufferToHex } from '../services/cryptoService';
import { HmacResult } from '../types';
import { KeyRound, Copy, Check, Sparkles, RefreshCw, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const HmacStudio: React.FC = () => {
  const [message, setMessage] = useState<string>('{"user":"rajesh","role":"admin","scope":"write"}');
  const [secretKey, setSecretKey] = useState<string>('c982b1f893a04e28bf61498b31a89c20');
  const [algorithm, setAlgorithm] = useState<'SHA-256' | 'SHA-512' | 'SHA-384'>('SHA-256');
  const [hmacResult, setHmacResult] = useState<HmacResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [verifySignatureInput, setVerifySignatureInput] = useState<string>('');

  useEffect(() => {
    let isCancelled = false;
    computeHmac(algorithm, secretKey, message).then((res) => {
      if (!isCancelled) setHmacResult(res);
    });
    return () => {
      isCancelled = true;
    };
  }, [algorithm, secretKey, message]);

  const generateRandomKey = () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    setSecretKey(bufferToHex(bytes));
  };

  const copyResult = async (val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const isMatchValid =
    verifySignatureInput.trim().length > 0 &&
    hmacResult &&
    (verifySignatureInput.trim().toLowerCase() === hmacResult.hex.toLowerCase() ||
      verifySignatureInput.trim() === hmacResult.base64);

  return (
    <div className="space-y-6">
      {/* 2-Column Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Payload Message */}
        <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Payload / Data Message
            </span>
            <span className="text-xs text-text-muted font-mono">{message.length} chars</span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message to generate keyed HMAC signature..."
            className="w-full h-32 bg-background-tertiary border border-border rounded-xl p-3 font-mono text-xs text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Secret Key & Algorithm Selector */}
        <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              HMAC Secret Key & Algorithm
            </span>

            <button
              onClick={generateRandomKey}
              className="text-xs text-accent hover:underline flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Random 256-bit Key</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">Secret Key:</label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret key string or hex token..."
              className="w-full bg-background-tertiary border border-border rounded-xl px-3 py-2 font-mono text-xs text-text-primary focus:outline-none focus:border-accent"
              spellCheck={false}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">Hash Algorithm:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['SHA-256', 'SHA-384', 'SHA-512'] as const).map((alg) => (
                <button
                  key={alg}
                  onClick={() => setAlgorithm(alg)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                    algorithm === alg
                      ? 'bg-accent text-white shadow-md shadow-accent/20'
                      : 'bg-background-tertiary text-text-secondary hover:text-text-primary border border-border'
                  }`}
                >
                  {alg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Signature Card */}
      {hmacResult && (
        <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-sm text-text-primary">
                {hmacResult.algorithm} Signature Output
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {hmacResult.timeMs} ms
              </span>
            </div>

            <button
              onClick={() => copyResult(hmacResult.hex)}
              className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20 flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Hex'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                Hex Signature:
              </div>
              <div className="p-3 rounded-xl bg-background-tertiary border border-border font-mono text-xs text-text-primary break-all select-all">
                {hmacResult.hex}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">
                Base64 Signature:
              </div>
              <div className="p-3 rounded-xl bg-background-tertiary border border-border font-mono text-xs text-text-primary break-all select-all">
                {hmacResult.base64}
              </div>
            </div>
          </div>

          {/* Signature Verification Tool */}
          <div className="pt-3 border-t border-border/70 space-y-2">
            <label className="text-xs font-semibold text-text-secondary flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Verify Expected Signature:</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={verifySignatureInput}
                onChange={(e) => setVerifySignatureInput(e.target.value)}
                placeholder="Paste signature to verify match with computed HMAC..."
                className="flex-1 bg-background-tertiary border border-border rounded-xl px-3 py-2 font-mono text-xs text-text-primary focus:outline-none focus:border-accent"
              />
              {verifySignatureInput.trim() && (
                <div
                  className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 shrink-0 ${
                    isMatchValid
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/15 border-red-500/30 text-red-400'
                  }`}
                >
                  {isMatchValid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Signature Valid</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Mismatch</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
