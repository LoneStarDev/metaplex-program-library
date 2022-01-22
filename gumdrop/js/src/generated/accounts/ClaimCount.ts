import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';
import * as beetSolana from '@metaplex-foundation/beet-solana';

/**
 * Arguments used to create {@link ClaimCountAccountData}
 */
export type ClaimCountAccountDataArgs = {
  count: beet.bignum;
  claimant: web3.PublicKey;
};

const claimCountAccountDiscriminator = [78, 134, 220, 213, 34, 152, 102, 167];
/**
 * Holds the data for the {@link ClaimCountAccount} and provides de/serialization
 * functionality for that data
 */
export class ClaimCountAccountData implements ClaimCountAccountDataArgs {
  private constructor(readonly count: beet.bignum, readonly claimant: web3.PublicKey) {}

  /**
   * Creates a {@link ClaimCountAccountData} instance from the provided args.
   */
  static fromArgs(args: ClaimCountAccountDataArgs) {
    return new ClaimCountAccountData(args.count, args.claimant);
  }

  /**
   * Deserializes the {@link ClaimCountAccountData} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0,
  ): [ClaimCountAccountData, number] {
    return ClaimCountAccountData.deserialize(accountInfo.data, offset);
  }

  /**
   * Deserializes the {@link ClaimCountAccountData} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [ClaimCountAccountData, number] {
    return claimCountAccountDataStruct.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link ClaimCountAccountData} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return claimCountAccountDataStruct.serialize({
      accountDiscriminator: claimCountAccountDiscriminator,
      ...this,
    });
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ClaimCountAccountData}
   */
  static get byteSize() {
    return claimCountAccountDataStruct.byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ClaimCountAccountData} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(ClaimCountAccountData.byteSize, commitment);
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link ClaimCountAccountData} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === ClaimCountAccountData.byteSize;
  }

  /**
   * Returns a readable version of {@link ClaimCountAccountData} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      count: this.count,
      claimant: this.claimant.toBase58(),
    };
  }
}

const claimCountAccountDataStruct = new beet.BeetStruct<
  ClaimCountAccountData,
  ClaimCountAccountDataArgs & {
    accountDiscriminator: number[];
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['count', beet.u64],
    ['claimant', beetSolana.publicKey],
  ],
  ClaimCountAccountData.fromArgs,
  'ClaimCountAccountData',
);
