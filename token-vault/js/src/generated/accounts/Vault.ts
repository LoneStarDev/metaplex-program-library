import * as definedTypes from '../types';
import * as web3 from '@solana/web3.js';
import * as beet from '@metaplex-foundation/beet';
import * as beetSolana from '@metaplex-foundation/beet-solana';

/**
 * Arguments used to create {@link Vault}
 */
export type VaultArgs = {
  key: definedTypes.Key;
  tokenProgram: web3.PublicKey;
  fractionMint: web3.PublicKey;
  authority: web3.PublicKey;
  fractionTreasury: web3.PublicKey;
  redeemTreasury: web3.PublicKey;
  allowFurtherShareCreation: boolean;
  pricingLookupAddress: web3.PublicKey;
  tokenTypeCount: number;
  state: definedTypes.VaultState;
  lockedPricePerShare: beet.bignum;
};
/**
 * Holds the data for the {@link Vault} Account and provides de/serialization
 * functionality for that data
 */
export class Vault implements VaultArgs {
  private constructor(
    readonly key: definedTypes.Key,
    readonly tokenProgram: web3.PublicKey,
    readonly fractionMint: web3.PublicKey,
    readonly authority: web3.PublicKey,
    readonly fractionTreasury: web3.PublicKey,
    readonly redeemTreasury: web3.PublicKey,
    readonly allowFurtherShareCreation: boolean,
    readonly pricingLookupAddress: web3.PublicKey,
    readonly tokenTypeCount: number,
    readonly state: definedTypes.VaultState,
    readonly lockedPricePerShare: beet.bignum,
  ) {}

  /**
   * Creates a {@link Vault} instance from the provided args.
   */
  static fromArgs(args: VaultArgs) {
    return new Vault(
      args.key,
      args.tokenProgram,
      args.fractionMint,
      args.authority,
      args.fractionTreasury,
      args.redeemTreasury,
      args.allowFurtherShareCreation,
      args.pricingLookupAddress,
      args.tokenTypeCount,
      args.state,
      args.lockedPricePerShare,
    );
  }

  /**
   * Deserializes the {@link Vault} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(accountInfo: web3.AccountInfo<Buffer>, offset = 0): [Vault, number] {
    return Vault.deserialize(accountInfo.data, offset);
  }

  /**
   * Deserializes the {@link Vault} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Vault, number] {
    return vaultBeet.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link Vault} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return vaultBeet.serialize(this);
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Vault}
   */
  static get byteSize() {
    return vaultBeet.byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Vault} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(Vault.byteSize, commitment);
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link Vault} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === Vault.byteSize;
  }

  /**
   * Returns a readable version of {@link Vault} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      key: this.key,
      tokenProgram: this.tokenProgram.toBase58(),
      fractionMint: this.fractionMint.toBase58(),
      authority: this.authority.toBase58(),
      fractionTreasury: this.fractionTreasury.toBase58(),
      redeemTreasury: this.redeemTreasury.toBase58(),
      allowFurtherShareCreation: this.allowFurtherShareCreation,
      pricingLookupAddress: this.pricingLookupAddress.toBase58(),
      tokenTypeCount: this.tokenTypeCount,
      state: this.state,
      lockedPricePerShare: this.lockedPricePerShare,
    };
  }
}

export const vaultBeet = new beet.BeetStruct<Vault, VaultArgs>(
  [
    ['key', definedTypes.keyBeet],
    ['tokenProgram', beetSolana.publicKey],
    ['fractionMint', beetSolana.publicKey],
    ['authority', beetSolana.publicKey],
    ['fractionTreasury', beetSolana.publicKey],
    ['redeemTreasury', beetSolana.publicKey],
    ['allowFurtherShareCreation', beet.bool],
    ['pricingLookupAddress', beetSolana.publicKey],
    ['tokenTypeCount', beet.u8],
    ['state', definedTypes.vaultStateBeet],
    ['lockedPricePerShare', beet.u64],
  ],
  Vault.fromArgs,
  'Vault',
);
