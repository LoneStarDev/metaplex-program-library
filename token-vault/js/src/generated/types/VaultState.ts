import * as beet from '@metaplex-foundation/beet';
export enum VaultState {
  Inactive,
  Active,
  Combined,
  Deactivated,
}
export const vaultStateBeet = beet.fixedScalarEnum(VaultState) as beet.FixedSizeBeet<
  VaultState,
  VaultState
>;
