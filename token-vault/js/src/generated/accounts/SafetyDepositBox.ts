import * as definedTypes from '../types';
import * as web3 from '@solana/web3.js';
import * as beetSolana from '@metaplex-foundation/beet-solana';
import * as beet from '@metaplex-foundation/beet';

/**
 * Arguments used to create {@link SafetyDepositBox}
 */
export type SafetyDepositBoxArgs = {
  key: definedTypes.Key;
  vault: web3.PublicKey;
  tokenMint: web3.PublicKey;
  store: web3.PublicKey;
  order: number;
};
/**
 * Holds the data for the {@link SafetyDepositBox} Account and provides de/serialization
 * functionality for that data
 */
export class SafetyDepositBox implements SafetyDepositBoxArgs {
  private constructor(
    readonly key: definedTypes.Key,
    readonly vault: web3.PublicKey,
    readonly tokenMint: web3.PublicKey,
    readonly store: web3.PublicKey,
    readonly order: number,
  ) {}

  /**
   * Creates a {@link SafetyDepositBox} instance from the provided args.
   */
  static fromArgs(args: SafetyDepositBoxArgs) {
    return new SafetyDepositBox(args.key, args.vault, args.tokenMint, args.store, args.order);
  }

  /**
   * Deserializes the {@link SafetyDepositBox} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0,
  ): [SafetyDepositBox, number] {
    return SafetyDepositBox.deserialize(accountInfo.data, offset);
  }

  /**
   * Deserializes the {@link SafetyDepositBox} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [SafetyDepositBox, number] {
    return safetyDepositBoxBeet.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link SafetyDepositBox} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return safetyDepositBoxBeet.serialize(this);
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link SafetyDepositBox}
   */
  static get byteSize() {
    return safetyDepositBoxBeet.byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link SafetyDepositBox} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(SafetyDepositBox.byteSize, commitment);
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link SafetyDepositBox} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === SafetyDepositBox.byteSize;
  }

  /**
   * Returns a readable version of {@link SafetyDepositBox} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      key: this.key,
      vault: this.vault.toBase58(),
      tokenMint: this.tokenMint.toBase58(),
      store: this.store.toBase58(),
      order: this.order,
    };
  }
}

export const safetyDepositBoxBeet = new beet.BeetStruct<SafetyDepositBox, SafetyDepositBoxArgs>(
  [
    ['key', definedTypes.keyBeet],
    ['vault', beetSolana.publicKey],
    ['tokenMint', beetSolana.publicKey],
    ['store', beetSolana.publicKey],
    ['order', beet.u8],
  ],
  SafetyDepositBox.fromArgs,
  'SafetyDepositBox',
);
