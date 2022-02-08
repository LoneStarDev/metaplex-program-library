import * as beet from '@metaplex-foundation/beet';
export type AmountArgs = {
  amount: beet.bignum;
};
export const amountArgsBeet = new beet.BeetArgsStruct<AmountArgs>(
  [['amount', beet.u64]],
  'AmountArgs',
);
