import React, { useState } from 'react';
import { encryptSymmetric, decryptSymmetric } from '../services/cryptoService';
import { SymmetricConfig, SymmetricEncryptedPayload } from '../types';
import { Lock, Unlock, Copy, Check, ShieldCheck, Download, AlertCircle, Sparkles, Key } from 'lucide-react';

export const SymmetricStudio: React.FC = () => {
  const [subTab, setSubTab] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Encryption State
  const [plaintext, setPlaintext] = useState<string>('Confidential enterprise secret payload: API_KEY_98421_SECURE');
  const [passphrase, setPassphrase] = useState<string>('MySecretMasterPassword2026!');
  const [algorithm, setAlgorithm] = useState<'AES-GCM' | 'AES-CBC'>('AES-GCM');
  const [keySize, setKeySize] = useState<128 | 192 | 256>(256);
  const [encryptedPayload, setEncryptedPayload] = useState<SymmetricEncryptedPayload | null>(null);
  const [encryptError, setEncryptError] = useState<string | null>(null);

  // Decryption State
  const [decryptJsonBundle, setDecryptJsonBundle] = useState<string>('');
  const [decryptPassphrase, setDecryptPassphrase] = useState<string>('');
  const [decryptedPlaintext, setDecryptedPlaintext] = useState<string | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleEncrypt = async () => {
    if (!plaintext || !passphrase) {
      setEncryptError('Please enter both plaintext and a passphrase.');
      return;
    }
    setEncryptError(null);
    try {
      const config: SymmetricConfig = {
        algorithm,
        keySize,
        passphrase,
      };
      const result = await encryptSymmetric(plaintext, config);
      setEncryptedPayload(result);
    } catch (err: any) {
      setEncryptError(err.message || 'Encryption failed');
    }
  };

  const handleDecrypt = async () => {
    if (!decryptJsonBundle || !decryptPassphrase) {
      setDecryptError('Please enter both the encrypted JSON bundle and passphrase.');
      return;
    }
    setDecryptError(null);
    setDecryptedPlaintext(null);

    try {
      const parsed = JSON.parse(decryptJsonBundle);
      const res = await decryptSymmetric(
        parsed.ciphertext,
        parsed.iv,
        parsed.salt,
        decryptPassphrase,
        parsed.alg || 'AES-GCM',
        parsed.keySize || 256
      );

      if (res.error) {
        setDecryptError(res.error);
      } else {
        setDecryptedPlaintext(res.plaintext);
      }
    } catch (err: any) {
      setDecryptError('Invalid JSON format or corrupted payload. Ensure the envelope contains ciphertext, iv, and salt.');
    }
  };

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center space-x-2 p-1 bg-background-secondary border border-border rounded-xl w-fit">
        <button
          onClick={() => setSubTab('encrypt')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            subTab === 'encrypt'
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypt Payload</span>
        </button>

        <button
          onClick={() => setSubTab('decrypt')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            subTab === 'decrypt'
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>Decrypt Payload</span>
        </button>
      </div>

      {/* Encrypt View */}
      {subTab === 'encrypt' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Plaintext Input */}
            <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Plaintext (Data to Encrypt)
                </span>
                <span className="text-xs text-text-muted font-mono">{plaintext.length} chars</span>
              </div>
              <textarea
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter confidential text or secrets to encrypt..."
                className="w-full h-36 bg-background-tertiary border border-border rounded-xl p-3 font-mono text-xs text-text-primary focus:outline-none focus:border-accent resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Passphrase & Algorithm Config */}
            <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                Security & Key Derivation (PBKDF2 100k)
              </span>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Encryption Passphrase:</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter strong encryption password..."
                    className="w-full bg-background-tertiary border border-border rounded-xl pl-9 pr-3 py-2 font-mono text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Algorithm:</label>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as any)}
                    className="w-full bg-background-tertiary border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none"
                  >
                    <option value="AES-GCM">AES-GCM (Authenticated)</option>
                    <option value="AES-CBC">AES-CBC (Standard)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary">Key Size:</label>
                  <select
                    value={keySize}
                    onChange={(e) => setKeySize(parseInt(e.target.value, 10) as any)}
                    className="w-full bg-background-tertiary border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none"
                  >
                    <option value={256}>256-bit (Military Grade)</option>
                    <option value={192}>192-bit</option>
                    <option value={128}>128-bit</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleEncrypt}
                className="w-full py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-lg shadow-accent/20 hover:opacity-95 flex items-center justify-center space-x-2 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Encrypt with WebCrypto</span>
              </button>
            </div>
          </div>

          {encryptError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{encryptError}</span>
            </div>
          )}

          {/* Encrypted Result Card */}
          {encryptedPayload && (
            <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-heading font-bold text-sm text-text-primary">
                    Encrypted Bundle ({encryptedPayload.algorithm})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyText('bundle', encryptedPayload.fullBundleJson)}
                    className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20 flex items-center space-x-1.5"
                  >
                    {copiedKey === 'bundle' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy JSON Bundle</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background-tertiary border border-border font-mono text-xs text-text-primary whitespace-pre overflow-x-auto leading-relaxed select-all">
                {encryptedPayload.fullBundleJson}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decrypt View */}
      {subTab === 'decrypt' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* JSON Bundle Input */}
            <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Paste Encrypted JSON Envelope
                </span>
                <span className="text-xs text-text-muted font-mono">{decryptJsonBundle.length} chars</span>
              </div>
              <textarea
                value={decryptJsonBundle}
                onChange={(e) => setDecryptJsonBundle(e.target.value)}
                placeholder='Paste the JSON envelope containing { "ciphertext": "...", "iv": "...", "salt": "..." }...'
                className="w-full h-36 bg-background-tertiary border border-border rounded-xl p-3 font-mono text-xs text-text-primary focus:outline-none focus:border-accent resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Passphrase & Decrypt Trigger */}
            <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                Decryption Key Verification
              </span>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary">Decryption Passphrase:</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={decryptPassphrase}
                    onChange={(e) => setDecryptPassphrase(e.target.value)}
                    placeholder="Enter password used to encrypt the payload..."
                    className="w-full bg-background-tertiary border border-border rounded-xl pl-9 pr-3 py-2 font-mono text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <button
                onClick={handleDecrypt}
                className="w-full py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-lg shadow-accent/20 hover:opacity-95 flex items-center justify-center space-x-2 transition-all mt-6"
              >
                <Unlock className="w-4 h-4" />
                <span>Decrypt & Verify Authenticity</span>
              </button>
            </div>
          </div>

          {decryptError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{decryptError}</span>
            </div>
          )}

          {decryptedPlaintext !== null && (
            <div className="bg-background-secondary border border-border rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-heading font-bold text-sm text-text-primary">
                    Decrypted Plaintext (Verified Authenticated)
                  </span>
                </div>

                <button
                  onClick={() => copyText('decrypted', decryptedPlaintext)}
                  className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20 flex items-center space-x-1.5"
                >
                  {copiedKey === 'decrypted' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Plaintext</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-background-tertiary border border-border font-mono text-xs text-text-primary whitespace-pre-wrap break-words leading-relaxed select-all">
                {decryptedPlaintext}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
