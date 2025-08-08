use anchor_lang::prelude::*;

pub mod error;
pub mod instructions; // ✅ rename folder from instruction → instructions
pub mod state;

declare_id!("5kGxzMrYSwfX1QAiW3xMqnaiYuos5pSakZpfz6YFGHAe");

use instructions::*; // ✅ bring in our custom modules

#[program]
pub mod cross_chain {
    use super::*;

    pub fn get_verification_data(ctx: Context<GetVerficationData>) -> Result<()> {
        GetVerficationData::get_verification_data(&ctx.accounts)
    }

    pub fn verify_signature(
        ctx: Context<VerifySignature>,
        message: String,
        signature_r: [u8; 32],
        signature_s: [u8; 32],
        recovery_id: u8,
    ) -> Result<()> {
        ctx.accounts
            .verify_signature(message, signature_r, signature_s, recovery_id)
    }
}
