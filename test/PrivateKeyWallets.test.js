// @flow
import {unlockKeystoreWallet, createKeystoreWallet, signTransaction} from "../PrivateKeyWallets";
import {newTransaction} from "../Transactions";

let wallet = {};

describe("keystore wallets", () => {

  beforeAll(() => {
    wallet = createKeystoreWallet("testingpassword");
  });

  console.log('**ATTENTION** This test requires a lot of juice. Expect some lag.');

  test("create a new wallet", () => {
    expect(wallet.name).not.toBe(null);
    expect(wallet.name).toMatch(/UTC/);
    expect(wallet.address).toHaveLength(42);
  });

  test("create a new wallet with no password", () => {
    let nopass = createKeystoreWallet("");
    expect(nopass.name).not.toBe(null);
    expect(nopass.name).toMatch(/UTC/);
    expect(nopass.address).toHaveLength(42);
  });

  test("create wallet and unlock wallet it", () => {
    let unlocked = unlockKeystoreWallet(wallet.walletJson, "testingpassword");
    expect(unlocked._privKey).not.toBe(null);
  });

  test("create wallet and fail to unlock wallet it", () => {
    try {
      unlockKeystoreWallet(wallet.walletJson, "testingpassword2")
    } catch(e) {
      expect(e).toStrictEqual(new Error("Key derivation failed - possibly wrong passphrase"))
    }
  });

  test("should sign transaction with created wallet", () => {

    let unlocked = unlockKeystoreWallet(wallet.walletJson, "testingpassword");
    let tx = newTransaction("0xDEADBEEF00000000000000000000000000000000", 1, 5000, 21000, 10000, 1);
    let signed = signTransaction(unlocked._privKey, tx);
    expect(signed).not.toBe(null);

  })

});
