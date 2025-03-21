import { createConfig, mergeAbis, factory } from "ponder";
import { http, parseAbiItem } from "viem";
import { Automatorv21ABI } from "./abis/Automatorv21ABI";
import { Automatorv11ABI } from "./abis/Automatorv11ABI";
import { UniswapV3PoolABI } from "./abis/UniswapV3PoolABI";
import { erc20ABI } from "./abis/erc20ABI";
import { OptionMarketABI } from "./abis/OptionMarketABI";
import { PositionManagerABI } from "./abis/PositionManagerABI";
import { LiquidityHandlerABI } from "./abis/LiquidityHandlerABI";
import { OptionPricingV2ABI } from "./abis/OptionPricingV2ABI";
import { FeeStrategyV2ABI } from "./abis/FeeStrategyV2ABI";
import { AutoExerciseABI } from "./abis/AutoExerciseABI";

export default createConfig({
  ordering: "multichain",
  networks: {
    // arbitrum: {
    //   chainId: 42161,
    //   transport: http(process.env.PONDER_RPC_URL_42161),
    //   maxRequestsPerSecond: 300,
    // },
    tenderly: {
      chainId: 8450,
      transport: http(process.env.PONDER_RPC_URL_8450),
      maxRequestsPerSecond: 300,
    },
  },
  // blocks: {
  //   // Automator01APY: {
  //   //   network: "arbitrum",
  //   //   startBlock: 26497566,
  //   //   interval: 10000,
  //   // },
  //   // PoolTVLandOpenInterest: {
  //   //   network: "tenderly",
  //   //   startBlock: 26497566,
  //   //   interval: 100,
  //   // },
  //   AutomatorAssets: {
  //     network: "arbitrum",
  //     startBlock: 310066571,
  //     interval: 10000,
  //   },
  //   tvlInfo: {
  //     network: "tenderly",
  //     startBlock: 26498072,
  //     interval: 1,
  //   },
  // },
  contracts: {
    Automatorv21: {
      network: {
        tenderly: {
          address: [
            "0xcC83bfa612270e89d4f635d0D82787636499ba30",
            "0x882376e99ad0F6dc9B91A7f982e26A5EA1061bF4",
          ],
          startBlock: 27488039,
        },
      },
      abi: mergeAbis([Automatorv21ABI, Automatorv11ABI]),
    },
    OptionMarket: {
      network: {
        tenderly: {
          address: ["0x1D56d9d8885988cAA4481B4432f9EA1FE29CAEcD"],
          startBlock: 27488039,
        },
      },
      abi: OptionMarketABI,
    },
    PositionManager: {
      network: {
        tenderly: {
          address: ["0x8be7bC2FE54fFd5B977725beB72946dDF6b6302A"],
          startBlock: 27488039,
        },
      },
      abi: PositionManagerABI,
    },
    LiquidityHandler: {
      network: {
        tenderly: {
          address: ["0xa1A46BDe565A7f083c8d0a596e8A4fcd5571E9a6"],
          startBlock: 27488039,
        },
      },
      abi: LiquidityHandlerABI,
    },
    primePool: {
      abi: UniswapV3PoolABI,
      network: {
        tenderly: {
          address: ["0xd0b53D9277642d899DF5C87A3966A349A798F224"],
          startBlock: 27488039,
        },
      },
    },
    optionPricing: {
      abi: OptionPricingV2ABI,
      network: {
        tenderly: {
          address: ["0x1b1ed6018C7ea7703ade42D533450629b7Fa1060"],
          startBlock: 27488039,
        },
      },
    },
    feeStrategy: {
      abi: FeeStrategyV2ABI,
      network: {
        tenderly: {
          address: ["0x0DF5faE5a2F67011B8079B31D17c490618aF853e"],
          startBlock: 27488039,
        },
      },
    },
    AutoExercise: {
      abi: AutoExerciseABI,
      network: {
        tenderly: {
          address: ["0xD70f40BEAF7a6920269e337fb58456143197b22E"],
          startBlock: 27488478,
        },
      },
    },
    ERC20: {
      network: "tenderly",
      abi: erc20ABI,
    },
  },
});
