// Polyfill for Buffer (needed for browser)
import { Buffer } from "buffer";
window.Buffer = Buffer;

import { createRoot } from "react-dom/client";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Styles
import "@solana/wallet-adapter-react-ui/styles.css";
import "./index.css";

import App from "./App";

// Just use standard wallet auto-detection (Phantom, Solflare, etc.)
const endpoint = clusterApiUrl("devnet");

createRoot(document.getElementById("root")!).render(
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={[]} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);
