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

export default createConfig({
  ordering: "multichain",
  networks: {
    arbitrum: {
      chainId: 42161,
      transport: http(process.env.PONDER_RPC_URL_42161),
      maxRequestsPerSecond: 300,
    },
    tenderly: {
      chainId: 8450,
      transport: http(process.env.PONDER_RPC_URL_8450),
      maxRequestsPerSecond: 300,
    },
  },
  blocks: {
    Automator01APY: {
      network: "arbitrum",
      startBlock: 26497566,
      interval: 10000,
    },
    PoolTVLandOpenInterest: {
      network: "tenderly",
      startBlock: 26497566,
      interval: 100,
    },
    AutomatorAssets: {
      network: "arbitrum",
      startBlock: 310066571,
      interval: 10000,
    },
    tvlInfo: {
      network: "tenderly",
      startBlock: 26498072,
      interval: 1,
    },
  },
  contracts: {
    Automatorv21: {
      network: {
        arbitrum: {
          address: [
            "0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C",
            "0x01E371c500C49beA2fa985334f46A8Dc906253Ea",
          ],
          startBlock: 188249317,
          endBlock: 213059866,
        },
        tenderly: {
          address: [
            "0xcc7349861cA35fA0ABf7F3d833498c687F0FFD1e",
            "0x63b63c69b3B5806b0F508D6ac1E9e14Ed1b61f6E",
          ],
          startBlock: 26497566,
        },
      },
      abi: mergeAbis([Automatorv21ABI, Automatorv11ABI]),
    },
    OptionMarket: {
      network: {
        arbitrum: {
          address: [
            "0xcD697B919AA000378fe429b47eb0fF0D17d3D435",
            "0x502751c59fEb16959526f1f8aa767D84b028bFbD",
          ],
          startBlock: 297859265,
        },
        tenderly: {
          address: ["0xd9e33c71D5A405A642C173f8f914F1Bb59009Aaf"],
          startBlock: 26497566,
        },
      },
      abi: OptionMarketABI,
    },
    PositionManager: {
      network: {
        tenderly: {
          address: ["0x5e53fe655b20453bf2E5Fa4079B7EA8C0623b0A5"],
          startBlock: 26497566,
        },
      },
      abi: PositionManagerABI,
    },
    LiquidityHandler: {
      network: {
        tenderly: {
          address: ["0x2Cab86e7b648EbDe5dDFae913Bdb58DA3d723Cd6"],
          startBlock: 26497566,
        },
      },
      abi: LiquidityHandlerABI,
    },
    primePool: {
      abi: UniswapV3PoolABI,
      network: {
        tenderly: {
          address: ["0xa1A46BDe565A7f083c8d0a596e8A4fcd5571E9a6"],
          startBlock: 26497566,
        },
      },
    },
    optionPricing: {
      abi: OptionPricingV2ABI,
      network: {
        arbitrum: {
          address: [
            "0xcD697B919AA000378fe429b47eb0fF0D17d3D435",
            "0x502751c59fEb16959526f1f8aa767D84b028bFbD",
          ],
          startBlock: 297859265,
        },
        tenderly: {
          address: ["0xce4B6cF0A2eb9c7e0cCed9B3c50326e7816157A6"],
          startBlock: 26497566,
        },
      },
      address: factory({
        address: [
          "0xcD697B919AA000378fe429b47eb0fF0D17d3D435",
          "0x502751c59fEb16959526f1f8aa767D84b028bFbD",
          "0x0DF5faE5a2F67011B8079B31D17c490618aF853e",
        ],
        event: parseAbiItem(
          "event LogOptionsMarketInitialized(address _primePool, address _optionPricing, address _dpFee, address _callAsset, address _putAsset)"
        ),
        parameter: "_optionPricing",
      }),
    },
    feeStrategy: {
      abi: FeeStrategyV2ABI,
      network: {
        arbitrum: {
          address: [
            "0xcD697B919AA000378fe429b47eb0fF0D17d3D435",
            "0x502751c59fEb16959526f1f8aa767D84b028bFbD",
          ],
          startBlock: 297859265,
        },
        tenderly: {
          address: ["0x0DF5faE5a2F67011B8079B31D17c490618aF853e"],
          startBlock: 26497566,
        },
      },
      address: factory({
        address: [
          "0xcD697B919AA000378fe429b47eb0fF0D17d3D435",
          "0x502751c59fEb16959526f1f8aa767D84b028bFbD",
          "0x0DF5faE5a2F67011B8079B31D17c490618aF853e",
        ],
        event: parseAbiItem(
          "event LogOptionsMarketInitialized(address _primePool, address _optionPricing, address _dpFee, address _callAsset, address _putAsset)"
        ),
        parameter: "_dpFee",
      }),
    },
    ERC20: {
      network: "arbitrum",
      abi: erc20ABI,
    },
  },
});
