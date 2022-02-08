import * as splToken from '@solana/spl-token';
import * as definedTypes from '../types';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

export type ActivateVaultInstructionArgs = {
  numberOfShareArgs: definedTypes.NumberOfShareArgs;
};
const ActivateVaultStruct = new beet.BeetArgsStruct<
  ActivateVaultInstructionArgs & {
    instructionDiscriminator: number;
  }
>(
  [
    ['instructionDiscriminator', beet.u8],
    ['numberOfShareArgs', definedTypes.numberOfShareArgsBeet],
  ],
  'ActivateVaultInstructionArgs',
);
/**
 * Accounts required by the _ActivateVault_ instruction
 *
 * @property [writable] vault Initialized inactivated fractionalized token vault
 * @property [writable] fractionMint Fraction mint
 * @property [writable] fractionTreasury Fraction treasury
 * @property [] fractionalMintAuthority Fraction mint authority for the program - seed of [PREFIX, program_id]
 * @property [signer] vaultAuthority Authority on the vault
 */
export type ActivateVaultInstructionAccounts = {
  vault: web3.PublicKey;
  fractionMint: web3.PublicKey;
  fractionTreasury: web3.PublicKey;
  fractionalMintAuthority: web3.PublicKey;
  vaultAuthority: web3.PublicKey;
};

const activateVaultInstructionDiscriminator = 2;

/**
 * Creates a _ActivateVault_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createActivateVaultInstruction(
  accounts: ActivateVaultInstructionAccounts,
  args: ActivateVaultInstructionArgs,
) {
  const {
    vault,
    fractionMint,
    fractionTreasury,
    fractionalMintAuthority,
    vaultAuthority,
  } = accounts;

  const [data] = ActivateVaultStruct.serialize({
    instructionDiscriminator: activateVaultInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: vault,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: fractionMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: fractionTreasury,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: fractionalMintAuthority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: vaultAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
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
