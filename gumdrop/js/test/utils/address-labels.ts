import { AddressLabels } from '@metaplex-foundation/amman';
import { logDebug } from '.';
import { PROGRAM_ID_VAL } from '../../src/mpl-gumdrop';

const persistLabelsPath = process.env.ADDRESS_LABEL_PATH;
const knownLabels = {
  [PROGRAM_ID_VAL]: 'gumdrop',
};

export const addressLabels = new AddressLabels(knownLabels, logDebug, persistLabelsPath);
