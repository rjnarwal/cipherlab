export type CryptoStudioTab = 'hash' | 'hmac' | 'symmetric' | 'uuid' | 'encoder' | 'password';

export interface HashResult {
  algorithm: string;
  name: string;
  hex: string;
  base64: string;
  bits: number;
}

export interface HmacResult {
  algorithm: string;
  hex: string;
  base64: string;
  timeMs: number;
}

export interface SymmetricConfig {
  algorithm: 'AES-GCM' | 'AES-CBC';
  keySize: 128 | 192 | 256;
  passphrase: string;
  iv?: string;
  salt?: string;
}

export interface SymmetricEncryptedPayload {
  algorithm: string;
  ciphertextBase64: string;
  ciphertextHex: string;
  ivHex: string;
  saltHex: string;
  tagHex?: string;
  fullBundleJson: string;
}

export interface UUIDConfig {
  type: 'v4' | 'v7' | 'ulid' | 'nanoid';
  quantity: number;
  uppercase: boolean;
  hyphens: boolean;
}

export interface EncodingItem {
  id: string;
  label: string;
  encodedValue: string;
  error?: string;
}

export interface PasswordConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordStrength {
  score: number; // 0-100
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Unbreakable';
  entropyBits: number;
  crackTime: string;
}
