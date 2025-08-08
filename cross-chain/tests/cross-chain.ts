import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CrossChain } from "../target/types/cross_chain";
import { Keypair } from "@solana/web3.js";
import { expect } from "chai";
import { ethers } from "ethers";

describe("cross-chain", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.crossChain as Program<CrossChain>;

  const message = "anchorpoint"
  const signatureR = [175, 21, 149, 53, 97, 126, 227, 198, 56, 245, 205, 80, 103, 253, 128, 254, 140, 221, 37, 89, 14, 20, 56, 26, 98, 229, 121, 50, 121, 68, 131, 8]
  const signatureS = [72, 105, 135, 146, 107, 160, 82, 160, 228, 138, 99, 38, 116, 28, 26, 130, 88, 12, 25, 188, 8, 14, 134, 213, 113, 190, 144, 215, 251, 207, 130, 255]
  const recoveryId = 1

  it("Verifies Ethereum signature on Solana", async () => {
    const verificationAccount = Keypair.generate()

    console.log("Message:", message)
    console.log(
      "Verification account:",
      verificationAccount.publicKey.toString()
    )

    const tx = await program.methods
      .verifySignature(message, signatureR, signatureS, recoveryId)
      .accounts({
        verificationAccount: verificationAccount.publicKey,
        user: provider.publicKey,
      })
      .signers([verificationAccount])
      .rpc()

    console.log("Verification transaction signature:", tx)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const accountData = await program.account.verificationData.fetch(
      verificationAccount.publicKey
    )

    console.log("Stored message:", accountData.message)
    console.log("Is verified:", accountData.isVerified)
    console.log(
      "Recovered pubkey (bytes):",
      Array.from(accountData.signerPubkey)
    )

    const recoveredPubkeyBytes = Array.from(accountData.signerPubkey)
    const recoveredPubkeyHex =
      "0x" +
      recoveredPubkeyBytes.map((b) => b.toString(16).padStart(2, "0")).join("")

    const pubkeyHash = ethers.keccak256(recoveredPubkeyHex)
    const recoveredAddress = "0x" + pubkeyHash.slice(-40)

    console.log("Recovered public key (hex):", recoveredPubkeyHex)
    console.log("Public key hash (Keccak-256):", pubkeyHash)
    console.log("Recovered Ethereum address:", recoveredAddress)

    expect(accountData.message).to.equal(message)
    expect(accountData.isVerified).to.be.true
    expect(accountData.signerPubkey).to.not.be.null
  })

  it("Gets verification data", async () => {
    const verificationAccount = Keypair.generate()

    await program.methods
      .verifySignature(message, signatureR, signatureS, recoveryId)
      .accounts({
        verificationAccount: verificationAccount.publicKey,
        user: provider.publicKey,
      })
      .signers([verificationAccount])
      .rpc()

    await program.methods
      .getVerificationData()
      .accounts({
        verificationAccount: verificationAccount.publicKey,
      })
      .rpc()

    console.log("Successfully retrieved verification data")
  })
});
