#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;
use anchor_lang::solana_program::secp256k1_recover::secp256k1_recover;
use anchor_lang::solana_program::keccak;

use crate::error::ErrorCode;  // error code import
use crate::state::* ;    // verification data import


#[derive(Accounts)]
pub struct VerifySignature<'info> {
    #[account(mut)]
    pub user : Signer<'info>,
    #[account(
        init, 
        payer = user,
        space = 8 + VerificationData::INIT_SPACE
    )]
    pub verification_account: Account<'info, VerificationData>,
    pub system_program: Program<'info, System>,
}


impl<'info> VerifySignature<'info> {
    pub fn verify_signature(&mut self , message: String,
        signature_r: [u8; 32],
        signature_s: [u8; 32],
        recovery_id: u8) -> Result<()> {
        msg!("Starting verifying message : {}" , message);

        // Ethereum message prefixed here
        let eth_message = format!("\x19Ethereum Signed Message:\n{}{}", message.len(), message);
        let message_hash = keccak::hash(eth_message.as_bytes());

        msg!("Message hash: {:?}", message_hash.to_bytes());


        // combining the signature_r and signature_s into one 64 byte signature
        let mut signature = [0u8; 64];
            signature[0..32].copy_from_slice(&signature_r);
            signature[32..64].copy_from_slice(&signature_s);

            // recovered the public key
            let recovered_pubkey = secp256k1_recover(
                &message_hash.to_bytes(),
                recovery_id,
                &signature,
            ).map_err(|_| ErrorCode::InvalidSignature)?;
        
            let verification_account = &mut self.verification_account;

            // store verificaiton details
            verification_account.message = message;
            verification_account.signer_pubkey = recovered_pubkey.to_bytes();
            verification_account.is_verified = true;
            verification_account.timestamp = Clock::get()?.unix_timestamp;
            
            msg!("Signature verified successfully!");
            msg!("Recovered pubkey: {:?}", recovered_pubkey.to_bytes());
            
            Ok(())   
    
    }
}