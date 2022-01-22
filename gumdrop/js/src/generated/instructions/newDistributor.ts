import * as web3 from '@solana/web3.js';
import * as beet from '@metaplex-foundation/beet';
import * as beetSolana from '@metaplex-foundation/beet-solana';

export type NewDistributorInstructionArgs = {
  bump: number;
  root: number[] /* size: 32 */;
  temporal: web3.PublicKey;
};
const newDistributorStruct = new beet.BeetArgsStruct<
  NewDistributorInstructionArgs & {
    instructionDiscriminator: number[];
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['bump', beet.u8],
    ['root', beet.uniformFixedSizeArray(beet.u8, 32)],
    ['temporal', beetSolana.publicKey],
  ],
  'NewDistributorInstructionArgs',
);
export type NewDistributorInstructionAccounts = {
  base: web3.PublicKey;
  distributor: web3.PublicKey;
  payer: web3.PublicKey;
};

const newDistributorInstructionDiscriminator = [32, 139, 112, 171, 0, 2, 225, 155];

/**
 * Creates a _NewDistributor_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createNewDistributorInstruction(
  accounts: NewDistributorInstructionAccounts,
  args: NewDistributorInstructionArgs,
) {
  const { base, distributor, payer } = accounts;

  const [data] = newDistributorStruct.serialize({
    instructionDiscriminator: newDistributorInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: base,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: distributor,
      isWritable: true,
      isSigner: false,
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
  ];

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey('gdrpGjVffourzkdDRrQmySw4aTHr8a3xmQzzxSwFD1a'),
    keys,
    data,
  });
  return ix;
}
