"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signTransaction = exports.unlockKeystoreWallet = exports.createKeystoreWallet = void 0;

var _ethereumjsWallet = _interopRequireDefault(require("ethereumjs-wallet"));

var _ethereumjsTx = require("ethereumjs-tx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createKeystoreWallet = password => {
  const _createdWallet = {};

  const _wallet = new _ethereumjsWallet.default.generate();

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

exports.createKeystoreWallet = createKeystoreWallet;

const unlockKeystoreWallet = (file, password) => {
  const newFile = {};
  Object.keys(file).forEach(key => {
    newFile[key.toLowerCase()] = file[key];
  });
  return _ethereumjsWallet.default.fromV3(newFile, password, true);
};

exports.unlockKeystoreWallet = unlockKeystoreWallet;

const signTransaction = (privateKey, transaction) => {
  transaction.sign(Buffer.from(privateKey));
  return transaction.serialize().toString('hex');
};

exports.signTransaction = signTransaction;