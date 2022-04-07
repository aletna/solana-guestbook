use anchor_lang::prelude::*;
use std::str::from_utf8;

declare_id!("316mG717QvYm3SVy93HpK7bYnKCiaTmvsm1buDTqYu9z");

#[program]
pub mod solana_wall {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, message: Vec<u8>, name: Vec<u8>) -> Result<()> {
       
        require!(
            name.len() <= 32,
            IncorrectNameLength
        );
        require!(
            message.len() <= 280,
            IncorrectMessageLength
        );

        ctx.accounts.wall_account.authority = *ctx.accounts.authority.key;

        // convert the array of bytes into a string slice
        let message_as_str = from_utf8(&message) 
            .map_err(|err| {
                msg!("Invalid UTF-8, from byte {}", err.valid_up_to());
                ProgramError::InvalidInstructionData
            })?;
        
        // message program log
        msg!(message_as_str); 
        
        ctx.accounts.wall_account.message = message;
        ctx.accounts.wall_account.name = name;

        Ok(())
    }
}

// fn print_message(new_message: Vec<u*>)

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = authority, 
        space = 8 // account discriminator
        + 32 // pubkey
        + 280 // data, max bytes 280 long
        + 32 // name, max bytes 32 long
    )]
    /// CHECK
    pub wall_account: Account<'info, WallAccount>,
    #[account(mut)]
    /// CHECK
    pub authority: Signer<'info>,
    /// CHECK
    pub system_program: Program<'info, System>,
}

#[account]
pub struct WallAccount {
    pub authority: Pubkey,
    pub message: Vec<u8>,
    pub name: Vec<u8>
}

#[error_code]
pub enum ErrorCode {
    #[msg("name can't be longer than 32 bytes.")]
    IncorrectNameLength,
    #[msg("message can't be longer than 280 bytes.")]
    IncorrectMessageLength,
}