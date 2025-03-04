export const TVLPreviewABI = [
  {
    type: "function",
    name: "liquidityHandlerTvl",
    inputs: [
      {
        name: "liquidityHandlers",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "primePools",
        type: "address[]",
        internalType: "address[]",
      },
      { name: "minTickOverride", type: "int24", internalType: "int24" },
      { name: "maxTickOverride", type: "int24", internalType: "int24" },
    ],
    outputs: [
      {
        name: "tvlInfos",
        type: "tuple[]",
        internalType: "struct TvlPreview.TvlInfo[]",
        components: [
          {
            name: "totalFreeAmount0",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "totalFreeAmount1",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "optionMarketTvl",
    inputs: [
      {
        name: "optionMarkets",
        type: "address[]",
        internalType: "address[]",
      },
      { name: "minOptionId", type: "uint256", internalType: "uint256" },
      { name: "maxOptionId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "tvlInfos",
        type: "tuple[]",
        internalType: "struct TvlPreview.OptionMarketTvlInfo[]",
        components: [
          {
            name: "totalCallPositions",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "totalPutPositions",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "totalCallAssetRemoved",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "totalPutAssetRemoved",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  { type: "error", name: "T", inputs: [] },
] as const;
