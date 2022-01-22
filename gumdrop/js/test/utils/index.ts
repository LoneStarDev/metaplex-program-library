import debug from 'debug';
import test from 'tape';

export * from './address-labels';

export const logError = debug('gumdrop:test:error');
export const logInfo = debug('gumdrop:test:info');
export const logDebug = debug('gumdrop:test:debug');
export const logTrace = debug('gumdrop:test:trace');

export function killStuckProcess() {
  test.onFinish(() => process.exit(0));
}

export function transactionCostSol(signers: number = 1) {
  return signers * 0.000005;
}
