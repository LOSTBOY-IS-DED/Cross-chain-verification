use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct VerificationData {
    #[max_len(50)]
    pub message: String,
    pub signer_pubkey: [u8; 64],
    pub is_verified: bool,
    pub timestamp: i64,
}
