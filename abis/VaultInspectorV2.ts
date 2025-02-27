export const VaultInspectorV2ABI = [
  {
    type: "function",
    name: "convertSharesToPairAssets",
    inputs: [
      {
        name: "automator",
        type: "address",
        internalType: "contract IOrangeStrykeLPAutomatorV2_1",
      },
      { name: "shares", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "assets", type: "uint256", internalType: "uint256" },
      {
        name: "counterAssets",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "freeAssets",
    inputs: [
      {
        name: "automator",
        type: "address",
        internalType: "contract IOrangeStrykeLPAutomatorV2_1",
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "freePoolPositionInToken01",
    inputs: [
      {
        name: "automator",
        type: "address",
        internalType: "contract IOrangeStrykeLPAutomatorV2_1",
      },
    ],
    outputs: [
      { name: "sumAmount0", type: "uint256", internalType: "uint256" },
      { name: "sumAmount1", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAutomatorPositions",
    inputs: [
      {
        name: "automator",
        type: "address",
        internalType: "contract IOrangeStrykeLPAutomatorV2_1",
      },
    ],
    outputs: [
      {
        name: "balanceDepositAsset",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "balanceCounterAsset",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "rebalanceTicks",
        type: "tuple[]",
        internalType: "struct IOrangeStrykeLPAutomatorV2_1.RebalanceTick[]",
        components: [
          { name: "tick", type: "int24", internalType: "int24" },
          {
            name: "liquidity",
            type: "uint128",
            internalType: "uint128",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTickAllLiquidity",
    inputs: [
      {
        name: "automator",
        type: "address",
        internalType: "contract IOrangeStrykeLPAutomatorV2_1",
      },
      { name: "tick", type: "int24", internalType: "int24" },
    ],
    outputs: [{ name: "", type: "uint128", internalType: "uint128" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTickFreeLiquidity",
    inputs: [
      {
        name: "automator",
        type: "address",
        internalType: "contract IOrangeStrykeLPAutomatorV2_1",
      },
      { name: "tick", type: "int24", internalType: "int24" },
    ],
    outputs: [
      {
        name: "freeLiquidity",
        type: "uint128",
        internalType: "uint128",
      },
    ],
    stateMutability: "view",
  },
  { type: "error", name: "T", inputs: [] },
] as const;
