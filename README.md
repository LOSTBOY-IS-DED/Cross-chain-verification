# Cross-Chain Signature Verification

A cross-chain verification system that allows a user to sign a message using their **Ethereum private key**, then later verify the signer’s **public key** on the **Solana blockchain**.  
This bridges authentication across chains, enabling trustless verification without centralized intermediaries.

---

## 🚀 How It Works

### **1. Message Signing (Ethereum)**
- The user connects their Ethereum wallet (e.g., MetaMask).
- They sign a message using their Ethereum private key.
- The signature is stored or shared for later verification.

### **2. Public Key Recovery**
- Using the signed message and signature, the public key is recovered off-chain.
- The recovered public key proves ownership of the Ethereum account.

### **3. Verification on Solana**
- The recovered public key is submitted to a Solana program.
- The Solana contract verifies that the provided public key matches the signed message, ensuring the signer is authentic.

---

## 🖥️ Tech Stack
- **Frontend:** React, Tailwind CSS
- **Ethereum Signing:** `ethers.js`
- **Cryptography:** ECDSA (secp256k1) for Ethereum signature recovery

---

## 📦 Installation

```bash
git clone https://github.com/LOSTBOY-IS-DED/Cross-chain-verification.git
cd sigBridge/frontend
pnpm install
pnpm dev
```
