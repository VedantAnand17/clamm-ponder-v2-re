export interface StrategyAddressConfig {
  name: string;
  description: string;
  params?: Record<string, any>;
}

export interface StrategyData {
  strategies: Record<string, StrategyAddressConfig>;
}

export interface ChainData {
  data: StrategyData;
}

export const chainData: Record<number, ChainData> = {
  42161: {
    data: {
      strategies: {
        "0x01e371c500c49bea2fa985334f46a8dc906253ea": {
          name: "ETH-USDC Covered Call",
          description: "Ethereum mainnet ETH-USDC covered call strategy",
        },
      },
    },
  },
  137: {
    data: {
      strategies: {
        "0x5678000000000000000000000000000000000000": {
          name: "MATIC-USDC Covered Call",
          description: "Polygon MATIC-USDC covered call strategy",
        },
      },
    },
  },
  1: {
    data: {
      strategies: {
        "0x1234000000000000000000000000000000000000": {
          name: "ETH-USDC Put Selling",
          description: "Ethereum mainnet ETH-USDC put selling strategy",
        },
        // Note: In the original data, this address is the same as the one above
        // In a real implementation, you would want unique addresses
        "0x9876000000000000000000000000000000000000": {
          name: "ETH-USDC Bull Call Spread",
          description: "Ethereum mainnet ETH-USDC bull call spread strategy",
        },
      },
    },
  },
};

// Helper functions for the new data structure
export const getSpecificStrategy = (
  chainId?: number,
  address?: string
): StrategyAddressConfig | null => {
  // If both chainId and address are provided, return the specific strategy
  if (chainId && address) {
    return chainData[chainId]?.data.strategies?.[address] || null;
  }

  // If only chainId is provided, return all strategies for that chain
  if (chainId) {
    return chainData[chainId]?.data.strategies || null;
  }

  // If only address is provided, search across all chains
  if (address) {
    for (const chainIdKey in chainData) {
      const strategy =
        chainData[Number(chainIdKey)]?.data.strategies?.[address];
      if (strategy) {
        return strategy;
      }
    }
  }

  return null;
};

export const getAllStrategies = (): Record<number, ChainData> => {
  return chainData;
};
