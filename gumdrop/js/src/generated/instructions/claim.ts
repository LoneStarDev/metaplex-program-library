import * as splToken from '@solana/spl-token';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import * as beetSolana from '@metaplex-foundation/beet-solana';

export type ClaimInstructionArgs = {
  bump: number;
  index: beet.bignum;
  amount: beet.bignum;
  claimantSecret: web3.PublicKey;
  proof: number[] /* size: 32 */[];
};
const claimStruct = new beet.FixableBeetArgsStruct<
  ClaimInstructionArgs & {
    instructionDiscriminator: number[];
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['bump', beet.u8],
    ['index', beet.u64],
    ['amount', beet.u64],
    ['claimantSecret', beetSolana.publicKey],
    ['proof', beet.array(beet.uniformFixedSizeArray(beet.u8, 32))],
  ],
  'ClaimInstructionArgs',
);
export type ClaimInstructionAccounts = {
  distributor: web3.PublicKey;
  claimStatus: web3.PublicKey;
  from: web3.PublicKey;
  to: web3.PublicKey;
  temporal: web3.PublicKey;
  payer: web3.PublicKey;
};

const claimInstructionDiscriminator = [62, 198, 214, 193, 213, 159, 108, 210];

/**
 * Creates a _Claim_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createClaimInstruction(
  accounts: ClaimInstructionAccounts,
  args: ClaimInstructionArgs,
) {
  const { distributor, claimStatus, from, to, temporal, payer } = accounts;

  const [data] = claimStruct.serialize({
    instructionDiscriminator: claimInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: distributor,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: claimStatus,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: from,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: to,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: temporal,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: payer,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey('gdrpGjVffourzkdDRrQmySw4aTHr8a3xmQzzxSwFD1a'),
    keys,
    data,
  });
  return ix;
}
