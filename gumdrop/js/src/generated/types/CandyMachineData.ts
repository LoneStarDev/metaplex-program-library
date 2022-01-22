import * as beet from '@metaplex-foundation/beet';
export type CandyMachineData = {
  uuid: string;
  price: beet.bignum;
  itemsAvailable: beet.bignum;
  goLiveDate: beet.COption<beet.bignum>;
};
export const candyMachineDataStruct = new beet.FixableBeetArgsStruct<CandyMachineData>(
  [
    ['uuid', beet.utf8String],
    ['price', beet.u64],
    ['itemsAvailable', beet.u64],
    ['goLiveDate', beet.coption(beet.i64)],
  ],
  'CandyMachineData',
);
