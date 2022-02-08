import * as accounts from '../accounts';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

export type UpdateExternalPriceAccountInstructionArgs = {
  externalPriceAccount: accounts.ExternalPriceAccount;
};
const UpdateExternalPriceAccountStruct = new beet.BeetArgsStruct<
  UpdateExternalPriceAccountInstructionArgs & {
    instructionDiscriminator: number;
  }
>(
  [
    ['instructionDiscriminator', beet.u8],
    ['externalPriceAccount', accounts.externalPriceAccountBeet],
  ],
  'UpdateExternalPriceAccountInstructionArgs',
);
/**
 * Accounts required by the _UpdateExternalPriceAccount_ instruction
 *
 * @property [writable] externalPriceAccount External price account
 */
export type UpdateExternalPriceAccountInstructionAccounts = {
  externalPriceAccount: web3.PublicKey;
};

const updateExternalPriceAccountInstructionDiscriminator = 9;

/**
 * Creates a _UpdateExternalPriceAccount_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createUpdateExternalPriceAccountInstruction(
  accounts: UpdateExternalPriceAccountInstructionAccounts,
  args: UpdateExternalPriceAccountInstructionArgs,
) {
  const { externalPriceAccount } = accounts;

  const [data] = UpdateExternalPriceAccountStruct.serialize({
    instructionDiscriminator: updateExternalPriceAccountInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: externalPriceAccount,
      isWritable: true,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey('vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn'),
    keys,
    data,
  });
  return ix;
}
