import * as splToken from '@solana/spl-token';
import * as definedTypes from '../types';
import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

export type AddTokenToInactiveVaultInstructionArgs = {
  amountArgs: definedTypes.AmountArgs;
};
const AddTokenToInactiveVaultStruct = new beet.BeetArgsStruct<
  AddTokenToInactiveVaultInstructionArgs & {
    instructionDiscriminator: number;
  }
>(
  [
    ['instructionDiscriminator', beet.u8],
    ['amountArgs', definedTypes.amountArgsBeet],
  ],
  'AddTokenToInactiveVaultInstructionArgs',
);
/**
 * Accounts required by the _AddTokenToInactiveVault_ instruction
 *
 * @property [writable] safetyDepositAccount Uninitialized safety deposit box account address (will be created and allocated by this endpoint) Address should be pda with seed of [PREFIX, vault_address, token_mint_address]
 * @property [writable] tokenAccount Initialized Token account
 * @property [writable] store Initialized Token store account with authority of this program, this will get set on the safety deposit box
 * @property [writable] vault Initialized inactive fractionalized token vault
 * @property [signer] vaultAuthority Authority on the vault
 * @property [signer] payer Payer
 * @property [signer] transferAuthority Transfer Authority to move desired token amount from token account to safety deposit
 * @property [] systemAccount System account sysvar
 */
export type AddTokenToInactiveVaultInstructionAccounts = {
  safetyDepositAccount: web3.PublicKey;
  tokenAccount: web3.PublicKey;
  store: web3.PublicKey;
  vault: web3.PublicKey;
  vaultAuthority: web3.PublicKey;
  payer: web3.PublicKey;
  transferAuthority: web3.PublicKey;
  systemAccount: web3.PublicKey;
};

const addTokenToInactiveVaultInstructionDiscriminator = 1;

/**
 * Creates a _AddTokenToInactiveVault_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createAddTokenToInactiveVaultInstruction(
  accounts: AddTokenToInactiveVaultInstructionAccounts,
  args: AddTokenToInactiveVaultInstructionArgs,
) {
  const {
    safetyDepositAccount,
    tokenAccount,
    store,
    vault,
    vaultAuthority,
    payer,
    transferAuthority,
    systemAccount,
  } = accounts;

  const [data] = AddTokenToInactiveVaultStruct.serialize({
    instructionDiscriminator: addTokenToInactiveVaultInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: safetyDepositAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: tokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: store,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: vault,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: vaultAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: payer,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: transferAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: systemAccount,
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
