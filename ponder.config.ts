import { createConfig, mergeAbis } from "ponder";
import { http } from "viem";
import { Automatorv21ABI } from "./abis/Automatorv21ABI";
import { Automatorv11ABI } from "./abis/Automatorv11ABI";
import { UniswapV3PoolABI } from "./abis/UniswapV3PoolABI";
import { erc20ABI } from "./abis/erc20ABI";

export default createConfig({
  networks: {
    arbitrum: {
      chainId: 42161,
      transport: http(process.env.PONDER_RPC_URL_42161),
      maxRequestsPerSecond: 300,
    },
  },
  contracts: {
    Automatorv21: {
      network: "arbitrum",
      abi: mergeAbis([Automatorv21ABI, Automatorv11ABI]),
      address: ["0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C","0x01E371c500C49beA2fa985334f46A8Dc906253Ea"],
      startBlock: 188249317,
      endBlock: 213059866,
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
