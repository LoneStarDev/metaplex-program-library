import * as web3 from '@solana/web3.js';
import * as beet from '@metaplex-foundation/beet';
import * as beetSolana from '@metaplex-foundation/beet-solana';

/**
 * Arguments used to create {@link ClaimStatusAccountData}
 */
export type ClaimStatusAccountDataArgs = {
  isClaimed: boolean;
  claimant: web3.PublicKey;
  claimedAt: beet.bignum;
  amount: beet.bignum;
};

const claimStatusAccountDiscriminator = [22, 183, 249, 157, 247, 95, 150, 96];
/**
 * Holds the data for the {@link ClaimStatusAccount} and provides de/serialization
 * functionality for that data
 */
export class ClaimStatusAccountData implements ClaimStatusAccountDataArgs {
  private constructor(
    readonly isClaimed: boolean,
    readonly claimant: web3.PublicKey,
    readonly claimedAt: beet.bignum,
    readonly amount: beet.bignum,
  ) {}

  /**
   * Creates a {@link ClaimStatusAccountData} instance from the provided args.
   */
  static fromArgs(args: ClaimStatusAccountDataArgs) {
    return new ClaimStatusAccountData(args.isClaimed, args.claimant, args.claimedAt, args.amount);
  }

  /**
   * Deserializes the {@link ClaimStatusAccountData} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0,
  ): [ClaimStatusAccountData, number] {
    return ClaimStatusAccountData.deserialize(accountInfo.data, offset);
  }

  /**
   * Deserializes the {@link ClaimStatusAccountData} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [ClaimStatusAccountData, number] {
    return claimStatusAccountDataStruct.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link ClaimStatusAccountData} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return claimStatusAccountDataStruct.serialize({
      accountDiscriminator: claimStatusAccountDiscriminator,
      ...this,
    });
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link ClaimStatusAccountData}
   */
  static get byteSize() {
    return claimStatusAccountDataStruct.byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link ClaimStatusAccountData} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      ClaimStatusAccountData.byteSize,
      commitment,
    );
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link ClaimStatusAccountData} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === ClaimStatusAccountData.byteSize;
  }

  /**
   * Returns a readable version of {@link ClaimStatusAccountData} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      isClaimed: this.isClaimed,
      claimant: this.claimant.toBase58(),
      claimedAt: this.claimedAt,
      amount: this.amount,
    };
  }
}

const claimStatusAccountDataStruct = new beet.BeetStruct<
  ClaimStatusAccountData,
  ClaimStatusAccountDataArgs & {
    accountDiscriminator: number[];
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['isClaimed', beet.bool],
    ['claimant', beetSolana.publicKey],
    ['claimedAt', beet.i64],
    ['amount', beet.u64],
  ],
  ClaimStatusAccountData.fromArgs,
  'ClaimStatusAccountData',
);
