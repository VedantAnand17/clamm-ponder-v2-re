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
    monad: {
      chainId: 10143,
      transport: http(process.env.PONDER_RPC_URL_MONAD),
    },
  },
  contracts: {
    Automatorv21: {
      network: {
        monad: {
          address: [
            "0x477Abf43f0E6899ACdCb9D17474627E54B4C1946",
            "0x0d83AE1933b21bb96166f7570C18576E3A8a792B",
          ],
          startBlock: 25150000, // Lowered to capture LogOptionsMarketInitialized from block 25150193
        },
      },
      abi: mergeAbis([Automatorv21ABI, Automatorv11ABI]),
    },
    OptionMarket: {
      network: {
        monad: {
          address: ["0x8fCc18a604C85475BE9DF68d6C106a1ca26A73cc"],
          startBlock: 25150000, // Lowered to capture LogOptionsMarketInitialized from block 25150193
        },
      },
      abi: OptionMarketABI,
    },
    PositionManager: {
      network: {
        monad: {
          address: ["0x3cDF18a1249c31d1dc9ac8f2FD5Ba3ECA8761753"],
          startBlock: 25150000, // Lowered to capture deployment events
        },
      },
      abi: PositionManagerABI,
    },
    LiquidityHandler: {
      network: {
        monad: {
          address: ["0x680b4678Aff708535BA641A6Dd36B4dFfbF159E2"],
          startBlock: 25150000, // Lowered to capture deployment events
        },
      },
      abi: LiquidityHandlerABI,
    },
    primePool: {
      network: {
        monad: {
          address: ["0x60a336798063396d8f0f398411bad02a762735c4"],
          startBlock: 25150000, // Lowered to capture deployment events
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
          address: ["0xd15A0dfBa2AE002bB35982489e90A466dA0DD5dB"],
          startBlock: 25150000, // Lowered to capture deployment events
        },
      },
      abi: OptionPricingV2ABI,
    },
    feeStrategy: {
      network: {
        monad: {
          address: ["0xFB75d6F7B0F0791ceb19106aCaB593651Db7564a"],
          startBlock: 25150000, // Lowered to capture deployment events
        },
      },
      abi: FeeStrategyV2ABI,
    },
    AutoExercise: {
      network: {
        monad: {
          address: ["0x9e6Da3840f2FE96814c823515D6D0A2f8d01651e"],
          startBlock: 25150000, // Lowered to capture deployment events
        },
      },
      abi: AutoExerciseABI,
    },
    WBTC: {
      network: {
        monad: {
          address: ["0xcf5a6076cfa32686c0df13abada2b40dec133f1d"],
          startBlock: 25150000, // Lowered to capture deployment events
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
          startBlock: 25150000, // Lowered to capture deployment events
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
});