use anchor_lang::{
    prelude::*,
    solana_program::{
        program::{invoke, invoke_signed},
        program_pack::Pack,
        system_instruction, system_program,
    },
    AnchorDeserialize, AnchorSerialize,
};
use anchor_spl::token::accessor::mint;
use anchor_spl::token::{Mint, Token};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
pub const PREFIX: &str = "collection";
pub const MINT: &str = "mint";
pub const CONFIG: &str = "config";

#[program]
pub mod mpl_collections {
    use super::*;

    pub fn create<'info>(
        ctx: Context<'_, '_, '_, 'info, Create<'info>>,
        collection_instance_bump: u8,
        info: CreateCollectionConfiguration,
    ) -> ProgramResult {
        msg!("Create Collection");
        let collection_config = &mut ctx.accounts.collection;
        collection_config.key = AccountKey::CollectionV1;
        collection_config.uuid = info.uuid;
        collection_config.name = info.name;
        collection_config.uri = info.config_json_uri;
        collection_config.update_authority = ctx.accounts.authority.key();
        msg!(
            "Created Collection with UUID: {} and name {}",
            collection_config.uuid,
            collection_config.name
        );
        return Ok(());
    }

    pub fn add<'info>(
  
    ) -> ProgramResult {
       // Ensure 
    }
}

#[account]
pub struct CollectionV1 {
    key: AccountKey,
    name: String,
    uuid: String,
    update_authority: Pubkey,
    uri: String,
    size: u32,
}

#[account]
pub struct CollectionLinkV1 {
    key: AccountKey,
    uuid: String,
    mint: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct CreateCollectionConfiguration {
    pub name: String,
    pub uuid: String,
    pub config_json_uri: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct AddToCollection {
    pub mint: Pubkey,
}

#[derive(Accounts)]
#[instruction(collection_mint_bump: u8, collection_instance_bump: u8, info: CreateCollectionConfiguration)]
pub struct Create<'info> {
    authority: Signer<'info>,
    #[account(mut)]
    payer: Signer<'info>,
    #[account(init, seeds=[PREFIX.as_bytes(), id().as_ref(),  info.uuid.as_bytes()],
    payer=payer,
    bump=collection_instance_bump)]
    collection: Account<'info, CollectionV1>,
    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
    clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
#[instruction(collection_link_bump: u8, collection_instance_bump, info: AddToCollection)]
pub struct Add<'info> {
    mint_metadata_update_authority: Signer<'info>,
    collection_update_authority: Signer<'info>,
    #[account(mut)]
    payer: Signer<'info>,
    #[account(mut, seeds=[PREFIX.as_bytes(), collection_mint.key().as_ref(), CONFIG.as_bytes(), info.uuid.as_bytes()], bump=collection_instance_bump)]
    collection: Account<'info, CollectionV1>,
    #[account(init, seeds=[PREFIX.as_bytes(), collection_mint.key().as_ref(), LINK.as_bytes(), info.uuid.as_bytes()],
    payer=payer,
    bump=collection_instance_bump)]
    collection_mint: Account<'info, Mint>,
    collection_link: Account<'info, CollectionLinkV1>,
    #[account(address = mpl_token_metadata::id())]
    token_metadata_program: UncheckedAccount<'info>,
    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
    clock: Sysvar<'info, Clock>,
}
#[derive(Clone, Debug, AnchorSerialize, AnchorDeserialize)]
enum AccountKey {
    CollectionV1,
    CollectionLinkV1,
}
