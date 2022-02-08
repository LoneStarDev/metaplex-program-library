// -----------------
// Example: creating a InitVault Transaction
// -----------------

// Make sure to have a local validator running to try this as is, i.e. via `yarn amman:start`

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';
import { LOCALHOST } from '@metaplex-foundation/amman';

import {
  QUOTE_MINT,
  createExternalPriceAccount,
  // The InitVault class holds all related methods, including methods to setup accounts
  InitVault,
  Vault,
} from '../src/mpl-token-vault';

// Could be devnet/mainnet, depending on your use case
const host = LOCALHOST;

// Using wrapped SOL mint here, you may choose to use another
const priceMint = QUOTE_MINT;

const connection = new Connection(host, 'confirmed');

// -----------------
async function main() {
  // This is the payer account which should have sufficient amount of SOL
  const authority = await fundedAuthority();

  // -----------------
  // 1. Setup Accounts to use when initializing the vault
  //    You may not need to do this if you already have those accounts
  // -----------------
  const [createExternalAccountIxs, createExternalAccountSigners, { externalPriceAccount }] =
    await createExternalPriceAccount(connection, authority.publicKey);

  const [setupAccountsIxs, setupAccountsSigners, initVaultAccounts] =
    await InitVault.setupInitVaultAccounts(connection, {
      authority: authority.publicKey,
      priceMint,
      externalPriceAccount,
    });

  const createAndSetupAccountsTx = new Transaction()
    .add(...createExternalAccountIxs)
    .add(...setupAccountsIxs);

  await sendAndConfirmTransaction(connection, createAndSetupAccountsTx, [
    authority,
    ...createExternalAccountSigners,
    ...setupAccountsSigners,
  ]);

  // -----------------
  // 2. Using the accounts we setup above we can now initialize our vault
  // -----------------
  const initVaultIx = await InitVault.initVault(initVaultAccounts, {
    allowFurtherShareCreation: true,
  });
  const initVaulTx = new Transaction().add(initVaultIx);
  await sendAndConfirmTransaction(connection, initVaulTx, [authority]);

  // -----------------
  // 3. We can now query the initialized vault
  // -----------------
  const vaultAccountInfo = await connection.getAccountInfo(initVaultAccounts.vault);
  const [vaultAccount] = Vault.fromAccountInfo(vaultAccountInfo);
  console.log(vaultAccount.pretty());
}

main()
  .then(() => process.exit(0))
  .catch((err: any) => {
    console.error(err);
    process.exit(1);
  });

// -----------------
// Helpers not relevant to this example
// -----------------
async function fundedAuthority() {
  const authority = Keypair.generate();
  const sig = await connection.requestAirdrop(authority.publicKey, 1 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig);
  return authority;
}
