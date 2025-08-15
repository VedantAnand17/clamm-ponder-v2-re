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
    // tenderly: {
    //   chainId: 8450,
    //   transport: http(process.env.PONDER_RPC_URL_8450),
    //   maxRequestsPerSecond: 300,
    // },
    monad_testnet: {
      chainId: 10143,
      transport: http(process.env.PONDER_RPC_URL_10143),
      maxRequestsPerSecond: 300,
    },
  },
  contracts: {
    Automatorv21: {
      network: {
        monad_testnet: {
          address: [
            "0x477Abf43f0E6899ACdCb9D17474627E54B4C1946",
            "0x0d83AE1933b21bb96166f7570C18576E3A8a792B",
          ],
          startBlock: 30981007,
        },
        // tenderly: {
        //   address: [
        //     "0xcC83bfa612270e89d4f635d0D82787636499ba30",
        //     "0x882376e99ad0F6dc9B91A7f982e26A5EA1061bF4",
        //   ],
        //   startBlock: 27488039,
        // },
      },
      abi: mergeAbis([Automatorv21ABI, Automatorv11ABI]),
    },
    OptionMarket: {
      network: {
        monad_testnet: {
          address: ["0xA685cC2371d9726f70AF75a8F175cDDb7C779602"],
          startBlock: 30981007,
        },
        // tenderly: {
        //   address: ["0x1D56d9d8885988cAA4481B4432f9EA1FE29CAEcD"],
        //   startBlock: 27488039,
        // },
      },
      abi: OptionMarketABI,
    },
    PositionManager: {
      network: {
        monad_testnet: {
          address: ["0xb704D25b195f2BC1789bb05b9926c1C2056B15B3"],
          startBlock: 30981007,
        },
        // tenderly: {
        //   address: ["0x8be7bC2FE54fFd5B977725beB72946dDF6b6302A"],
        //   startBlock: 27488039,
        // },
      },
      abi: PositionManagerABI,
    },
    LiquidityHandler: {
      network: {
        monad_testnet: {
          address: ["0x94d5bBa2D3c70b76A05AE142aA24eAA550167b68"],
          startBlock: 30981007,
        },
        // tenderly: {
        //   address: ["0xa1A46BDe565A7f083c8d0a596e8A4fcd5571E9a6"],
        //   startBlock: 27488039,
        // },
      },
      abi: LiquidityHandlerABI,
    },
    primePool: {
      abi: UniswapV3PoolABI,
      network: {
        monad_testnet: {
          address: ["0xe8781Dc41A694c6877449CEFB27cc2C0Ae9D5dbc"],
          startBlock: 30981007,
        },
        // tenderly: {
        //   address: ["0xd0b53D9277642d899DF5C87A3966A349A798F224"],
        //   startBlock: 27488039,
        // },
      },
    },
    optionPricing: {
      abi: OptionPricingV2ABI,
      network: {
        monad_testnet: {
          address: ["0x114E50C65E4eFeeb6B6E88A7E480a1B7479F93A1"],
          startBlock: 30981007,
        },
        // tenderly: {
        //   address: ["0x1b1ed6018C7ea7703ade42D533450629b7Fa1060"],
        //   startBlock: 27488039,
        // },
      },
    },
    feeStrategy: {
      abi: FeeStrategyV2ABI,
      network: {
        monad_testnet: {
          address: ["0xE9B9cbAFf7bd9C529fC09607c05CBe279637d72b"],
          startBlock: 30981007,
        },
        // tenderly: {
        //   address: ["0x0DF5faE5a2F67011B8079B31D17c490618aF853e"],
        //   startBlock: 27488039,
        // },
      },
    },
    AutoExercise: {
      abi: AutoExerciseABI,
      network: {
        monad_testnet: {
          address: ["0x40F69E05eE74C2983eE050370d686Af4Eec9a1e9"],
          startBlock: 30981007,
        },
        // tenderly: {
        //   address: ["0xD70f40BEAF7a6920269e337fb58456143197b22E"],
        //   startBlock: 27488478,
        // },
      },
    },
    ERC20: {
      network: "monad_testnet",
      abi: erc20ABI,
    },
  },
});
