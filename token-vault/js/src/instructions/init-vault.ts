import { AccountLayout as TokenAccountLayout, MintLayout } from '@solana/spl-token';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { VAULT_PREFIX, VAULT_PROGRAM_PUBLIC_KEY } from '../common/consts';
import { createMint, createTokenAccount } from '../common/helpers';
import {
  createInitVaultInstruction,
  InitVaultArgs,
  InitVaultInstructionAccounts,
  Vault,
} from '../generated';
import { InstructionsWithAccounts } from '../types';

export class InitVault {
  /**
   * Sets up the accounts needed to initialize a vault.
   * Use this method if you don't have those accounts setup already.
   *
   * See {@link InitVaultInstructionAccounts} for more information about those accounts.
   * @param args
   *  - externalPriceAccount should be created via {@link import('./create-external-price-account').createExternalPriceAccount}
   */
  static async setupInitVaultAccounts(
    connection: Connection,
    args: {
      authority: PublicKey;
      priceMint: PublicKey;
      externalPriceAccount: PublicKey;
    },
  ): Promise<InstructionsWithAccounts<InitVaultInstructionAccounts>> {
    // -----------------
    // Rent Exempts
    // -----------------
    const tokenAccountRentExempt = await connection.getMinimumBalanceForRentExemption(
      TokenAccountLayout.span,
    );

    const mintRentExempt = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
    const vaultRentExempt = await Vault.getMinimumBalanceForRentExemption(connection);

    // -----------------
    // Account Setups
    // -----------------
    const { vaultPair: vault, vaultAuthority } = await vaultAccountPDA();

    const [fractionMintIxs, fractionMintSigners, { mintAccount: fractionMint }] = createMint(
      args.authority,
      mintRentExempt,
      0,
      vaultAuthority,
      vaultAuthority,
    );

    const [redeemTreasuryIxs, redeemTreasurySigners, { tokenAccount: redeemTreasury }] =
      createTokenAccount(args.authority, tokenAccountRentExempt, args.priceMint, vaultAuthority);

    const [fractionTreasuryIxs, fractionTreasurySigners, { tokenAccount: fractionTreasury }] =
      createTokenAccount(args.authority, tokenAccountRentExempt, fractionMint, vaultAuthority);

    const uninitializedVaultIx = SystemProgram.createAccount({
      fromPubkey: args.authority,
      newAccountPubkey: vault.publicKey,
      lamports: vaultRentExempt,
      space: Vault.byteSize,
      programId: VAULT_PROGRAM_PUBLIC_KEY,
    });

    return [
      [...fractionMintIxs, ...redeemTreasuryIxs, ...fractionTreasuryIxs, uninitializedVaultIx],
      [...fractionMintSigners, ...redeemTreasurySigners, ...fractionTreasurySigners, vault],
      {
        fractionMint,
        redeemTreasury,
        fractionTreasury,
        vault: vault.publicKey,
        authority: args.authority,
        pricingLookupAddress: args.externalPriceAccount,
      },
    ];
  }

  /**
   * Initializes the Vault.
   *
   * @param accounts set them up via {@link InitVault.setupInitVaultAccounts}
   */
  static async initVault(accounts: InitVaultInstructionAccounts, initVaultArgs: InitVaultArgs) {
    return createInitVaultInstruction(accounts, {
      initVaultArgs,
    });
  }
}
async function vaultAccountPDA() {
  const vaultPair = Keypair.generate();

  const [vaultAuthority] = await PublicKey.findProgramAddress(
    [
      Buffer.from(VAULT_PREFIX),
      VAULT_PROGRAM_PUBLIC_KEY.toBuffer(),
      vaultPair.publicKey.toBuffer(),
    ],
    VAULT_PROGRAM_PUBLIC_KEY,
  );

  return { vaultPair, vaultAuthority };
}
