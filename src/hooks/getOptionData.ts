import { PublicClient, Address } from "viem";
import { OptionMarketABI } from "../../abis/OptionMarketABI";
import { tickToPrice } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { POOL_CONFIGS } from "../../poolConfig";

export type OptionTick = {
  handler: Address;
  pool: Address;
  hook: Address;
  tickLower: number;
  tickUpper: number;
  liquidityToUse: bigint;
  strike: bigint;
};

export async function getOptionData(
  client: PublicClient,
  marketAddress: Address,
  optionId: bigint,
  tickArrayLen: number
): Promise<OptionTick[]> {
  // Create array of multicall requests for each tick
  const calls = Array.from({ length: tickArrayLen }, (_, i) => ({
    address: marketAddress,
    abi: OptionMarketABI,
    functionName: 'opTickMap',
    args: [optionId, BigInt(i)],
  }));

  // Execute multicall with proper type handling
  const results = await client.multicall({
    contracts: calls,
    allowFailure: false
  }) as unknown as [Address, Address, Address, bigint, bigint, bigint][];

  // Process results with proper typing
  return results.map((result) => {
    const [handler, pool, hook, tickLower, tickUpper, liquidityToUse] = result;

    // Get pool configuration
    const poolAddress = pool.toLowerCase();
    const config = Object.values(POOL_CONFIGS).find(
      (config) => config.address === poolAddress
    );
    if (!config) {
      throw new Error(`Pool config not found for pool ${pool}`);
    }

    // Create Token instances
    const token0 = new Token(
      config.chainId,
      config.token0.address,
      config.token0.decimals,
      config.token0.symbol
    );
    const token1 = new Token(
      config.chainId,
      config.token1.address,
      config.token1.decimals,
      config.token1.symbol
    );

    // Calculate price from tick using Uniswap SDK
    const price = tickToPrice(token0, token1, Number(tickLower));
    
    // Convert price to the correct format
    let strike = BigInt(Math.floor(parseFloat(price.toFixed(18)) * 1e18));

    // If token1 is volatile, invert the price
    if (config.isToken1Volatile) {
      strike = BigInt(1e36) / strike;
    }

    return {
      handler,
      pool,
      hook,
      tickLower: Number(tickLower),
      tickUpper: Number(tickUpper),
      liquidityToUse,
      strike,
    };
  });
}