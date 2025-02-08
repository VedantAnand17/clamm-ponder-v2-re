export const Automatorv21ABI = [
  { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      { "name": "owner", "type": "address", "internalType": "address" },
      { "name": "spender", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "spender", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "asset",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "address", "internalType": "contract IERC20" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "assetUsdFeed",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      { "name": "account", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balancer",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IBalancerVault"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "convertToAssets",
    "inputs": [
      { "name": "shares", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "convertToShares",
    "inputs": [
      { "name": "assets", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "counterAsset",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "address", "internalType": "contract IERC20" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "counterAssetUsdFeed",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decreaseAllowance",
    "inputs": [
      { "name": "spender", "type": "address", "internalType": "address" },
      {
        "name": "subtractedValue",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deposit",
    "inputs": [
      { "name": "assets", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "shares", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositCap",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "depositFeePips",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint24", "internalType": "uint24" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "depositFeeRecipient",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActiveTicks",
    "inputs": [],
    "outputs": [{ "name": "", "type": "int24[]", "internalType": "int24[]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "handler",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IUniswapV3SingleTickLiquidityHandlerV2"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "handlerHook",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "increaseAllowance",
    "inputs": [
      { "name": "spender", "type": "address", "internalType": "address" },
      { "name": "addedValue", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "initializeV2_1",
    "inputs": [
      {
        "name": "adapter_",
        "type": "address",
        "internalType": "contract IUniswapV3PoolAdapter"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isOwner",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isStrategist",
    "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "manager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDopexV2PositionManager"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "minDepositAssets",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pool",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "poolAdapter",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IUniswapV3PoolAdapter"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "poolTickSpacing",
    "inputs": [],
    "outputs": [{ "name": "", "type": "int24", "internalType": "int24" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proxiableUUID",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "quoter",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IOrangeQuoter"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "rebalance",
    "inputs": [
      {
        "name": "ticksMint",
        "type": "tuple[]",
        "internalType": "struct IOrangeStrykeLPAutomatorV2_1.RebalanceTick[]",
        "components": [
          { "name": "tick", "type": "int24", "internalType": "int24" },
          {
            "name": "liquidity",
            "type": "uint128",
            "internalType": "uint128"
          }
        ]
      },
      {
        "name": "ticksBurn",
        "type": "tuple[]",
        "internalType": "struct IOrangeStrykeLPAutomatorV2_1.RebalanceTick[]",
        "components": [
          { "name": "tick", "type": "int24", "internalType": "int24" },
          {
            "name": "liquidity",
            "type": "uint128",
            "internalType": "uint128"
          }
        ]
      },
      { "name": "swapProxy", "type": "address", "internalType": "address" },
      {
        "name": "swapRequest",
        "type": "tuple",
        "internalType": "struct IOrangeSwapProxy.SwapInputRequest",
        "components": [
          {
            "name": "provider",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "swapCalldata",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "expectTokenIn",
            "type": "address",
            "internalType": "contract IERC20"
          },
          {
            "name": "expectTokenOut",
            "type": "address",
            "internalType": "contract IERC20"
          },
          {
            "name": "expectAmountIn",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "inputDelta",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      { "name": "flashLoanData", "type": "bytes", "internalType": "bytes" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "receiveFlashLoan",
    "inputs": [
      {
        "name": "tokens",
        "type": "address[]",
        "internalType": "contract IERC20[]"
      },
      { "name": "amounts", "type": "uint256[]", "internalType": "uint256[]" },
      {
        "name": "feeAmounts",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      { "name": "userData", "type": "bytes", "internalType": "bytes" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "redeem",
    "inputs": [
      { "name": "shares", "type": "uint256", "internalType": "uint256" },
      { "name": "minAssets", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [
      { "name": "assets", "type": "uint256", "internalType": "uint256" },
      {
        "name": "lockedDopexShares",
        "type": "tuple[]",
        "internalType": "struct IOrangeStrykeLPAutomatorV2_1.LockedDopexShares[]",
        "components": [
          { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
          { "name": "shares", "type": "uint256", "internalType": "uint256" }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "router",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract ISwapRouter"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setDepositCap",
    "inputs": [
      { "name": "_depositCap", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setDepositFeePips",
    "inputs": [
      { "name": "recipient", "type": "address", "internalType": "address" },
      { "name": "pips", "type": "uint24", "internalType": "uint24" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setOwner",
    "inputs": [
      { "name": "user", "type": "address", "internalType": "address" },
      { "name": "approved", "type": "bool", "internalType": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setProxyWhitelist",
    "inputs": [
      { "name": "swapProxy", "type": "address", "internalType": "address" },
      { "name": "approve", "type": "bool", "internalType": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setStrategist",
    "inputs": [
      { "name": "user", "type": "address", "internalType": "address" },
      { "name": "approved", "type": "bool", "internalType": "bool" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "swapInputDelta",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalAssets",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      { "name": "to", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      { "name": "from", "type": "address", "internalType": "address" },
      { "name": "to", "type": "address", "internalType": "address" },
      { "name": "amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeTo",
    "inputs": [
      {
        "name": "newImplementation",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeToAndCall",
    "inputs": [
      {
        "name": "newImplementation",
        "type": "address",
        "internalType": "address"
      },
      { "name": "data", "type": "bytes", "internalType": "bytes" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AdminChanged",
    "inputs": [
      {
        "name": "previousAdmin",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "newAdmin",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BeaconUpgraded",
    "inputs": [
      {
        "name": "beacon",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Deposit",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "assets",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "sharesMinted",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Rebalance",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "ticksMint",
        "type": "tuple[]",
        "indexed": false,
        "internalType": "struct IOrangeStrykeLPAutomatorV2_1.RebalanceTick[]",
        "components": [
          { "name": "tick", "type": "int24", "internalType": "int24" },
          {
            "name": "liquidity",
            "type": "uint128",
            "internalType": "uint128"
          }
        ]
      },
      {
        "name": "ticksBurn",
        "type": "tuple[]",
        "indexed": false,
        "internalType": "struct IOrangeStrykeLPAutomatorV2_1.RebalanceTick[]",
        "components": [
          { "name": "tick", "type": "int24", "internalType": "int24" },
          {
            "name": "liquidity",
            "type": "uint128",
            "internalType": "uint128"
          }
        ]
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Redeem",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "shares",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "assetsWithdrawn",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDepositCap",
    "inputs": [
      {
        "name": "depositCap",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetDepositFeePips",
    "inputs": [
      {
        "name": "depositFeePips",
        "type": "uint24",
        "indexed": false,
        "internalType": "uint24"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetOwner",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetProxyWhitelist",
    "inputs": [
      {
        "name": "proxy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetStrategist",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SetSwapInputDelta",
    "inputs": [
      {
        "name": "swapInputDelta",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Upgraded",
    "inputs": [
      {
        "name": "implementation",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  { "type": "error", "name": "AddressZero", "inputs": [] },
  { "type": "error", "name": "AmountZero", "inputs": [] },
  { "type": "error", "name": "DepositCapExceeded", "inputs": [] },
  { "type": "error", "name": "DepositTooSmall", "inputs": [] },
  { "type": "error", "name": "FeePipsTooHigh", "inputs": [] },
  { "type": "error", "name": "FlashLoan_Unauthorized", "inputs": [] },
  { "type": "error", "name": "InvalidRebalanceParams", "inputs": [] },
  { "type": "error", "name": "MaxTicksReached", "inputs": [] },
  {
    "type": "error",
    "name": "MinAssetsRequired",
    "inputs": [
      { "name": "minAssets", "type": "uint256", "internalType": "uint256" },
      { "name": "actualAssets", "type": "uint256", "internalType": "uint256" }
    ]
  },
  { "type": "error", "name": "MinDepositAssetsTooSmall", "inputs": [] },
  { "type": "error", "name": "ProxyAlreadyWhitelisted", "inputs": [] },
  { "type": "error", "name": "SharesTooSmall", "inputs": [] },
  { "type": "error", "name": "T", "inputs": [] },
  { "type": "error", "name": "TokenAddressMismatch", "inputs": [] },
  { "type": "error", "name": "TokenNotPermitted", "inputs": [] },
  { "type": "error", "name": "Unauthorized", "inputs": [] },
  { "type": "error", "name": "UnsupportedDecimals", "inputs": [] }
] as const;
