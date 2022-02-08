import test from 'tape';

import {
  init,
  initInitVaultAccounts,
  killStuckProcess,
  spokSameBignum,
  spokSamePubkey,
} from './utils';
import {
  assertConfirmedTransaction,
  assertError,
  assertTransactionSummary,
} from '@metaplex-foundation/amman';
import { Transaction } from '@solana/web3.js';
import { Key, Vault, VaultState } from '../src/mpl-token-vault';
import spok from 'spok';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { InitVault } from '../src/instructions/init-vault';

killStuckProcess();

test('init-vault: init vault allowing further share creation', async (t) => {
  const { transactionHandler, connection, authority } = await init();
  const initVaultAccounts = await initInitVaultAccounts(
    t,
    connection,
    transactionHandler,
    authority,
  );

  const initVaultIx = await InitVault.initVault(initVaultAccounts, {
    allowFurtherShareCreation: true,
  });

  const initVaulTx = new Transaction().add(initVaultIx);
  const initVaultRes = await transactionHandler.sendAndConfirmTransaction(initVaulTx, []);

  assertConfirmedTransaction(t, initVaultRes.txConfirmed);
  assertTransactionSummary(t, initVaultRes.txSummary, {
    msgRx: [/Init Vault/, /success/],
  });

  const { fractionMint, redeemTreasury, fractionTreasury, vault, pricingLookupAddress } =
    initVaultAccounts;

  const vaultAccountInfo = await connection.getAccountInfo(vault);
  const [vaultAccount] = Vault.fromAccountInfo(vaultAccountInfo);

  spok(t, vaultAccount, {
    $topic: 'vaultAccount',
    key: Key.VaultV1,
    tokenProgram: spokSamePubkey(TOKEN_PROGRAM_ID),
    fractionMint: spokSamePubkey(fractionMint),
    redeemTreasury: spokSamePubkey(redeemTreasury),
    fractionTreasury: spokSamePubkey(fractionTreasury),
    pricingLookupAddress: spokSamePubkey(pricingLookupAddress),
    authority: spokSamePubkey(authority),
    allowFurtherShareCreation: true,
    tokenTypeCount: 0,
    state: VaultState.Inactive,
    lockedPricePerShare: spokSameBignum(0),
  });
});

test('init-vault: init vault not allowing further share creation', async (t) => {
  const { transactionHandler, connection, authority } = await init();
  const initVaultAccounts = await initInitVaultAccounts(
    t,
    connection,
    transactionHandler,
    authority,
  );

  const initVaultIx = await InitVault.initVault(initVaultAccounts, {
    allowFurtherShareCreation: false,
  });

  const initVaulTx = new Transaction().add(initVaultIx);
  const initVaultRes = await transactionHandler.sendAndConfirmTransaction(initVaulTx, []);

  assertConfirmedTransaction(t, initVaultRes.txConfirmed);
  assertTransactionSummary(t, initVaultRes.txSummary, {
    msgRx: [/Init Vault/, /success/],
  });

  const { fractionMint, redeemTreasury, fractionTreasury, vault, pricingLookupAddress } =
    initVaultAccounts;

  const vaultAccountInfo = await connection.getAccountInfo(vault);
  const [vaultAccount] = Vault.fromAccountInfo(vaultAccountInfo);

  spok(t, vaultAccount, {
    $topic: 'vaultAccount',
    key: Key.VaultV1,
    tokenProgram: spokSamePubkey(TOKEN_PROGRAM_ID),
    fractionMint: spokSamePubkey(fractionMint),
    redeemTreasury: spokSamePubkey(redeemTreasury),
    fractionTreasury: spokSamePubkey(fractionTreasury),
    pricingLookupAddress: spokSamePubkey(pricingLookupAddress),
    authority: spokSamePubkey(authority),
    allowFurtherShareCreation: false,
    tokenTypeCount: 0,
    state: VaultState.Inactive,
    lockedPricePerShare: spokSameBignum(0),
  });
});

test('init-vault: init vault twice for same account', async (t) => {
  const { transactionHandler, connection, authority } = await init();
  const initVaultAccounts = await initInitVaultAccounts(
    t,
    connection,
    transactionHandler,
    authority,
  );

  {
    const initVaultIx = await InitVault.initVault(initVaultAccounts, {
      allowFurtherShareCreation: true,
    });

    const initVaulTx = new Transaction().add(initVaultIx);
    await transactionHandler.sendAndConfirmTransaction(initVaulTx, []);
  }
  {
    const initVaultIx = await InitVault.initVault(initVaultAccounts, {
      allowFurtherShareCreation: true,
    });

    const initVaulTx = new Transaction().add(initVaultIx);
    try {
      await transactionHandler.sendAndConfirmTransaction(initVaulTx, []);
    } catch (err) {
      assertError(t, err, [/Init Vault/i, /Already initialized/i]);
    }
  }
});
