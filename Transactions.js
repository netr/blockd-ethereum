// @flow

import { Transaction } from "ethereumjs-tx";
import web3utils from "web3-utils";
import BigNumber from "bignumber.js";

export const newTransaction = (
  to: string,
  nonce: number | string | BigNumber,
  gasPrice: number | string | BigNumber,
  gasLimit: number | string | BigNumber,
  txValue: number | string | BigNumber,
  chainId: number | string | BigNumber
) => {
  return new Transaction({
    nonce: web3utils.toHex(typeof(nonce) === BigNumber ? nonce : new BigNumber(nonce)),
    to: String(to).toLowerCase(),
    gasPrice: web3utils.toHex(typeof(gasPrice) === BigNumber ? gasPrice : new BigNumber(gasPrice)),
    gasLimit: web3utils.toHex(typeof(gasLimit) === BigNumber ? gasLimit : new BigNumber(gasLimit)),
    value: web3utils.toHex(typeof(txValue) === BigNumber ? txValue : new BigNumber(txValue)),
    chainId: web3utils.toHex(typeof(chainId) === BigNumber ? chainId : new BigNumber(chainId)),
  });
};

export const toBN : BigNumber = (value: string | number) => {
  return new BigNumber(value);
};

export const gasToGwei : BigNumber = (gas: string) => {
  return new BigNumber(web3utils.toWei(gas, "gwei"));
};

export const fromEther : BigNumber = (ether: string) => {
  return new BigNumber(web3utils.toWei(ether, "ether"));
};

export const calculateGasCost = (gasPrice: BigNumber, gasLimit: BigNumber) => {
  return gasPrice.multipliedBy(gasLimit);
};

export const sanitizeKey : Buffer = (key: Buffer|string) => {
  return Buffer.isBuffer(key) ? key : getBufferFromHex(sanitizeHex(key));
};

export const decodeTransaction : {} = hex => {
  const tx = new Transaction(hex);
  let rawTx = {
    nonce: parseInt(tx.nonce.toString("hex"), 16),
    gasPrice: parseInt(tx.gasPrice.toString("hex"), 16),
    gasLimit: parseInt(tx.gasLimit.toString("hex"), 16),
    to: "0x" + tx.to.toString("hex"),
    value: parseInt(tx.value.toString("hex"), 16),
    data: tx.data.toString("hex")
  };

  if (tx.r.length) {
    rawTx = {
      ...rawTx,
      from: "0x" + tx.from.toString("hex"),
      r: tx.r.toString("hex"),
      v: tx.v.toString("hex"),
      s: tx.s.toString("hex")
    };
  }
  return rawTx;
};


const getBufferFromHex = (hex: string) => {
  hex = sanitizeHex(hex);
  const _hex = hex.toLowerCase().replace('0x', '');
  return new Buffer(_hex, 'hex');
};

const sanitizeHex = (hex: string) => {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  if (hex === '') return '';
  return '0x' + padLeftEven(hex);
};

const padLeftEven = (hex: string) => {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
};
