use anchor_lang::prelude::*;

declare_id!("5kGxzMrYSwfX1QAiW3xMqnaiYuos5pSakZpfz6YFGHAe");

#[program]
pub mod cross_chain {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
