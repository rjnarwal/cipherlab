import {
  HashResult,
  HmacResult,
  SymmetricConfig,
  SymmetricEncryptedPayload,
  UUIDConfig,
  EncodingItem,
  PasswordConfig,
  PasswordStrength,
} from '../types';

// ==================== HELPER UTILITIES ====================

export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBuffer(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(Math.floor(cleanHex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ==================== HASHING ENGINE ====================

// Pure JS MD5 (RFC 1321) for client-side legacy hashing
function md5(input: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function add32(a: number, b: number) {
    return (a + b) & 0xffffffff;
  }

  const n = input.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i: number;
  for (i = 64; i <= input.length; i += 64) {
    md5cycle(state, md5blk(input.substring(i - 64, i)));
  }
  const tail = input.substring(i - 64);
  const tailArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let j = 0; j < tail.length; j++) {
    tailArr[j >> 2] |= tail.charCodeAt(j) << ((j % 4) << 3);
  }
  tailArr[tail.length >> 2] |= 0x80 << ((tail.length % 4) << 3);
  if (tail.length > 55) {
    md5cycle(state, tailArr);
    for (let k = 0; k < 16; k++) tailArr[k] = 0;
  }
  tailArr[14] = n * 8;
  md5cycle(state, tailArr);

  function md5blk(s: string) {
    const md5blks: number[] = [];
    for (let k = 0; k < 64; k += 4) {
      md5blks[k >> 2] =
        s.charCodeAt(k) +
        (s.charCodeAt(k + 1) << 8) +
        (s.charCodeAt(k + 2) << 16) +
        (s.charCodeAt(k + 3) << 24);
    }
    return md5blks;
  }

  return state.map((val) => {
    let hexStr = '';
    for (let j = 0; j < 4; j++) {
      hexStr += ((val >> (j * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return hexStr;
  }).join('');
}

// CRC32 Checksum
function crc32(str: string): string {
  let crc = 0 ^ -1;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc ^ (code >> j)) & 1 ? 0xedb88320 : 0);
    }
  }
  return ((crc ^ -1) >>> 0).toString(16).padStart(8, '0');
}

export async function computeAllHashes(plaintext: string): Promise<HashResult[]> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const results: HashResult[] = [];

  // SHA-256
  const sha256Buf = await crypto.subtle.digest('SHA-256', data);
  results.push({
    algorithm: 'SHA-256',
    name: 'Secure Hash Algorithm 256-bit',
    hex: bufferToHex(sha256Buf),
    base64: bufferToBase64(sha256Buf),
    bits: 256,
  });

  // SHA-512
  const sha512Buf = await crypto.subtle.digest('SHA-512', data);
  results.push({
    algorithm: 'SHA-512',
    name: 'Secure Hash Algorithm 512-bit',
    hex: bufferToHex(sha512Buf),
    base64: bufferToBase64(sha512Buf),
    bits: 512,
  });

  // SHA-384
  const sha384Buf = await crypto.subtle.digest('SHA-384', data);
  results.push({
    algorithm: 'SHA-384',
    name: 'Secure Hash Algorithm 384-bit',
    hex: bufferToHex(sha384Buf),
    base64: bufferToBase64(sha384Buf),
    bits: 384,
  });

  // SHA-1
  const sha1Buf = await crypto.subtle.digest('SHA-1', data);
  results.push({
    algorithm: 'SHA-1',
    name: 'Secure Hash Algorithm 1 (Legacy)',
    hex: bufferToHex(sha1Buf),
    base64: bufferToBase64(sha1Buf),
    bits: 160,
  });

  // MD5
  const md5Hex = md5(plaintext);
  const md5Buf = hexToBuffer(md5Hex);
  results.push({
    algorithm: 'MD5',
    name: 'Message Digest 5 (RFC 1321)',
    hex: md5Hex,
    base64: bufferToBase64(md5Buf),
    bits: 128,
  });

  // CRC-32
  const crc32Hex = crc32(plaintext);
  results.push({
    algorithm: 'CRC-32',
    name: 'Cyclic Redundancy Check 32-bit',
    hex: crc32Hex,
    base64: bufferToBase64(hexToBuffer(crc32Hex)),
    bits: 32,
  });

  return results;
}

// ==================== HMAC ENGINE ====================

export async function computeHmac(
  algorithm: 'SHA-256' | 'SHA-512' | 'SHA-384',
  keyText: string,
  message: string
): Promise<HmacResult> {
  const startTime = performance.now();
  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyText);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: algorithm } },
    false,
    ['sign']
  );

  const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const endTime = performance.now();

  return {
    algorithm: `HMAC-${algorithm}`,
    hex: bufferToHex(sigBuf),
    base64: bufferToBase64(sigBuf),
    timeMs: parseFloat((endTime - startTime).toFixed(2)),
  };
}

// ==================== SYMMETRIC ENCRYPTION (AES-GCM) ====================

export async function encryptSymmetric(
  plaintext: string,
  config: SymmetricConfig
): Promise<SymmetricEncryptedPayload> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  // Derive key via PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(config.passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: config.algorithm, length: config.keySize },
    false,
    ['encrypt', 'decrypt']
  );

  const cipherBuf = await crypto.subtle.encrypt(
    {
      name: config.algorithm,
      iv,
    },
    aesKey,
    encoder.encode(plaintext)
  );

  const ciphertextBase64 = bufferToBase64(cipherBuf);
  const ciphertextHex = bufferToHex(cipherBuf);
  const ivHex = bufferToHex(iv);
  const saltHex = bufferToHex(salt);

  const bundle = {
    alg: config.algorithm,
    keySize: config.keySize,
    salt: saltHex,
    iv: ivHex,
    ciphertext: ciphertextBase64,
  };

  return {
    algorithm: `${config.algorithm}-${config.keySize}`,
    ciphertextBase64,
    ciphertextHex,
    ivHex,
    saltHex,
    fullBundleJson: JSON.stringify(bundle, null, 2),
  };
}

export async function decryptSymmetric(
  ciphertextBase64: string,
  ivHex: string,
  saltHex: string,
  passphrase: string,
  algorithm: 'AES-GCM' | 'AES-CBC' = 'AES-GCM',
  keySize: 128 | 192 | 256 = 256
): Promise<{ plaintext: string; error?: string }> {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const salt = hexToBuffer(saltHex);
    const iv = hexToBuffer(ivHex);
    const cipherBytes = base64ToBuffer(ciphertextBase64);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const aesKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: algorithm, length: keySize },
      false,
      ['decrypt']
    );

    const decryptedBuf = await crypto.subtle.decrypt(
      {
        name: algorithm,
        iv: iv as BufferSource,
      },
      aesKey,
      cipherBytes as BufferSource
    );

    return { plaintext: decoder.decode(decryptedBuf) };
  } catch (err: any) {
    return { plaintext: '', error: 'Decryption failed: Invalid passphrase, IV, or corrupted ciphertext' };
  }
}

// ==================== UUID & ULID GENERATOR ====================

// Standard UUID v7 Generator (RFC 9562)
export function generateUUIDv7(): string {
  const timestamp = Date.now();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // 48-bit timestamp
  bytes[0] = (timestamp >> 40) & 0xff;
  bytes[1] = (timestamp >> 32) & 0xff;
  bytes[2] = (timestamp >> 24) & 0xff;
  bytes[3] = (timestamp >> 16) & 0xff;
  bytes[4] = (timestamp >> 8) & 0xff;
  bytes[5] = timestamp & 0xff;

  // Version 7 (0b0111)
  bytes[6] = 0x70 | (bytes[6] & 0x0f);
  // Variant 1 (0b10)
  bytes[8] = 0x80 | (bytes[8] & 0x3f);

  const hex = bufferToHex(bytes);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ULID Generator (Crockford Base32)
const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export function generateULID(): string {
  const time = Date.now();
  let timeStr = '';
  let t = time;
  for (let i = 9; i >= 0; i--) {
    timeStr = CROCKFORD_ALPHABET[t % 32] + timeStr;
    t = Math.floor(t / 32);
  }

  const randBytes = new Uint8Array(10);
  crypto.getRandomValues(randBytes);
  let randStr = '';
  for (let i = 0; i < 16; i++) {
    const idx = Math.floor((randBytes[i % 10] + i * 31) % 32);
    randStr += CROCKFORD_ALPHABET[idx];
  }

  return (timeStr + randStr).slice(0, 26);
}

// NanoID Generator
export function generateNanoID(size = 21): string {
  const alphabet = 'useandom-26T1983_40STAkjlNumberedLettersPagesOfRegex';
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  let id = '';
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}

export function generateUUIDBatch(config: UUIDConfig): string[] {
  const list: string[] = [];
  for (let i = 0; i < config.quantity; i++) {
    let id = '';
    if (config.type === 'v4') {
      id = crypto.randomUUID();
    } else if (config.type === 'v7') {
      id = generateUUIDv7();
    } else if (config.type === 'ulid') {
      id = generateULID();
    } else if (config.type === 'nanoid') {
      id = generateNanoID();
    }

    if (!config.hyphens) {
      id = id.replace(/-/g, '');
    }
    if (config.uppercase) {
      id = id.toUpperCase();
    } else {
      id = id.toLowerCase();
    }

    list.push(id);
  }
  return list;
}

// ==================== MULTI-FORMAT ENCODER / DECODER ====================

export function convertEncodings(input: string): EncodingItem[] {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);

  // Base64 & Base64URL
  let b64 = '';
  let b64url = '';
  try {
    b64 = bufferToBase64(bytes);
    b64url = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e: any) {
    b64 = `Error: ${e.message}`;
  }

  // Hexadecimal
  const hex = bufferToHex(bytes);

  // Binary (0101...)
  const binary = Array.from(bytes)
    .map((b) => b.toString(2).padStart(8, '0'))
    .join(' ');

  // URL Encode
  const urlEncoded = encodeURIComponent(input);

  // HTML Entities
  const htmlEntities = input.replace(/[\u00A0-\u9999<>&]/gim, (i) => `&#${i.charCodeAt(0)};`);

  // ROT13
  const rot13 = input.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });

  return [
    { id: 'base64', label: 'Base64 Standard', encodedValue: b64 },
    { id: 'base64url', label: 'Base64URL (Safe for JWT & URLs)', encodedValue: b64url },
    { id: 'hex', label: 'Hexadecimal (Bytes)', encodedValue: hex },
    { id: 'binary', label: 'Binary (8-bit Octets)', encodedValue: binary },
    { id: 'url', label: 'URL / Percent Encoded', encodedValue: urlEncoded },
    { id: 'html', label: 'HTML Character Entities', encodedValue: htmlEntities },
    { id: 'rot13', label: 'ROT13 Obfuscation', encodedValue: rot13 },
  ];
}

// ==================== PASSWORD & ENTROPY GENERATOR ====================

export function generatePassword(config: PasswordConfig): string {
  let chars = '';
  if (config.includeUppercase) chars += config.excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (config.includeLowercase) chars += config.excludeAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  if (config.includeNumbers) chars += config.excludeAmbiguous ? '23456789' : '0123456789';
  if (config.includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  const randomBytes = new Uint8Array(config.length);
  crypto.getRandomValues(randomBytes);

  let result = '';
  for (let i = 0; i < config.length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }

  return result;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: 'Very Weak', entropyBits: 0, crackTime: '0 seconds' };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const entropy = Math.round(password.length * Math.log2(Math.max(poolSize, 2)));

  let label: PasswordStrength['label'] = 'Very Weak';
  let score = 10;
  let crackTime = 'Instant';

  if (entropy > 80) {
    label = 'Unbreakable';
    score = 100;
    crackTime = '100+ trillion years';
  } else if (entropy > 60) {
    label = 'Strong';
    score = 85;
    crackTime = 'Centuries';
  } else if (entropy > 40) {
    label = 'Fair';
    score = 55;
    crackTime = 'Several months';
  } else if (entropy > 25) {
    label = 'Weak';
    score = 30;
    crackTime = 'A few hours';
  }

  return {
    score,
    label,
    entropyBits: entropy,
    crackTime,
  };
}
