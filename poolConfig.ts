export interface PoolConfig {
    address: string;
    chainId: number;
    isToken1Volatile: boolean;
    token0: {
      address: string;
      decimals: number;
      symbol: string;
    };
    token1: {
      address: string;
      decimals: number;
      symbol: string;
    };
  }
  
  export const POOL_CONFIGS: Record<string, PoolConfig> = {
    "MONAD_TESTNET_WETH_USDC": {
      address: "0xe8781Dc41A694c6877449CEFB27cc2C0Ae9D5dbc",
      chainId: 10143, // Arbitrum One
      isToken1Volatile: false, // is WETH token1?
      token0: {
        address: "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37", // WETH on Monad testnet
        decimals: 18,
        symbol: "WETH"
      },
      token1: {
        address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea", // USDC on Monad testnet
        decimals: 6,
        symbol: "USDC"
      }
    },
// "ARBITRUM_WETH_USDC": {
//       address: "0xc6962004f452be9203591991d15f6b388e09e8d0",
//       chainId: 42161, // Arbitrum One
//       isToken1Volatile: false, // is WETH token1?
//       token0: {
//         address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH on Arbitrum
//         decimals: 18,
//         symbol: "WETH"
//       },
//       token1: {
//         address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC on Arbitrum
//         decimals: 6,
//         symbol: "USDC"
//       }
//     },
//     "ARBITRUM_POOL_1": {
//       address: "0xd9e2a1a61B6E61b275cEc326465d417e52C1b95c".toLowerCase(),
//       chainId: 42161, // Arbitrum One
//       isToken1Volatile: false, // is WETH token1?
//       token0: {
//         address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH on Arbitrum
//         decimals: 18,
//         symbol: "WETH"
//       },
//       token1: {
//         address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC on Arbitrum
//         decimals: 6,
//         symbol: "USDC"
//       }
//     },
//     "ARBITRUM_POOL_2": {
//       address: "0xf3Eb87C1F6020982173C908E7eB31aA66c1f0296".toLowerCase(),
//       chainId: 42161, // Arbitrum One
//       isToken1Volatile: false, // is WETH token1?
//       token0: {
//         address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH on Arbitrum
//         decimals: 18,
//         symbol: "WETH"
//       },
//       token1: {
//         address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC on Arbitrum
//         decimals: 6,
//         symbol: "USDC"
//       }
//     },
//     "ARBITRUM_POOL_3": {
//       address: "0x0E4831319A50228B9e450861297aB92dee15B44F".toLowerCase(),
//       chainId: 42161, // Arbitrum One
//       isToken1Volatile: false, // is WETH token1?
//       token0: {
//         address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH on Arbitrum
//         decimals: 18,
//         symbol: "WETH"
//       },
//       token1: {
//         address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC on Arbitrum
//         decimals: 6,
//         symbol: "USDC"
//       }
//     },
//     "ARBITRUM_POOL_4": {
//       address: "0x843aC8dc6D34AEB07a56812b8b36429eE46BDd07".toLowerCase(),
//       chainId: 42161, // Arbitrum One
//       isToken1Volatile: false, // is WETH token1?
//       token0: {
//         address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH on Arbitrum
//         decimals: 18,
//         symbol: "WETH"
//       },
//       token1: {
//         address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC on Arbitrum
//         decimals: 6,
//         symbol: "USDC"
//       }
//     },
//     "ARBITRUM_POOL_5": {
//       address: "0x60a336798063396d8f0f398411bad02a762735c4".toLowerCase(),
//       chainId: 42161, // Arbitrum One
//       isToken1Volatile: false, // is WETH token1?
//       token0: {
//         address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH on Arbitrum
//         decimals: 18,
//         symbol: "WETH"
//       },
//       token1: {
//         address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC on Arbitrum
//         decimals: 6,
//         symbol: "USDC"
//       }
//     }
    // Add other pools...
  };