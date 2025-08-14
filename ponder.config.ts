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
          address: [],
          startBlock: 30779229,
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
          address: ["0x18bda3EFe978D982d68cFe688A60faC197dBd7C9"],
          startBlock: 30779229,
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
          address: ["0x5B25b41847CF551686B4598Ca80328546fC1Ed39"],
          startBlock: 30779229,
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
          address: ["0xc775E1F978d1885BAb95615BC3D1Fff08F5c8e62"],
          startBlock: 30779229,
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
          startBlock: 30779229,
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
          address: ["0x4195D0aDc78fF7D5738c70ba6eCA326263D2164D"],
          startBlock: 30779229,
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
          address: ["0xE7d43CFC480231D39132aCB2111E29Ae52D499ea"],
          startBlock: 30779229,
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
          address: ["0x65faE13Db8134BF739098e0692Fc8918D61ad895"],
          startBlock: 30779229,
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
