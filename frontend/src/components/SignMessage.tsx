import { useEffect, useState } from "react"
import { ethers } from "ethers"

declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider & {
      isMetaMask?: boolean
      isPhantom?: boolean
    }
  }
}

const SignMessage = () => {
  const [walletConnected, setWalletConnected] = useState(false)
  const [ethereumAddress, setEthereumAddress] = useState<string>("")
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState<string>("")
  const [signatureR, setSignatureR] = useState<number[]>([])
  const [signatureS, setSignatureS] = useState<number[]>([])
  const [recoveryId, setRecoveryId] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (accounts.length > 0) {
          setWalletConnected(true)
          setEthereumAddress(accounts[0])
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setWalletConnected(true)
        setEthereumAddress(accounts[0])
      } catch (error) {
        console.error("Error connecting wallet:", error)
      }
    } else {
      alert("No Ethereum wallet found (MetaMask, Phantom, etc.)")
    }
  }

  const signMessage = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first.")
      return
    }

    if (!window.ethereum || !message.trim()) {
      alert("No wallet or message provided.")
      return
    }

    try {
      setLoading(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const signature = await signer.signMessage(message)

      setSignature(signature)

      const sigBytes = ethers.getBytes(signature)
      const r = Array.from(sigBytes.slice(0, 32)) as number[]
      const s = Array.from(sigBytes.slice(32, 64)) as number[]
      const v = sigBytes[64]
      const recovery_id = v - 27

      setSignatureR(r)
      setSignatureS(s)
      setRecoveryId(recovery_id)
    } catch (err) {
      console.error("Signing failed:", err)
      alert("Failed to sign message.")
    } finally {
      setLoading(false)
    }
  }

  return (
    // <div className="flex justify-center">
    //   <div className="my-20 w-full flex flex-col items-center">
    //     <h1 className="text-7xl text-white max-w-2xl text-center leading-tight tracking-tight font-bold">
    //       Trust Built Through{" "}
    //       <span className="bg-clip-text text-transparent bg-gradient-to-b from-lime to-blue">
    //         Signatures
    //       </span>
    //     </h1>

    //     <div className="max-w-3xl text-xl mx-auto text-neutral-500 text-center mt-10">
    //       <p className="selection:bg-neutral-700 selection:text-neutral-100">
    //         Trust Built Through Signatures emphasizes security, authenticity,
    //         and transparency. Every signature guarantees integrity, protecting
    //         data and relationships. It's a commitment to honesty, empowering
    //         users to verify and trust every interaction with confidence.
    //       </p>

    //       {!walletConnected ? (
    //         <button
    //           onClick={connectWallet}
    //           className="mt-8 px-6 py-2 rounded-lg border border-neutral-700 text-white hover:bg-neutral-700 transition"
    //         >
    //           Connect Wallet
    //         </button>
    //       ) : (
    //         <div className="mt-8 shadow-aceternity rounded-xl bg-neutral-800 backdrop:blur-3xl p-4">
    //           Wallet connected: <br />
    //           <span className="text-lime-400 font-mono break-all">
    //             {ethereumAddress}
    //           </span>
    //         </div>
    //       )}

    //       <div className="mt-8 w-full flex justify-center max-w-3xl">
    //         <input
    //           type="text"
    //           placeholder="Enter your message"
    //           value={message}
    //           onChange={(e) => setMessage(e.target.value)}
    //           className="border flex-1 border-neutral-700 mr-4 rounded-xl bg-transparent placeholder:text-neutral-500 text-white px-4 focus:border-neutral-200 focus:ring-0 outline-none p-2"
    //         />
    //         <button
    //           onClick={signMessage}
    //           disabled={loading || !walletConnected || !message.trim()}
    //           className={`relative py-2 px-4 border border-neutral-700 text-white cursor-pointer rounded-xl transition-all duration-300 ${
    //             loading
    //               ? "opacity-60 cursor-not-allowed"
    //               : "hover:scale-105 hover:shadow-lg hover:shadow-lime/30"
    //           }`}
    //         >
    //           {loading ? "Signing..." : "Sign Message"}
    //           <div className="absolute -bottom-px w-full h-px bg-gradient-to-r from-transparent via-lime to-transparent overflow-hidden inset-x-0"></div>
    //         </button>
    //       </div>

    //       {signature && (
    //         <div className="mt-12 text-left text-white w-full max-w-3xl space-y-4">
    //           {[
    //             { label: "Message", value: message, key: "msg" },
    //             { label: "Full Signature", value: signature, key: "sig" },
    //             {
    //               label: "Signature R",
    //               value: `[${signatureR.join(", ")}]`,
    //               key: "r",
    //             },
    //             {
    //               label: "Signature S",
    //               value: `[${signatureS.join(", ")}]`,
    //               key: "s",
    //             },
    //             {
    //               label: "Recovery ID",
    //               value: recoveryId.toString(),
    //               key: "recoveryId",
    //             },
    //           ].map(({ label, value, key }) => (
    //             <div
    //               key={key}
    //               className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 flex items-start justify-between"
    //             >
    //               <div className="flex-1 mr-4">
    //                 <p className="text-sm text-neutral-400 mb-1">{label}</p>
    //                 <p className="font-mono break-all">{value}</p>
    //               </div>
    //               <CopyButton content={value} />
    //             </div>
    //           ))}
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  
    <div className="flex flex-col justify-center min-h-screen px-4 sm:px-8 lg:px-16">
  <div className="flex flex-col items-center text-center">
    <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white max-w-3xl leading-tight tracking-tight font-bold">
      Trust Built Through{" "}
      <span className="bg-clip-text text-transparent bg-gradient-to-b from-lime to-blue">
        Signatures
      </span>
    </h1>

    <p className="max-w-2xl text-base sm:text-lg lg:text-xl text-neutral-500 mt-6 sm:mt-8 lg:mt-10 selection:bg-neutral-700 selection:text-neutral-100">
      Trust Built Through Signatures emphasizes security, authenticity, and transparency.
      Every signature guarantees integrity, protecting data and relationships. It's a
      commitment to honesty, empowering users to verify and trust every interaction
      with confidence.
    </p>

    {!walletConnected ? (
      <button
        onClick={connectWallet}
        className="mt-8 sm:mt-10 px-6 py-3 text-base sm:text-lg rounded-lg border border-neutral-700 text-white hover:bg-neutral-700 transition"
      >
        Connect Wallet
      </button>
    ) : (
      <div className="mt-8 sm:mt-10 shadow-aceternity rounded-xl bg-neutral-800 backdrop:blur-3xl p-4 sm:p-6">
        <p className="text-neutral-400 text-sm sm:text-base mb-2">Wallet connected:</p>
        <span className="text-lime-400 font-mono break-all text-sm sm:text-base">
          {ethereumAddress}
        </span>
      </div>
    )}

    {walletConnected && (
      <div className="mt-6 sm:mt-8 w-full flex flex-col sm:flex-row justify-center max-w-3xl gap-4 sm:gap-3">
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border flex-1 border-neutral-700 rounded-xl bg-transparent placeholder:text-neutral-500 text-white px-4 py-3 focus:border-neutral-200 focus:ring-0 outline-none text-sm sm:text-base"
        />
        <button
          onClick={signMessage}
          disabled={loading || !walletConnected || !message.trim()}
          className={`relative py-3 px-6 border border-neutral-700 text-white cursor-pointer rounded-xl transition-all duration-300 text-sm sm:text-base ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:scale-105 hover:shadow-lg hover:shadow-lime/30"
          }`}
        >
          {loading ? "Signing..." : "Sign Message"}
          <div className="absolute -bottom-px w-full h-px bg-gradient-to-r from-transparent via-lime to-transparent overflow-hidden inset-x-0"></div>
        </button>
      </div>
    )}
  </div>

  {signature && (
    <div className="mt-12 text-left text-white w-full max-w-3xl mx-auto space-y-4">
      {[
        { label: "Message", value: message, key: "msg" },
        { label: "Full Signature", value: signature, key: "sig" },
        {
          label: "Signature R",
          value: `[${signatureR.join(", ")}]`,
          key: "r",
        },
        {
          label: "Signature S",
          value: `[${signatureS.join(", ")}]`,
          key: "s",
        },
        {
          label: "Recovery ID",
          value: recoveryId.toString(),
          key: "recoveryId",
        },
      ].map(({ label, value, key }) => (
        <div
          key={key}
          className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
        >
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-neutral-400 mb-1">{label}</p>
            <p className="font-mono break-all text-xs sm:text-sm">{value}</p>
          </div>
          <CopyButton content={value} />
        </div>
      ))}
    </div>
  )}
</div>

  
  )
}

export default SignMessage

// ✅ Copy button component
const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error("Copy failed", error)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-sm px-3 py-1 border border-neutral-600 rounded-lg hover:bg-neutral-700 transition text-white"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}

