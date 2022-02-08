import * as beet from '@metaplex-foundation/beet';
export type InitVaultArgs = {
  allowFurtherShareCreation: boolean;
};
export const initVaultArgsBeet = new beet.BeetArgsStruct<InitVaultArgs>(
  [['allowFurtherShareCreation', beet.bool]],
  'InitVaultArgs',
);
