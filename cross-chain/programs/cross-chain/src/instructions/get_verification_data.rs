use crate::state::*;
use anchor_lang::prelude::*; // verification data import

#[derive(Accounts)]
pub struct GetVerficationData<'info> {
    pub verification_account: Account<'info, VerificationData>,
}

impl<'info> GetVerficationData<'info> {
    pub fn get_verification_data(&self) -> Result<()> {
        let verification_account = &self.verification_account;
        msg!("Message: {:?}", verification_account.message);
        msg!("Signer Pubkey: {:?}", verification_account.signer_pubkey);
        msg!("Is Verified: {:?}", verification_account.is_verified);
        msg!("Timestamp: {:?}", verification_account.timestamp);

        Ok(())
    }
}
