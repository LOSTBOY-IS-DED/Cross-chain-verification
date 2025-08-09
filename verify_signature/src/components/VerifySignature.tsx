import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { CrossChain } from "../../cross_chain"; // ✅ type-only import
import { PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";
import idl from "../../idl.json"; // Your IDL

const programID = new PublicKey(idl.address);

export default function VerifySignature() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [message, setMessage] = useState("");
  const [signatureR, setSignatureR] = useState("");
  const [signatureS, setSignatureS] = useState("");
  const [recoveryId, setRecoveryId] = useState<number>(0);
  const [result, setResult] = useState("");

  const verifySignature = async (): Promise<void> => {
    if (!wallet) {
      console.warn("Wallet not connected");
      setResult("Wallet not connected");
      return;
    }

    try {
      const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });

      const program = new anchor.Program<CrossChain>(
        idl as anchor.Idl,
        programID,
        provider
      );

      const [verificationAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("verification"), provider.wallet.publicKey.toBuffer()],
        programID
      );

      const parseByteArray = (input: string): Uint8Array =>
        new Uint8Array(
          input
            .replace(/\[|\]/g, "") // ✅ no-useless-escape fixed
            .split(",")
            .map((n) => Number.parseInt(n.trim(), 10))
        );

      const sigRArray = parseByteArray(signatureR);
      const sigSArray = parseByteArray(signatureS);

      if (sigRArray.length !== 32 || sigSArray.length !== 32) {
        setResult("❌ Signature R and S must each be 32 bytes");
        return;
      }

      await program.methods
        .verifySignature(message, Array.from(sigRArray), Array.from(sigSArray), recoveryId)
        .accounts({
          user: provider.wallet.publicKey,
          verificationAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const accountData = await program.account.verificationData.fetch(verificationAccount);

      const recoveredPubkeyHex =
        "0x" +
        Array.from(accountData.signerPubkey)
          .map((b: number) => b.toString(16).padStart(2, "0"))
          .join("");

      const pubkeyHash = ethers.keccak256(recoveredPubkeyHex);
      const recoveredAddress = "0x" + pubkeyHash.slice(-40);

      setResult(
        `✅ Verified!\nMessage: ${accountData.message}\nRecovered PubKey: ${recoveredPubkeyHex}\nRecovered ETH Address: ${recoveredAddress}`
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ Error caught:", errorMessage);
      setResult(`❌ Error: ${errorMessage}`);
    }
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        border: "1px solid white",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h2>Verify Ethereum Signature</h2>
      <input placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <input
        placeholder="Signature R (comma-separated bytes)"
        value={signatureR}
        onChange={(e) => setSignatureR(e.target.value)}
      />
      <input
        placeholder="Signature S (comma-separated bytes)"
        value={signatureS}
        onChange={(e) => setSignatureS(e.target.value)}
      />
      <input
        type="number"
        placeholder="Recovery ID"
        value={recoveryId}
        onChange={(e) => setRecoveryId(Number(e.target.value))}
      />
      <button onClick={verifySignature}>Verify</button>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>{result}</pre>
    </div>
  );
}
