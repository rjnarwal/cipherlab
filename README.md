# 🔐 CipherLab — Cryptographic Hashes, AES-256 & Encoding Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](https://opensource.org/licenses/MIT)
[![Live Web App](https://img.shields.io/badge/Web_App-cipherlab.grassroot.digital-ec4899.svg)](https://cipherlab.grassroot.digital)
[![Author](https://img.shields.io/badge/Author-Rajesh_Narwal-blue.svg)](https://grassroot.digital/#about)
[![GitHub](https://img.shields.io/badge/GitHub-rjnarwal-181717.svg?logo=github)](https://github.com/rjnarwal)

**CipherLab** is a 100% client-side cryptographic and encoding suite powered by the native W3C WebCrypto API (`window.crypto.subtle`).

---

## ✨ Features

- ⚡ **Instant Multi-Hash Engine**: Compute `SHA-256`, `SHA-512`, `SHA-384`, `SHA-1`, `MD5`, and `CRC32` simultaneously with Hex and Base64 outputs.
- 🔑 **HMAC Signatures & Verification**: Generate and verify `HMAC-SHA256`, `HMAC-SHA512`, and `HMAC-SHA384` message authentication codes with custom or random 256-bit secret keys.
- 🛡️ **AES-256 Symmetric Encryption**: Authenticated `AES-256-GCM` and `AES-256-CBC` encryption and decryption with PBKDF2 (100k iterations) key derivation.
- ⏱️ **UUID & High-Performance Identifiers**: Bulk generate `UUID v7` (Time-Ordered), `UUID v4` (Random), `ULID` (Sortable Base32), and `NanoID`.
- 🔄 **Multi-Format Converter**: Bidirectional conversion between Text, Base64, Base64URL, Hex, Binary, URL Percent-encoding, HTML Entities, and ROT13.
- 🎲 **Password & Token Studio**: Cryptographically secure random password generator with Shannon entropy bits score and crack time estimator.

---

## 🚀 Quick Start

```bash
git clone https://github.com/rjnarwal/cipherlab.git
cd cipherlab
npm install
npm run dev
```

---

## 📄 License

MIT License © 2026 [Rajesh Narwal](https://grassroot.digital/#about)
