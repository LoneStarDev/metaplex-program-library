import {
  AccountLayout as TokenAccountLayout,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Keypair, PublicKey, Signer, SystemProgram, TransactionInstruction } from '@solana/web3.js';

// -----------------
// Helpers from common/src/actions/action.ts adapted to return instructions + signers instead of mutating
// -----------------

// -----------------
// Init Mint Account
// -----------------
export function createMint(
  payer: PublicKey,
  mintRentExempt: number,
  decimals: number,
  owner: PublicKey,
  freezeAuthority: PublicKey,
): [TransactionInstruction[], Signer[], { mintAccount: PublicKey }] {
  const [createMintIx, createMintSigner, mintAccount] = createUninitializedMint(
    payer,
    mintRentExempt,
  );

  const initMintIx = Token.createInitMintInstruction(
    TOKEN_PROGRAM_ID,
    mintAccount,
    decimals,
    owner,
    freezeAuthority,
  );

  return [[createMintIx, initMintIx], [createMintSigner], { mintAccount }];
}

export function createUninitializedMint(
  payer: PublicKey,
  amount: number,
): [TransactionInstruction, Signer, PublicKey] {
  const mintAccount = Keypair.generate();
  const instruction = SystemProgram.createAccount({
    fromPubkey: payer,
    newAccountPubkey: mintAccount.publicKey,
    lamports: amount,
    space: MintLayout.span,
    programId: TOKEN_PROGRAM_ID,
  });

  return [instruction, mintAccount, mintAccount.publicKey];
}

// -----------------
// Init Token Account
// -----------------
export function createTokenAccount(
  payer: PublicKey,
  accountRentExempt: number,
  mint: PublicKey,
  owner: PublicKey,
): [TransactionInstruction[], Signer[], { tokenAccount: PublicKey }] {
  const [createAccountIx, signer, account] = createUninitializedTokenAccount(
    payer,
    accountRentExempt,
  );
  const initAccountIx = Token.createInitAccountInstruction(TOKEN_PROGRAM_ID, mint, account, owner);

  return [[createAccountIx, initAccountIx], [signer], { tokenAccount: account }];
}

export function createUninitializedTokenAccount(
  payer: PublicKey,
  amount: number,
): [TransactionInstruction, Signer, PublicKey] {
  const tokenAccount = Keypair.generate();
  const instruction = SystemProgram.createAccount({
    fromPubkey: payer,
    newAccountPubkey: tokenAccount.publicKey,
    lamports: amount,
    space: TokenAccountLayout.span,
    programId: TOKEN_PROGRAM_ID,
  });

  return [instruction, tokenAccount, tokenAccount.publicKey];
}
