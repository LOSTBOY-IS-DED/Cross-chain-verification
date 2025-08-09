import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import VerifySignature from "./components/VerifySignature";

export default function App() {
  const { connected, publicKey } = useWallet();

  return (
    <div style={{ padding: "2rem", color: "white", background: "#121212", minHeight: "100vh" }}>
      <h1>Cross-Chain Signature Verification 🔐</h1>
      <WalletMultiButton />

      {!connected ? (
        <p>Please connect your wallet to verify a signature.</p>
      ) : (
        <>
          <p>Wallet connected: {publicKey?.toBase58()}</p>
          <VerifySignature />
        </>
      )}
    </div>
  );
}
