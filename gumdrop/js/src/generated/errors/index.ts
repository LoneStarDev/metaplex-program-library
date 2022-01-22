type ErrorWithCode = Error & { code: number };
type MaybeErrorWithCode = ErrorWithCode | null | undefined;

const createErrorFromCodeLookup: Map<number, () => ErrorWithCode> = new Map();
const createErrorFromNameLookup: Map<string, () => ErrorWithCode> = new Map();

/**
 * InvalidProof: 'Invalid Merkle proof.'
 */
export class InvalidProofError extends Error {
  readonly code: number = 0x1770;
  readonly name: string = 'InvalidProof';
  constructor() {
    super('Invalid Merkle proof.');
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidProofError);
    }
  }
}

createErrorFromCodeLookup.set(0x1770, () => new InvalidProofError());
createErrorFromNameLookup.set('InvalidProof', () => new InvalidProofError());

/**
 * DropAlreadyClaimed: 'Drop already claimed.'
 */
export class DropAlreadyClaimedError extends Error {
  readonly code: number = 0x1771;
  readonly name: string = 'DropAlreadyClaimed';
  constructor() {
    super('Drop already claimed.');
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, DropAlreadyClaimedError);
    }
  }
}

createErrorFromCodeLookup.set(0x1771, () => new DropAlreadyClaimedError());
createErrorFromNameLookup.set('DropAlreadyClaimed', () => new DropAlreadyClaimedError());

/**
 * Unauthorized: 'Account is not authorized to execute this instruction'
 */
export class UnauthorizedError extends Error {
  readonly code: number = 0x1772;
  readonly name: string = 'Unauthorized';
  constructor() {
    super('Account is not authorized to execute this instruction');
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, UnauthorizedError);
    }
  }
}

createErrorFromCodeLookup.set(0x1772, () => new UnauthorizedError());
createErrorFromNameLookup.set('Unauthorized', () => new UnauthorizedError());

/**
 * OwnerMismatch: 'Token account owner did not match intended owner'
 */
export class OwnerMismatchError extends Error {
  readonly code: number = 0x1773;
  readonly name: string = 'OwnerMismatch';
  constructor() {
    super('Token account owner did not match intended owner');
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, OwnerMismatchError);
    }
  }
}

createErrorFromCodeLookup.set(0x1773, () => new OwnerMismatchError());
createErrorFromNameLookup.set('OwnerMismatch', () => new OwnerMismatchError());

/**
 * TemporalMismatch: 'Temporal signer did not match distributor'
 */
export class TemporalMismatchError extends Error {
  readonly code: number = 0x1774;
  readonly name: string = 'TemporalMismatch';
  constructor() {
    super('Temporal signer did not match distributor');
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, TemporalMismatchError);
    }
  }
}

createErrorFromCodeLookup.set(0x1774, () => new TemporalMismatchError());
createErrorFromNameLookup.set('TemporalMismatch', () => new TemporalMismatchError());

/**
 * Attempts to resolve a custom program error from the provided error code.
 */
export function errorFromCode(code: number): MaybeErrorWithCode {
  const createError = createErrorFromCodeLookup.get(code);
  return createError != null ? createError() : null;
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 */
export function errorFromName(name: string): MaybeErrorWithCode {
  const createError = createErrorFromNameLookup.get(name);
  return createError != null ? createError() : null;
}
