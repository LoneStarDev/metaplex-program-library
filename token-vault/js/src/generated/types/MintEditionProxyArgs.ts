import * as beet from '@metaplex-foundation/beet';
export type MintEditionProxyArgs = {
  edition: beet.bignum;
};
export const mintEditionProxyArgsBeet = new beet.BeetArgsStruct<MintEditionProxyArgs>(
  [['edition', beet.u64]],
  'MintEditionProxyArgs',
);
