import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql, eq, and, lt, gt } from "ponder";
import { getAddress } from "viem";
import { getSpecificStrategy, getAllStrategies } from "../../strategies";

const app = new Hono();

app.use("/sql/*", client({ db, schema }));

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

app.get("/hello", (c) => {
  return c.json({ message: "Hello, World!" });
});

app.get("/expiring-options/:minutes?", async (c) => {
  const minutes =
    c.req.param("minutes") === undefined
      ? 50
      : parseInt(c.req.param("minutes")!);
  const fiveMinutesFromNow = Math.floor(Date.now() / 1000) + 60 * minutes; // current unix timestamp + X minutes
  const currentTime = Math.floor(Date.now() / 1000);

  const result = await db
    .select({
      // Token data
      tokenId: schema.erc721_token.id,
      market: schema.erc721_token.market,
      owner: schema.erc721_token.owner,
      createdAt: schema.erc721_token.createdAt,
      expiry: schema.erc721_token.expiry,
      isCall: schema.erc721_token.isCall,
      opTickArrayLen: schema.erc721_token.opTickArrayLen,
      chainId: schema.erc721_token.chainId,
      // Internal option data
      handler: schema.internal_options.handler,
      pool: schema.internal_options.pool,
      hook: schema.internal_options.hook,
      liquidityAtOpen: schema.internal_options.liquidityAtOpen,
      liquidityExercised: schema.internal_options.liquidityExercised,
      liquiditySettled: schema.internal_options.liquiditySettled,
      liquidityAtLive: schema.internal_options.liquidityAtLive,
      strike: schema.internal_options.strike,
      index: schema.internal_options.index,
      tickLower: schema.internal_options.tickLower,
      tickUpper: schema.internal_options.tickUpper,
      // Trader account data
      exerciseDelegate: schema.trader_account.exerciseDelegate,
    })
    .from(schema.erc721_token)
    .innerJoin(
      schema.internal_options,
      and(
        eq(schema.erc721_token.id, schema.internal_options.tokenId),
        eq(schema.erc721_token.market, schema.internal_options.optionMarket),
        eq(schema.erc721_token.chainId, schema.internal_options.chainId)
      )
    )
    .innerJoin(
      schema.trader_account,
      and(
        eq(schema.erc721_token.owner, schema.trader_account.address),
        eq(schema.erc721_token.chainId, schema.trader_account.chainId)
      )
    )
    .where(
      and(
        lt(schema.erc721_token.expiry, fiveMinutesFromNow),
        gt(schema.erc721_token.expiry, currentTime),
        eq(schema.trader_account.exerciseDelegate, true)
      )
    );

  // Convert BigInt values to strings
  const serializedResult = result.map((item) => ({
    ...item,
    tokenId: item.tokenId?.toString() || "",
    liquidityAtOpen: item.liquidityAtOpen?.toString() || "0",
    liquidityExercised: item.liquidityExercised?.toString() || "0",
    liquiditySettled: item.liquiditySettled?.toString() || "0",
    liquidityAtLive: item.liquidityAtLive?.toString() || "0",
    strike: item.strike?.toString(),
    index: item.index?.toString(),
    tickLower: item.tickLower?.toString(),
    tickUpper: item.tickUpper?.toString(),
  }));

  // Group the results by token, filtering out fully exercised options
  const groupedOptions = serializedResult.reduce<
    Record<
      string,
      {
        tokenId: string;
        market: string;
        owner: string;
        createdAt: number;
        expiry: number;
        isCall: boolean;
        opTickArrayLen: number;
        chainId: number;
        exerciseDelegate: boolean;
        internalOptions: any[];
      }
    >
  >((acc, curr) => {
    // Convert strings back to BigInt for proper comparison
    const liquidityAtOpenBN = BigInt(curr.liquidityAtOpen || "0");
    const liquidityExercisedBN = BigInt(curr.liquidityExercised || "0");

    if (liquidityAtOpenBN === liquidityExercisedBN) {
      return acc;
    }

    const {
      tokenId,
      market,
      owner,
      createdAt,
      expiry,
      isCall,
      opTickArrayLen,
      chainId,
      exerciseDelegate,
      ...internalOption
    } = curr;

    if (!acc[tokenId]) {
      acc[tokenId] = {
        tokenId,
        market: market || "",
        owner: owner || "",
        createdAt: createdAt || 0,
        expiry: expiry || 0,
        isCall: isCall || false,
        opTickArrayLen: opTickArrayLen || 0,
        chainId: chainId || 0,
        exerciseDelegate: exerciseDelegate || false,
        internalOptions: [],
      };
    }

    acc[tokenId]?.internalOptions.push(internalOption);
    return acc;
  }, {});

  // Filter out tokens that have no eligible internal options
  const filteredGroupedOptions = Object.values(groupedOptions).filter(
    (token) => token.internalOptions.length > 0
  );

  return c.json({ options: filteredGroupedOptions });
});

app.get("/expired-options", async (c) => {
  const currentTime = Math.floor(Date.now() / 1000);

  const result = await db
    .select({
      // Token data
      tokenId: schema.erc721_token.id,
      market: schema.erc721_token.market,
      owner: schema.erc721_token.owner,
      createdAt: schema.erc721_token.createdAt,
      expiry: schema.erc721_token.expiry,
      isCall: schema.erc721_token.isCall,
      opTickArrayLen: schema.erc721_token.opTickArrayLen,
      chainId: schema.erc721_token.chainId,
      // Internal option data
      handler: schema.internal_options.handler,
      pool: schema.internal_options.pool,
      hook: schema.internal_options.hook,
      liquidityAtOpen: schema.internal_options.liquidityAtOpen,
      liquidityExercised: schema.internal_options.liquidityExercised,
      liquiditySettled: schema.internal_options.liquiditySettled,
      liquidityAtLive: schema.internal_options.liquidityAtLive,
      strike: schema.internal_options.strike,
      index: schema.internal_options.index,
      tickLower: schema.internal_options.tickLower,
      tickUpper: schema.internal_options.tickUpper,
    })
    .from(schema.erc721_token)
    .innerJoin(
      schema.internal_options,
      and(
        eq(schema.erc721_token.id, schema.internal_options.tokenId),
        eq(schema.erc721_token.market, schema.internal_options.optionMarket),
        eq(schema.erc721_token.chainId, schema.internal_options.chainId)
      )
    )
    .where(lt(schema.erc721_token.expiry, currentTime));

  // Convert BigInt values to strings for serialization
  const serializedResult = result.map((item) => ({
    ...item,
    tokenId: item.tokenId?.toString() || "",
    liquidityAtOpen: item.liquidityAtOpen?.toString() || "0",
    liquidityExercised: item.liquidityExercised?.toString() || "0",
    liquiditySettled: item.liquiditySettled?.toString() || "0",
    liquidityAtLive: item.liquidityAtLive?.toString() || "0",
    strike: item.strike?.toString(),
    index: item.index?.toString(),
    tickLower: item.tickLower?.toString(),
    tickUpper: item.tickUpper?.toString(),
  }));

  // Group the results by token, filtering out fully exercised options
  const groupedOptions = serializedResult.reduce<
    Record<
      string,
      {
        tokenId: string;
        market: string;
        owner: string;
        createdAt: number;
        expiry: number;
        isCall: boolean;
        opTickArrayLen: number;
        chainId: number;
        internalOptions: any[];
      }
    >
  >((acc, curr) => {
    // Skip if liquidityAtOpen equals liquidityExercised + Settled (fully closed)
    // Convert strings back to BigInt for proper comparison
    const liquidityAtOpenBN = BigInt(curr.liquidityAtOpen || "0");
    const liquidityExercisedBN = BigInt(curr.liquidityExercised || "0");
    const liquiditySettledBN = BigInt(curr.liquiditySettled || "0");

    if (liquidityAtOpenBN === liquidityExercisedBN + liquiditySettledBN) {
      return acc;
    }

    const {
      tokenId,
      market,
      owner,
      createdAt,
      expiry,
      isCall,
      opTickArrayLen,
      chainId,
      ...internalOption
    } = curr;

    if (!acc[tokenId]) {
      acc[tokenId] = {
        tokenId,
        market: market || "",
        owner: owner || "",
        createdAt: createdAt || 0,
        expiry: expiry || 0,
        isCall: isCall || false,
        opTickArrayLen: opTickArrayLen || 0,
        chainId: chainId || 0,
        internalOptions: [],
      };
    }

    acc[tokenId]?.internalOptions.push(internalOption);
    return acc;
  }, {});

  // Filter out tokens that have no eligible internal options
  const filteredGroupedOptions = Object.values(groupedOptions).filter(
    (token) => token.internalOptions.length > 0
  );

  return c.json({ options: filteredGroupedOptions });
});

app.get("/get-strategy", async (c) => {
  const chainId = c.req.query("chainId")
    ? parseInt(c.req.query("chainId"))
    : undefined;
  const address = c.req.query("address") as string | undefined;

  // Select fields for strategy queries
  const strategyFields = {
    address: schema.strategy.address,
    chainId: schema.strategy.chainId,
    strategist: schema.strategy.strategist,
    owner: schema.strategy.owner,
    pool: schema.strategy.pool,
    router: schema.strategy.router,
    pool_tick_spacing: schema.strategy.pool_tick_spacing,
    balancer_vault: schema.strategy.balancer_vault,
    asset: schema.strategy.asset,
    counter: schema.strategy.counter,
    deposit_fee_pips: schema.strategy.deposit_fee_pips,
    position_manager: schema.strategy.position_manager,
    liquidity_handler: schema.strategy.liquidity_handler,
  };

  // Case 1: Specific strategy by chainId and/or address
  if (chainId || address) {
    // Get strategy from strategies.ts
    const strategyConfig = getSpecificStrategy(chainId, address);

    // If strategy doesn't exist in strategies.ts, return 404
    if (!strategyConfig) {
      return c.json({ error: "Strategy not found in configuration" }, 404);
    }

    // Build database query based on provided parameters
    let dbQuery = db.select(strategyFields).from(schema.strategy);

    if (chainId && address) {
      dbQuery = dbQuery.where(
        and(
          eq(schema.strategy.chainId, chainId),
          eq(schema.strategy.address, address)
        )
      );
    } else if (chainId) {
      dbQuery = dbQuery.where(eq(schema.strategy.chainId, chainId));
    } else if (address) {
      dbQuery = dbQuery.where(eq(schema.strategy.address, address));
    }

    const dbStrategies = await dbQuery;

    // If no matching strategies in database, return 404
    if (dbStrategies.length === 0) {
      return c.json(
        { error: "Strategy exists in configuration but not in database" },
        404
      );
    }

    // Convert BigInt values to strings in the database results
    const serializedDbStrategies = dbStrategies.map((strategy) => ({
      ...strategy,
      pool_tick_spacing: strategy.pool_tick_spacing?.toString(),
      deposit_fee_pips: strategy.deposit_fee_pips?.toString(),
    }));

    // If we have a specific strategy (both chainId and address), return it directly
    if (chainId && address && serializedDbStrategies.length === 1) {
      return c.json({
        config: strategyConfig,
        onchainData: serializedDbStrategies[0],
      });
    }

    // Otherwise, return all matching strategies
    return c.json({
      strategies: serializedDbStrategies.map((dbStrategy) => ({
        config: strategyConfig,
        onchainData: dbStrategy,
      })),
    });
  }

  // Case 2: Get all strategies
  const allStrategyConfigs = getAllStrategies();

  // Get all strategies from database
  const dbStrategies = await db.select(strategyFields).from(schema.strategy);

  // Convert BigInt values to strings
  const serializedDbStrategies = dbStrategies.map((strategy) => ({
    ...strategy,
    pool_tick_spacing: strategy.pool_tick_spacing?.toString(),
    deposit_fee_pips: strategy.deposit_fee_pips?.toString(),
  }));

  // Create a map of database strategies by chainId and address
  const dbStrategyMap: Record<number, Record<string, any>> = {};

  for (const strategy of serializedDbStrategies) {
    if (!dbStrategyMap[strategy.chainId]) {
      dbStrategyMap[strategy.chainId] = {};
    }
    dbStrategyMap[strategy.chainId][strategy.address] = strategy;
  }

  // Combine strategy configs with database data, only including strategies that exist in both
  const combinedStrategies: any[] = [];

  Object.entries(allStrategyConfigs).forEach(([chainIdStr, chainData]) => {
    const chainId = Number(chainIdStr);
    const strategies = chainData.data.strategies;

    Object.entries(strategies).forEach(([address, config]) => {
      // Only include if strategy exists in database
      if (dbStrategyMap[chainId]?.[address]) {
        combinedStrategies.push({
          chainId,
          address,
          config,
          onchainData: dbStrategyMap[chainId][address],
        });
      }
    });
  });

  return c.json({ strategies: combinedStrategies });
});

app.get("/pool-liquidity/:poolAddress", async (c) => {
  const poolAddress = c.req.param("poolAddress");

  if (!poolAddress) {
    return c.json({ error: "Pool address is required" }, 400);
  }

  try {
    // Validate the pool address format
    const formattedPoolAddress = getAddress(poolAddress);

    // Get liquidity data using the getLiquidityByTickRanges function
    const liquidityData = await getLiquidityByTickRanges(formattedPoolAddress);

    // return c.json(liquidityData);

    return c.json({
      poolAddress: formattedPoolAddress,
      liquidityByTickRanges: liquidityData,
    });
  } catch (error) {
    console.error("Error in pool-liquidity endpoint:", error);
    return c.json(
      {
        error: "Failed to fetch liquidity data",
        message: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

async function getLiquidityByTickRanges(poolAddress: string) {
  try {
    // Query user_liquidity_position for the specified pool
    const positions = await db
      .select({
        tick_lower: schema.user_liquidity_position.tick_lower,
        tick_upper: schema.user_liquidity_position.tick_upper,
        total_liquidity: schema.user_liquidity_position.total_liquidity,
      })
      .from(schema.user_liquidity_position)
      .where(
        eq(schema.user_liquidity_position.pool, poolAddress as `0x${string}`)
      );
    //return positions.length;

    console.log(`Found ${positions.length} positions for pool ${poolAddress}`);

    // Group positions by tick ranges and sum total_liquidity
    const liquidityMap = new Map<string, bigint>();

    for (const position of positions) {
      // Skip positions with null/undefined values
      if (
        position.tick_lower === null ||
        position.tick_upper === null ||
        position.total_liquidity === null
      ) {
        console.log("Skipping position with null values:", position);
        return "111";
      }

      const key = `${position.tick_lower}_${position.tick_upper}`;
      const currentSum = liquidityMap.get(key) || 0n;

      try {
        // Safely convert the total_liquidity to BigInt
        const liquidityValue = BigInt(String(position.total_liquidity));
        liquidityMap.set(key, currentSum + liquidityValue);
      } catch (error) {
        console.error(
          `Error converting liquidity to BigInt: ${position.total_liquidity}`,
          error
        );
        // Continue processing other positions
      }
    }

    // Format the result as an array of objects
    const totalLiquidity = Array.from(liquidityMap.entries()).map(
      ([key, sum]) => {
        const [tick_lower, tick_upper] = key.split("_").map(Number);
        return {
          tick_lower,
          tick_upper,
          sumOfTotalLiquidity: sum.toString(),
        };
      }
    );

    return totalLiquidity;
  } catch (error) {
    console.error("Error in getLiquidityByTickRanges:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return [];
  }
}

app.get("/get-markets", async (c) => {
  try {
    // Query all option markets
    const markets = await db
      .select({
        address: schema.option_markets.address,
        chainId: schema.option_markets.chainId,
        name: schema.option_markets.name,
        symbol: schema.option_markets.symbol,
        primePool: schema.option_markets.primePool,
        optionPricing: schema.option_markets.optionPricing,
        dpFee: schema.option_markets.dpFee,
        callAsset: schema.option_markets.callAsset,
        putAsset: schema.option_markets.putAsset,
      })
      .from(schema.option_markets);

    return c.json({ markets });
  } catch (error) {
    console.error("Error in get-markets endpoint:", error);
    return c.json(
      {
        error: "Failed to fetch option markets data",
        message: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.get("/get-market/:address", async (c) => {
  const marketAddress = c.req.param("address");

  if (!marketAddress) {
    return c.json({ error: "Market address is required" }, 400);
  }

  try {
    // Validate the market address format
    const formattedMarketAddress = getAddress(marketAddress);

    // Query the specific option market
    const market = await db
      .select({
        address: schema.option_markets.address,
        chainId: schema.option_markets.chainId,
        name: schema.option_markets.name,
        symbol: schema.option_markets.symbol,
        primePool: schema.option_markets.primePool,
        optionPricing: schema.option_markets.optionPricing,
        dpFee: schema.option_markets.dpFee,
        callAsset: schema.option_markets.callAsset,
        putAsset: schema.option_markets.putAsset,
      })
      .from(schema.option_markets)
      .where(
        eq(
          schema.option_markets.address,
          formattedMarketAddress as `0x${string}`
        )
      )
      .limit(1);

    if (market.length === 0) {
      return c.json({ error: "Option market not found" }, 404);
    }

    // Get the optionPricing data for this market
    const pricingData = await db
      .select({
        ttlIV: schema.optionPricing.ttlIV,
      })
      .from(schema.optionPricing)
      .where(
        eq(
          schema.optionPricing.optionPricing,
          (market[0]?.optionPricing || "") as `0x${string}`
        )
      )
      .limit(1);

    // Combine the market data with the pricing data
    const marketWithPricing = market[0]
      ? {
          ...market[0],
          ttlIV: pricingData.length > 0 ? pricingData[0].ttlIV : null,
        }
      : null;

    if (!marketWithPricing) {
      return c.json({ error: "Option market data is incomplete" }, 404);
    }

    return c.json({ market: marketWithPricing });
  } catch (error) {
    console.error("Error in get-market endpoint:", error);
    return c.json(
      {
        error: "Failed to fetch option market data",
        message: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

export default app;
