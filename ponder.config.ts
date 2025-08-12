import { createConfig, mergeAbis } from "ponder";
import { http } from "viem";

import { Automatorv21ABI } from "./abis/Automatorv21ABI";  
import { Automatorv11ABI } from "./abis/Automatorv11ABI";
import { OptionMarketABI } from "./abis/OptionMarketABI";
import { PositionManagerABI } from "./abis/PositionManagerABI";  
import { LiquidityHandlerABI } from "./abis/LiquidityHandlerABI";
import { TVLPreviewABI } from "./abis/TVLPreviewABI";
import { OptionPricingV2ABI } from "./abis/OptionPricingV2ABI";
import { FeeStrategyV2ABI } from "./abis/FeeStrategyV2ABI";
import { AutoExerciseABI } from "./abis/AutoExerciseABI";

export default createConfig({
  networks: {
    // arbitrum: {
    //   chainId: 42161,
    //   transport: http(process.env.PONDER_RPC_URL_42161),
    //   maxRequestsPerSecond: 300,
    // },
    monad: {
      chainId: 10143,
      transport: http(process.env.PONDER_RPC_URL_MONAD),
      maxRequestsPerSecond: 300,
    },
    // tenderly: {
    //   chainId: 8450,
    //   transport: http(process.env.PONDER_RPC_URL_8450),
    //   maxRequestsPerSecond: 300,
    // },
  },
  contracts: {
    Automatorv21: {
      network: {
        monad: {
          address: [
            "0x1ab74D9d5cf6cbC8Ec83Be9842e486DD8F80770D",
            "0x0d83AE1933b21bb96166f7570C18576E3A8a792B",
          ],
          startBlock: 28645200,
        },
      },
      abi: mergeAbis([Automatorv21ABI, Automatorv11ABI]),
    },
    OptionMarket: {
      network: {
        monad: {
          address: ["0x9f7E675B6176b5182e5e2FEf77EA9724530c7a78"],
          startBlock: 28645200,
        },
      },
      abi: OptionMarketABI,
    },
    PositionManager: {
      network: {
        monad: {
          address: ["0xDc8130af677035EC5B6887c6d201321DF34B8dd1"],
          startBlock: 28645200,
        },
      },
      abi: PositionManagerABI,
    },
    LiquidityHandler: {
      network: {
        monad: {
          address: ["0x3D2B3BaCCb4C7450B545D291a183AE4011D92A4f"],
          startBlock: 28645200,
        },
      },
      abi: LiquidityHandlerABI,
    },
    primePool: {
      network: {
        monad: {
          address: ["0x60a336798063396d8f0f398411bad02a762735c4"],
          startBlock: 28645200,
        },
      },
      abi: [
        {
          "inputs": [],
          "name": "slot0",
          "outputs": [
            { "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
            { "internalType": "int24", "name": "tick", "type": "int24" },
            { "internalType": "uint16", "name": "observationIndex", "type": "uint16" },
            { "internalType": "uint16", "name": "observationCardinality", "type": "uint16" },
            { "internalType": "uint16", "name": "observationCardinalityNext", "type": "uint16" },
            { "internalType": "uint8", "name": "feeProtocol", "type": "uint8" },
            { "internalType": "bool", "name": "unlocked", "type": "bool" }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    },
    optionPricing: {
      network: {
        monad: {
          address: ["0x83648A48EF925392c29e93defc613f4Ce8874cc9"],
          startBlock: 28645200,
        },
      },
      abi: OptionPricingV2ABI,
    },
    feeStrategy: {
      network: {
        monad: {
          address: ["0x643Cc4F61E285fB71F892f410cd2a1fE4490b0Bb"],
          startBlock: 28645200,
        },
      },
      abi: FeeStrategyV2ABI,
    },
    AutoExercise: {
      network: {
        monad: {
          address: ["0xfD2558e57a0575d5477fA80b8aA4a9affC6a48f5"],
          startBlock: 28645200,
        },
      },
      abi: AutoExerciseABI,
    },
    WBTC: {
      network: {
        monad: {
          address: ["0xcf5a6076cfa32686c0df13abada2b40dec133f1d"],
          startBlock: 28645200, // Lowered to capture deployment events
        },
      },
      abi: [
        {
          "anonymous": false,
          "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
          ],
          "name": "Transfer",
          "type": "event"
        }
      ]
    },
    USDC: {
      network: {
        monad: {
          address: ["0xf817257fed379853cde0fa4f97ab987181b1e5ea"],
          startBlock: 28645200, // Lowered to capture deployment events
        },
      },
      abi: [
        {
          "anonymous": false,
          "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
          ],
          "name": "Transfer",
          "type": "event"
        }
      ]
    },
  },
  database: {
    kind: "postgres",
    connectionString: process.env.DATABASE_URL,
  },
});