import { createConfig, mergeAbis } from "ponder";
import { http } from "viem";
import { Automatorv21ABI } from "./abis/Automatorv21ABI";
import { Automatorv11ABI } from "./abis/Automatorv11ABI";
import { UniswapV3PoolABI } from "./abis/UniswapV3PoolABI";
import { erc20ABI } from "./abis/erc20ABI";
import { OptionMarketABI } from "./abis/OptionMarketABI";
import { PositionManagerABI } from "./abis/PositionManagerABI";
import { LiquidityHandlerABI } from "./abis/LiquidityHandlerABI";

export default createConfig({
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
  contracts: {
    Automatorv21: {
      network: {
        arbitrum: {
          address: ["0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C","0x01E371c500C49beA2fa985334f46A8Dc906253Ea"],
          startBlock: 188249317,
          endBlock: 213059866,
        },
        // tenderly: {
        //   address: ["0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C","0x01E371c500C49beA2fa985334f46A8Dc906253Ea"],
        //   startBlock: 188249317,
        //   endBlock: 213059866,
        // },
      },
      abi: mergeAbis([Automatorv21ABI, Automatorv11ABI]),
    },
    OptionMarket: {
      network: {
        arbitrum: {
          address: ["0xcD697B919AA000378fe429b47eb0fF0D17d3D435", "0x502751c59fEb16959526f1f8aa767D84b028bFbD"],
          startBlock: 297859265,
        },
        tenderly: {
          address: ["0x0DF5faE5a2F67011B8079B31D17c490618aF853e"],
          startBlock: 26497566,
        },
      },
      abi: OptionMarketABI,
      
    },
    PositionManager: {
      network: {
        tenderly: {
          address: ["0xcb5082706331928a7825F898A78d8bcCdfE81FB4"],
          startBlock: 26497566,
        },
        
      },
      abi: PositionManagerABI,
      
    },
    LiquidityHandler: {
      network: {
        tenderly: {
          address: ["0x1953EF3f1ec5fB63576B7f8fdE0Ed3433D1D2a97"],
          startBlock: 26497566,
        },
        
      },
      abi: LiquidityHandlerABI,
      
    },
    UniswapV3Pool: {
      network: "arbitrum",
      abi: UniswapV3PoolABI,
    },
    ERC20: {
      network: "arbitrum",
      abi: erc20ABI,
    },
  },
});
