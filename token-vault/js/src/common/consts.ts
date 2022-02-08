import { PublicKey } from '@solana/web3.js';

const WRAPPED_SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
export const QUOTE_MINT = WRAPPED_SOL_MINT;

// TODO(thlorenz): shank parse out of Rust
export const VAULT_PREFIX = 'vault';
// TODO(thlorenz): solita we already have that just need to expose it somewhere
export const VAULT_PROGRAM_ID = 'vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn';

export const VAULT_PROGRAM_PUBLIC_KEY = new PublicKey(VAULT_PROGRAM_ID);
