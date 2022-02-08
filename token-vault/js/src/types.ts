import { PublicKey, Signer, TransactionInstruction } from '@solana/web3.js';

export type InstructionsWithAccounts<T extends Record<string, PublicKey>> = [
  TransactionInstruction[],
  Signer[],
  T,
];
