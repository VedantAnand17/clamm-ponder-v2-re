export const OptionPricingV2ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_volatilityCap",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_minOptionPricePercentage",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getOptionPrice",
    "inputs": [
      { "name": "amount", "type": "uint256", "internalType": "uint256" },
      {
        "name": "putAssetDecimals",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "callAssetDecimals",
        "type": "uint8",
        "internalType": "uint8"
      },
      { "name": "isPut", "type": "bool", "internalType": "bool" },
      { "name": "expiry", "type": "uint256", "internalType": "uint256" },
      { "name": "strike", "type": "uint256", "internalType": "uint256" },
      { "name": "lastPrice", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "optionPrice", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ivSetter",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "minOptionPricePercentage",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      { "name": "newOwner", "type": "address", "internalType": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ttlToVol",
    "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updateIVSetter",
    "inputs": [
      { "name": "_setter", "type": "address", "internalType": "address" },
      { "name": "_status", "type": "bool", "internalType": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateIVs",
    "inputs": [
      { "name": "_ttls", "type": "uint256[]", "internalType": "uint256[]" },
      { "name": "_ttlIV", "type": "uint256[]", "internalType": "uint256[]" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateMinOptionPricePercentage",
    "inputs": [
      {
        "name": "_minOptionPricePercentage",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateVolatilityCap",
    "inputs": [
      {
        "name": "_volatilityCap",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "volatilityCap",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UpdatedIVs",
    "inputs": [
      {
        "name": "ttls",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "ttlIVs",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  { "type": "error", "name": "NotIVSetter", "inputs": [] }
] as const;
