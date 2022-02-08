import { Test } from 'tape';
import {
  airdrop,
  assertConfirmedTransaction,
  assertTransactionSummary,
  LOCALHOST,
  PayerTransactionHandler,
} from '@metaplex-foundation/amman';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { addressLabels } from '.';
import { createExternalPriceAccount, InitVault, QUOTE_MINT } from '../../src/mpl-token-vault';

export async function init() {
  const [authority, authorityPair] = addressLabels.genKeypair('authority');

  const connection = new Connection(LOCALHOST, 'confirmed');
  await airdrop(connection, authority, 2);

  const transactionHandler = new PayerTransactionHandler(connection, authorityPair);
  return {
    transactionHandler,
    connection,
    authority,
    authorityPair,
  };
}

export async function initInitVaultAccounts(
  t: Test,
  connection: Connection,
  transactionHandler: PayerTransactionHandler,
  authority: PublicKey,
) {
  // -----------------
  // Create External Account
  // -----------------
  const [createExternalAccountIxs, createExternalAccountSigners, { externalPriceAccount }] =
    await createExternalPriceAccount(connection, authority);

  const priceMint = QUOTE_MINT;

  addressLabels.addLabels({ externalPriceAccount, priceMint });

  // -----------------
  // Setup Init Vault Accounts
  // -----------------
  const [setupAccountsIxs, setupAccountsSigners, initVaultAccounts] =
    await InitVault.setupInitVaultAccounts(connection, {
      authority,
      priceMint,
      externalPriceAccount,
    });

  addressLabels.addLabels(initVaultAccounts);

  const createAndSetupAccountsTx = new Transaction()
    .add(...createExternalAccountIxs)
    .add(...setupAccountsIxs);

  const createAndSetupAccountsRes = await transactionHandler.sendAndConfirmTransaction(
    createAndSetupAccountsTx,
    [...createExternalAccountSigners, ...setupAccountsSigners],
  );

  assertConfirmedTransaction(t, createAndSetupAccountsRes.txConfirmed);
  assertTransactionSummary(t, createAndSetupAccountsRes.txSummary, {
    msgRx: [/Update External Price Account/i, /InitializeMint/i, /InitializeAccount/i, /success/],
  });

  return initVaultAccounts;
}

export async function initVault(t: Test, args: { allowFurtherShareCreation: boolean }) {
  const { transactionHandler, connection, authority } = await init();
  const initVaultAccounts = await initInitVaultAccounts(
    t,
    connection,
    transactionHandler,
    authority,
  );
  const initVaultIx = await InitVault.initVault(initVaultAccounts, args);

  const initVaulTx = new Transaction().add(initVaultIx);
  await transactionHandler.sendAndConfirmTransaction(initVaulTx, []);

  return initVaultAccounts;
}
