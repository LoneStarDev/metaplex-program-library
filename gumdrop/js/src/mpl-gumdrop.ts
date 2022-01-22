import { PublicKey } from '@solana/web3.js';

export * from './generated/accounts';
export * from './generated/errors';
export * from './generated/instructions';
export * from './generated/types';

export const PROGRAM_ID_VAL = 'gdrpGjVffourzkdDRrQmySw4aTHr8a3xmQzzxSwFD1a';
export const PROGRAM_ID = new PublicKey(PROGRAM_ID_VAL);

