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


// == Logs ==
//   sr 0xa8B173d556eEf21eBF4bBb92F26a27D6C05E9220
//   aetb 0xd3EAFB0A028e5b0bA565e9322b032606CfF8c23c
//   srs 0x0f0D42Ef3A6Fb91E0b783c2e2863B8294CE29747
//   handler 0xD7d70eAFab2E8E80c8B4c28B6065716680713701
//   opl 0xAb92081F35DD020a3a0ABe5065Eb810d608e2706
//   pm 0xeA8e4475851BFae7Ca4DaFaadd43fe89B68fa265
//   feeStrategy 0xd8a85c03025D794355DeF3E69a2ff7904E2E6c5E
//   om 0x8d520B8e90e9924B6a8bC4517AB34773122f4D6A

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
            "0x6142969813A7b275A51A40832A556C9A54c1D737",
            "0xcB8d69623e86B8ef17Aabf0D0763ecac3973D8AC",
          ],
          startBlock: 31141544,
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
          address: ["0x8d520B8e90e9924B6a8bC4517AB34773122f4D6A"],
          startBlock: 31141544,
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
          address: ["0xeA8e4475851BFae7Ca4DaFaadd43fe89B68fa265"],
          startBlock: 31141544,
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
          address: ["0xD7d70eAFab2E8E80c8B4c28B6065716680713701"],
          startBlock: 31141544,
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
          startBlock: 31141544,
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
          address: ["0xAb92081F35DD020a3a0ABe5065Eb810d608e2706"],
          startBlock: 31141544,
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
          address: ["0xd8a85c03025D794355DeF3E69a2ff7904E2E6c5E"],
          startBlock: 31141544,
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
          startBlock: 31141544,
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