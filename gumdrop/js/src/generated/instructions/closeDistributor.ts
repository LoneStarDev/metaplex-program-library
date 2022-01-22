import * as splToken from '@solana/spl-token';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

export type CloseDistributorInstructionArgs = {
  bump: number;
  walletBump: number;
};
const closeDistributorStruct = new beet.BeetArgsStruct<
  CloseDistributorInstructionArgs & {
    instructionDiscriminator: number[];
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['bump', beet.u8],
    ['walletBump', beet.u8],
  ],
  'CloseDistributorInstructionArgs',
);
export type CloseDistributorInstructionAccounts = {
  base: web3.PublicKey;
  distributor: web3.PublicKey;
  distributorWallet: web3.PublicKey;
  receiver: web3.PublicKey;
};

const closeDistributorInstructionDiscriminator = [202, 56, 180, 143, 46, 104, 106, 112];

/**
 * Creates a _CloseDistributor_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createCloseDistributorInstruction(
  accounts: CloseDistributorInstructionAccounts,
  args: CloseDistributorInstructionArgs,
) {
  const { base, distributor, distributorWallet, receiver } = accounts;

  const [data] = closeDistributorStruct.serialize({
    instructionDiscriminator: closeDistributorInstructionDiscriminator,
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
      pubkey: distributorWallet,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: receiver,
      isWritable: false,
      isSigner: false,
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
