import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql, eq, and, lt, gt } from "ponder";
import { getAddress } from "viem";

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

export default app;
