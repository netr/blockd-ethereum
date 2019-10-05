// @flow

import Wallet from "ethereumjs-wallet";
import { Transaction } from "ethereumjs-tx";

export const createKeystoreWallet = (password: string) => {
  const _createdWallet = {};
  const _wallet = new Wallet.generate();
  _createdWallet.walletJson = _wallet.toV3(password, {
    kdf: "scrypt",
    dklen: 32,
    n: 262144,
    r: 8,
    p: 1,
    cipher: "aes-128-ctr"
  });
  _createdWallet.name = _wallet.getV3Filename();
  _createdWallet.address = _wallet.getChecksumAddressString();

  return _createdWallet;
};

export const unlockKeystoreWallet = (file: {}, password: string) => {
  const newFile = {};
  Object.keys(file).forEach(key => {
    newFile[key.toLowerCase()] = file[key];
  });
  return Wallet.fromV3(newFile, password, true);
};

export const signTransaction = (privateKey: any[], transaction: Transaction) => {
  transaction.sign(Buffer.from(privateKey));
  return transaction.serialize().toString('hex');
};
