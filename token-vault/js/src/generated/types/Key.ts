import * as beet from '@metaplex-foundation/beet';
export enum Key {
  Uninitialized,
  SafetyDepositBoxV1,
  ExternalAccountKeyV1,
  VaultV1,
}
export const keyBeet = beet.fixedScalarEnum(Key) as beet.FixedSizeBeet<Key, Key>;
