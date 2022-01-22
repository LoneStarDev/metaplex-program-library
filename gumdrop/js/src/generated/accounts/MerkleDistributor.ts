import * as web3 from '@solana/web3.js';
import * as beetSolana from '@metaplex-foundation/beet-solana';
import * as beet from '@metaplex-foundation/beet';

/**
 * Arguments used to create {@link MerkleDistributorAccountData}
 */
export type MerkleDistributorAccountDataArgs = {
  base: web3.PublicKey;
  bump: number;
  root: number[] /* size: 32 */;
  temporal: web3.PublicKey;
};

const merkleDistributorAccountDiscriminator = [77, 119, 139, 70, 84, 247, 12, 26];
/**
 * Holds the data for the {@link MerkleDistributorAccount} and provides de/serialization
 * functionality for that data
 */
export class MerkleDistributorAccountData implements MerkleDistributorAccountDataArgs {
  private constructor(
    readonly base: web3.PublicKey,
    readonly bump: number,
    readonly root: number[] /* size: 32 */,
    readonly temporal: web3.PublicKey,
  ) {}

  /**
   * Creates a {@link MerkleDistributorAccountData} instance from the provided args.
   */
  static fromArgs(args: MerkleDistributorAccountDataArgs) {
    return new MerkleDistributorAccountData(args.base, args.bump, args.root, args.temporal);
  }

  /**
   * Deserializes the {@link MerkleDistributorAccountData} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0,
  ): [MerkleDistributorAccountData, number] {
    return MerkleDistributorAccountData.deserialize(accountInfo.data, offset);
  }

  /**
   * Deserializes the {@link MerkleDistributorAccountData} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [MerkleDistributorAccountData, number] {
    return merkleDistributorAccountDataStruct.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link MerkleDistributorAccountData} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return merkleDistributorAccountDataStruct.serialize({
      accountDiscriminator: merkleDistributorAccountDiscriminator,
      ...this,
    });
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link MerkleDistributorAccountData}
   */
  static get byteSize() {
    return merkleDistributorAccountDataStruct.byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link MerkleDistributorAccountData} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment,
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      MerkleDistributorAccountData.byteSize,
      commitment,
    );
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link MerkleDistributorAccountData} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === MerkleDistributorAccountData.byteSize;
  }

  /**
   * Returns a readable version of {@link MerkleDistributorAccountData} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      base: this.base.toBase58(),
      bump: this.bump,
      root: this.root,
      temporal: this.temporal.toBase58(),
    };
  }
}

const merkleDistributorAccountDataStruct = new beet.BeetStruct<
  MerkleDistributorAccountData,
  MerkleDistributorAccountDataArgs & {
    accountDiscriminator: number[];
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['base', beetSolana.publicKey],
    ['bump', beet.u8],
    ['root', beet.uniformFixedSizeArray(beet.u8, 32)],
    ['temporal', beetSolana.publicKey],
  ],
  MerkleDistributorAccountData.fromArgs,
  'MerkleDistributorAccountData',
);
