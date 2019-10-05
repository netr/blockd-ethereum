// @flow

import {
  createKeystoreWallet,
  signTransaction,
  unlockKeystoreWallet
} from "../PrivateKeyWallets";
import {
  newTransaction,
  sanitizeKey,
  decodeTransaction,
  gasToGwei,
  calculateGasCost,
  toBN,
  fromEther
} from "../Transactions";
import { BigNumber } from "bignumber.js";

describe("Transactions", () => {
  test("should create new transaction to chainId 1", () => {
    let tx = newTransaction(
      "0xDEADBEEF00000000000000000000000000000000",
      1,
      5000,
      21000,
      10000,
      1
    );
    expect(tx.r).toHaveLength(0); // not signed
    expect(tx.getChainId()).toBe(1);
  });

  test("should fail if bad address length is given", () => {
    try {
      newTransaction(
        "0xDEADBEEF000000000000000000000",
        1,
        5000,
        21000,
        10000,
        1
      );
    } catch (e) {
      expect(e.message).toEqual("The field to must have byte length of 20");
    }
  });

  test("should fail to sign transaction with bad private key length", () => {
    let privateKey = "304304304034034";
    privateKey = sanitizeKey(privateKey);

    let tx = newTransaction(
      "0xDEADBEEF00000000000000000000000000000000",
      1,
      5000,
      21000,
      10000,
      1
    );
    try {
      tx.sign(Buffer.from(privateKey));
    } catch (e) {
      expect(e).toEqual(new RangeError("private key length is invalid"));
    }
  });

  test("should fail to sign transaction with bad private key", () => {
    let privateKey =
      "S2033EA9112AC3EAF123C80DA46B27DC328893F94F4E4BC6C229F2FF29619258";
    privateKey = sanitizeKey(privateKey);

    let tx = newTransaction(
      "0xDEADBEEF00000000000000000000000000000000",
      1,
      5000,
      21000,
      10000,
      1
    );

    try {
      tx.sign(Buffer.from(privateKey));
    } catch (e) {
      expect(e).toEqual(new RangeError("private key length is invalid"));
    }
  });

  test("should successfully sign transaction with good private key", () => {
    let privateKey =
      "F2063EA9112AC3EAF113C80CA46B47CC328893F94F4E4BC6C229F2FF29619258";
    privateKey = sanitizeKey(privateKey);

    let tx = newTransaction(
      "0xDEADBEEF00000000000000000000000000000000",
      1,
      5000,
      21000,
      10000,
      1
    );
    expect(tx.r).toHaveLength(0); // not signed
    tx.sign(Buffer.from(privateKey));
    expect(tx.r).toHaveLength(32); // not signed
  });

  test("should sign transaction with gwei gas and verify it by decoding it", () => {
    let privateKey =
      "F2063EA9112AC3EAF113C80CA46B47CC328893F94F4E4BC6C229F2FF29619258";
    privateKey = sanitizeKey(privateKey);

    let tx = newTransaction(
      "0xDEADBEEF00000000000000000000000000000000",
      1,
      gasToGwei("5000"),
      21000,
      10000,
      1
    );
    tx.sign(Buffer.from(privateKey));
    let serialized = tx.serialize().toString("hex");
    let decoded = decodeTransaction(serialized);
    expect(decoded.gasPrice).toBe(5000000000000);
    expect(decoded.gasLimit).toBe(21000);
    expect(decoded.to).toBe("0xdeadbeef00000000000000000000000000000000");
    expect(decoded.value).toBe(10000);
  });

  test("sign transactions with large big numbers and decode it", () => {
    let privateKey =
      "F2063EA9112AC3EAF113C80CA46B47CC328893F94F4E4BC6C229F2FF29619258";
    privateKey = sanitizeKey(privateKey);

    let tx = newTransaction(
      "0xDEADBEEF00000000000000000000000000000000",
      1,
      new BigNumber(60000000000000000000),
      21000,
      10000,
      1
    );
    tx.sign(Buffer.from(privateKey));
    let serialized = tx.serialize().toString("hex");
    let decoded = decodeTransaction(serialized);
    expect(decoded.gasPrice).toBe(60000000000000000000);
    expect(decoded.gasLimit).toBe(21000);
    expect(decoded.to).toBe("0xdeadbeef00000000000000000000000000000000");
    expect(decoded.value).toBe(10000);
  });

  test("calculate gas cost properly", () => {
    let price = gasToGwei("20");
    let limit = toBN(21000);
    let cost = calculateGasCost(price, limit);
    expect(cost).toStrictEqual(new BigNumber(420000000000000));
  });

  test("adjust balance with gas cost", () => {
    let price = gasToGwei("20");
    let limit = toBN(21000);
    let balance = fromEther("1");
    let cost = calculateGasCost(price, limit);
    let newBalance = balance.minus(cost);
    expect(newBalance).toStrictEqual(new BigNumber(999580000000000000));
  });

});
