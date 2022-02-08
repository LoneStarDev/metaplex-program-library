import * as beet from '@metaplex-foundation/beet';
export type NumberOfShareArgs = {
  numberOfShares: beet.bignum;
};
export const numberOfShareArgsBeet = new beet.BeetArgsStruct<NumberOfShareArgs>(
  [['numberOfShares', beet.u64]],
  'NumberOfShareArgs',
);
