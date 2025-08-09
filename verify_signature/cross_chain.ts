/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/cross_chain.json`.
 */
export type CrossChain = {
    "address": "5kGxzMrYSwfX1QAiW3xMqnaiYuos5pSakZpfz6YFGHAe",
    "metadata": {
      "name": "crossChain",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "getVerificationData",
        "discriminator": [
          241,
          227,
          224,
          89,
          40,
          119,
          116,
          249
        ],
        "accounts": [
          {
            "name": "verificationAccount"
          }
        ],
        "args": []
      },
      {
        "name": "verifySignature",
        "discriminator": [
          91,
          139,
          24,
          69,
          251,
          162,
          245,
          112
        ],
        "accounts": [
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "verificationAccount",
            "writable": true,
            "signer": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "message",
            "type": "string"
          },
          {
            "name": "signatureR",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "signatureS",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "recoveryId",
            "type": "u8"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "verificationData",
        "discriminator": [
          168,
          130,
          124,
          170,
          250,
          14,
          50,
          251
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "invalidSignature",
        "msg": "Invalid signature"
      }
    ],
    "types": [
      {
        "name": "verificationData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "message",
              "type": "string"
            },
            {
              "name": "signerPubkey",
              "type": {
                "array": [
                  "u8",
                  64
                ]
              }
            },
            {
              "name": "isVerified",
              "type": "bool"
            },
            {
              "name": "timestamp",
              "type": "i64"
            }
          ]
        }
      }
    ]
  };
  