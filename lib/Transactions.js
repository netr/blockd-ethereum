"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeTransaction = exports.sanitizeKey = exports.calculateGasCost = exports.fromEther = exports.gasToGwei = exports.toBN = exports.newTransaction = void 0;

var _ethereumjsTx = require("ethereumjs-tx");

var _web3Utils = _interopRequireDefault(require("web3-utils"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const newTransaction = (to, nonce, gasPrice, gasLimit, txValue, chainId) => {
  return new _ethereumjsTx.Transaction({
    nonce: _web3Utils.default.toHex(typeof nonce === _bignumber.default ? nonce : new _bignumber.default(nonce)),
    to: String(to).toLowerCase(),
    gasPrice: _web3Utils.default.toHex(typeof gasPrice === _bignumber.default ? gasPrice : new _bignumber.default(gasPrice)),
    gasLimit: _web3Utils.default.toHex(typeof gasLimit === _bignumber.default ? gasLimit : new _bignumber.default(gasLimit)),
    value: _web3Utils.default.toHex(typeof txValue === _bignumber.default ? txValue : new _bignumber.default(txValue)),
    chainId: _web3Utils.default.toHex(typeof chainId === _bignumber.default ? chainId : new _bignumber.default(chainId))
  });
};

exports.newTransaction = newTransaction;

const toBN = value => {
  return new _bignumber.default(value);
};

exports.toBN = toBN;

const gasToGwei = gas => {
  return new _bignumber.default(_web3Utils.default.toWei(gas, "gwei"));
};

exports.gasToGwei = gasToGwei;

const fromEther = ether => {
  return new _bignumber.default(_web3Utils.default.toWei(ether, "ether"));
};

exports.fromEther = fromEther;

const calculateGasCost = (gasPrice, gasLimit) => {
  return gasPrice.multipliedBy(gasLimit);
};

exports.calculateGasCost = calculateGasCost;

const sanitizeKey = key => {
  return Buffer.isBuffer(key) ? key : getBufferFromHex(sanitizeHex(key));
};

exports.sanitizeKey = sanitizeKey;

const decodeTransaction = hex => {
  const tx = new _ethereumjsTx.Transaction(hex);
  let rawTx = {
    nonce: parseInt(tx.nonce.toString("hex"), 16),
    gasPrice: parseInt(tx.gasPrice.toString("hex"), 16),
    gasLimit: parseInt(tx.gasLimit.toString("hex"), 16),
    to: "0x" + tx.to.toString("hex"),
    value: parseInt(tx.value.toString("hex"), 16),
    data: tx.data.toString("hex")
  };

  if (tx.r.length) {
    rawTx = { ...rawTx,
      from: "0x" + tx.from.toString("hex"),
      r: tx.r.toString("hex"),
      v: tx.v.toString("hex"),
      s: tx.s.toString("hex")
    };
  }

  return rawTx;
};

exports.decodeTransaction = decodeTransaction;

const getBufferFromHex = hex => {
  hex = sanitizeHex(hex);

  const _hex = hex.toLowerCase().replace('0x', '');

  return new Buffer(_hex, 'hex');
};

const sanitizeHex = hex => {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  if (hex === '') return '';
  return '0x' + padLeftEven(hex);
};

const padLeftEven = hex => {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
};