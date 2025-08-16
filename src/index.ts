import { ponder } from "ponder:registry";
import {
  account,
  allowance,
  approvalEvent,
  depositCapEvent,
  depositEvent,
  erc721_token,
  erc721TransferEvent,
  owner,
  rebalanceEvent,
  redeemEvent,
  setOwnerEvents,
  strategist,
  strategy,
  trader_account,
  transferEvent,
  mintOptionEvent,
  trader_market_position,
  option_markets,
  exerciseOptionEvent,
  settleOptionEvent,
  lp_account,
  mint_position_event,
  user_liquidity_position,
  burn_position_event,
  use_position_event,
  unuse_position_event,
  donation_event,
  premium_collection_event,
  hook_update_event,
  global_hook_update_event,
  handler_pause_event,
  liquidity_handler,
  internal_options,
  primePool,
  feeStrategy,
  feeStrategyToOptionMarkets,
} from "ponder:schema";
import { bigint, replaceBigInts } from "ponder";
import { initialiseStrategyData } from "./hooks/initialiseStrategyData";
import { getStrategyBalance } from "./hooks/getStrategyBalance";
import { getOptionData } from "./hooks/getOptionData";
import { OptionMarketABI } from "../abis/OptionMarketABI";
import { UniswapV3PoolABI } from "../abis/UniswapV3PoolABI";
import { PublicClient } from "viem";
import { FeeStrategyV2ABI } from "../abis/FeeStrategyV2ABI";

ponder.on("Automatorv21:Transfer", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db
    .insert(account)
    .values({
      address: event.args.from,
      chainId,
      balance: 0n,
      isOwner: false,
    })
    .onConflictDoUpdate((row) => ({
      balance: row.balance - event.args.value,
    }));

  await context.db
    .insert(account)
    .values({
      address: event.args.to,
      chainId,
      balance: 0n,
      isOwner: false,
    })
    .onConflictDoUpdate((row) => ({
      balance: row.balance + event.args.value,
    }));

  await context.db.insert(transferEvent).values({
    id: event.log.id,
    chainId,
    value: event.args.value,
    timestamp: Number(event.block.timestamp),
    from: event.args.from,
    to: event.args.to,
  });
});

ponder.on("Automatorv21:Approval", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db
    .insert(allowance)
    .values({
      spender: event.args.spender,
      owner: event.args.owner,
      chainId,
      value: event.args.value,
    })
    .onConflictDoUpdate({ value: event.args.value });

  await context.db.insert(approvalEvent).values({
    id: event.log.id,
    chainId,
    value: event.args.value,
    timestamp: Number(event.block.timestamp),
    owner: event.args.owner,
    spender: event.args.spender,
  });
});

ponder.on("Automatorv21:Rebalance", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  const strategy_data = await context.db.find(strategy, {
    address: event.log.address,
    chainId,
  });

  if (!strategy_data) {
    throw new Error(`Strategy not found: ${event.log.address}`);
  }

  const balancesAfter = await getStrategyBalance(
    context.client as PublicClient,
    event.log.address,
    { asset: strategy_data.asset, counter: strategy_data.counter },
    { blockNumber: event.block.number },
  );

  await context.db.insert(rebalanceEvent).values({
    id: event.log.id,
    chainId,
    strategy: event.log.address,
    timestamp: Number(event.block.timestamp),
    current_tick: Number(1111),
    strategist: event.args.sender,
    ticks_burn: replaceBigInts(event.args.ticksBurn, String),
    ticks_mint: replaceBigInts(event.args.ticksMint, String),
    asset_balance_after: balancesAfter.asset_balance,
    counter_balance_after: balancesAfter.counter_balance,
  });
});

ponder.on("Automatorv21:DepositCapSet", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(depositCapEvent).values({
    id: event.log.id,
    chainId,
    strategy: event.log.address,
    timestamp: Number(event.block.timestamp),
    owner: event.transaction.from,
    deposit_cap: event.args.depositCap,
  });

  await context.db
    .insert(owner)
    .values({
      address: event.transaction.from,
      chainId,
    })
    .onConflictDoUpdate({ address: event.transaction.from });

  const strategyData = await initialiseStrategyData(
    context.client as PublicClient,
    event.log.address,
    context.contracts.Automatorv21.abi,
  );

  await context.db
    .insert(strategy)
    .values({
      address: event.log.address,
      chainId,
      owner: event.transaction.from,
      ...strategyData,
    })
    .onConflictDoUpdate({ owner: event.transaction.from });
});

ponder.on("Automatorv21:SetDepositCap", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(depositCapEvent).values({
    id: event.log.id,
    chainId,
    strategy: event.log.address,
    timestamp: Number(event.block.timestamp),
    owner: event.transaction.from,
    deposit_cap: event.args.depositCap,
  });

  await context.db
    .insert(owner)
    .values({
      address: event.transaction.from,
      chainId,
    })
    .onConflictDoUpdate((row) => ({
      address: event.transaction.from,
    }));

  await context.db
    .insert(strategy)
    .values({
      address: event.log.address,
      chainId,
      owner: event.transaction.from,
    })
    .onConflictDoUpdate((row) => ({
      owner: event.transaction.from,
    }));
});

ponder.on("Automatorv21:SetOwner", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(setOwnerEvents).values({
    id: event.log.id,
    chainId,
    strategy: event.log.address,
    caller: event.transaction.from,
    owner: event.args.user,
    approved: event.args.approved,
    timestamp: Number(event.block.timestamp),
  });

  if (event.args.approved) {
    await context.db
      .insert(owner)
      .values({
        address: event.args.user,
        chainId,
      })
      .onConflictDoUpdate((row) => ({
        address: event.args.user,
      }));

    await context.db
      .insert(strategy)
      .values({
        address: event.log.address,
        chainId,
        owner: event.args.user,
      })
      .onConflictDoUpdate((row) => ({
        owner: event.args.user,
      }));
  }
});

ponder.on("Automatorv21:Deposit", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(depositEvent).values({
    id: event.log.id,
    chainId,
    strategy: event.log.address,
    user: event.args.sender,
    amount: event.args.assets,
    shares: event.args.sharesMinted,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("Automatorv21:Redeem", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(redeemEvent).values({
    id: event.log.id,
    chainId,
    strategy: event.log.address,
    user: event.args.sender,
    amount: event.args.assetsWithdrawn,
    shares: event.args.shares,
    timestamp: Number(event.block.timestamp),
  });
});

// option market

ponder.on("OptionMarket:Transfer", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db
    .insert(trader_account)
    .values({
      address: event.args.from,
      chainId,
    })
    .onConflictDoNothing();

  await context.db
    .insert(trader_account)
    .values({
      address: event.args.to,
      chainId,
    })
    .onConflictDoNothing();

  // Check if this is a mint (transfer from zero address)
  const isFirstTransfer =
    event.args.from === "0x0000000000000000000000000000000000000000";

  if (isFirstTransfer) {
    // For mints, create the token record if it doesn't exist
    await context.db
      .insert(erc721_token)
      .values({
        id: event.args.id,
        createdAt: Number(event.block.timestamp),
        chainId,
        market: event.log.address,
        owner: event.args.to,
        // Set default values for other required fields
        opTickArrayLen: 0, // Will be updated by LogMintOption event
        isCall: false, // Will be updated by LogMintOption event
        expiry: 0, // Will be updated by LogMintOption event
        premiumAmount: 0n, // Will be updated by LogMintOption event
        protocolFees: 0n, // Will be updated by LogMintOption event
      })
      .onConflictDoNothing();
  } else {
    // For regular transfers, update the existing record
    try {
      await context.db
        .update(erc721_token, {
          id: event.args.id,
          market: event.log.address,
          chainId: context.network.chainId,
        })
        .set({ owner: event.args.to });
    } catch (error) {
      console.error(`Error updating token ${event.args.id} ownership:`, error);

      // If update fails, try to create the record
      await context.db
        .insert(erc721_token)
        .values({
          id: event.args.id,
          createdAt: Number(event.block.timestamp),
          chainId,
          market: event.log.address,
          owner: event.args.to,
          // Set default values for other required fields
          opTickArrayLen: 0,
          isCall: false,
          expiry: 0,
          premiumAmount: 0n,
          protocolFees: 0n,
        })
        .onConflictDoNothing();
    }
  }

  await context.db.insert(erc721TransferEvent).values({
    id: event.log.id,
    chainId,
    from: event.args.from,
    to: event.args.to,
    token: event.args.id,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("OptionMarket:LogMintOption", async ({ event, context }) => {
  const { client, db } = context;
  const user = event.args.user;
  const tokenId = event.args.tokenId;
  const isCall = event.args.isCall;
  const chainId = Number(context.network.chainId);

  // Get option data first
  const opData = await client.readContract({
    abi: OptionMarketABI,
    address: event.log.address,
    functionName: "opData",
    args: [tokenId],
  });

  const opTickArrayLen = Number(opData[0]);

  // Create erc721_token record with all fields properly set
  await context.db
    .insert(erc721_token)
    .values({
      id: BigInt(tokenId),
      createdAt: Number(event.block.timestamp),
      chainId,
      market: event.log.address,
      owner: user,
      opTickArrayLen,
      isCall: event.args.isCall,
      expiry: Number(opData[3]),
      premiumAmount: event.args.premiumAmount,
      protocolFees: event.args.protocolFees,
    })
    .onConflictDoNothing();

  await context.db
    .update(erc721_token, {
      id: BigInt(tokenId),
      market: event.log.address,
      chainId: context.network.chainId,
    })
    .set({
      owner: user,
      opTickArrayLen: Number(opData[0]),
      isCall: event.args.isCall,
      expiry: Number(opData[3]),
      premiumAmount: event.args.premiumAmount,
      protocolFees: event.args.protocolFees,
    });

  // Get option ticks data
  const optionTicks = await getOptionData(
    client as PublicClient,
    event.log.address,
    BigInt(tokenId),
    opTickArrayLen,
  );

  // Create internal_options records
  await Promise.all(
    optionTicks.map((optionTick, i) =>
      db.insert(internal_options).values({
        handler: optionTick.handler,
        pool: optionTick.pool,
        optionMarket: event.log.address,
        tokenId: BigInt(tokenId),
        index: i,
        chainId,
        hook: optionTick.hook,
        liquidityAtOpen: optionTick.liquidityToUse,
        liquidityAtLive: optionTick.liquidityToUse,
        liquidityExercised: 0n,
        liquiditySettled: 0n,
        tickLower: optionTick.tickLower,
        tickUpper: optionTick.tickUpper,
        strike: optionTick.strike,
      }),
    ),
  );

  await context.db
    .insert(trader_account)
    .values({
      address: user,
      chainId,
    })
    .onConflictDoNothing();

  await context.db.insert(mintOptionEvent).values({
    id: event.log.id,
    chainId,
    market: event.log.address,
    timestamp: Number(event.block.timestamp),
    user,
    optionId: tokenId,
    isCall,
    premiumAmount: event.args.premiumAmount,
    totalAssetWithdrawn: event.args.totalAssetWithdrawn,
    protocolFees: event.args.protocolFees,
  });

  await context.db
    .insert(trader_market_position)
    .values({
      trader: user,
      market: event.log.address,
      chainId,
    })
    .onConflictDoNothing();
});

ponder.on("OptionMarket:LogExerciseOption", async ({ event, context }) => {
  const { client, db } = context;
  const chainId = Number(context.network.chainId);

  // Get option data to know how many ticks to check
  const opData = await client.readContract({
    abi: OptionMarketABI,
    address: event.log.address,
    functionName: "opData",
    args: [event.args.tokenId],
  });

  const opTickArrayLen = Number(opData[0]);

  // Check each tick's liquidity
  const optionTicks = await getOptionData(
    client as PublicClient,
    event.log.address,
    event.args.tokenId,
    opTickArrayLen,
  );

  await Promise.all(
    optionTicks.map((optionTick, i) =>
      db
        .update(internal_options, {
          optionMarket: event.log.address,
          tokenId: BigInt(event.args.tokenId),
          index: i,
          chainId,
        })
        .set((row) => ({
          liquidityExercised:
            row.liquidityExercised +
            (row.liquidityAtLive - optionTick.liquidityToUse),
          liquidityAtLive: optionTick.liquidityToUse,
        })),
    ),
  );

  await context.db.insert(exerciseOptionEvent).values({
    id: event.log.id,
    chainId,
    market: event.log.address,
    timestamp: Number(event.block.timestamp),
    user: event.args.user,
    optionId: event.args.tokenId,
    totalProfit: event.args.totalProfit,
    totalAssetRelocked: event.args.totalAssetRelocked,
  });
});

ponder.on(
  "OptionMarket:LogOptionsMarketInitialized",
  async ({ event, context }) => {
    console.log("🚀 STARTED LogOptionsMarketInitialized event processing!", {
      address: event.log.address,
      blockNumber: event.block.number,
      txHash: event.transaction.hash,
      args: event.args,
    });

    const chainId = Number(context.network.chainId);

    await context.db
      .insert(feeStrategy)
      .values({
        feeStrategy: event.args.dpFee,
        chainId,
      })
      .onConflictDoNothing();

    // Try multicall, but don't let it prevent essential data from being saved
    let token0: any, token1: any, fee: any, tickSpacing: any, currentFee: any;

    try {
      const results = await context.client.multicall({
        contracts: [
          {
            abi: UniswapV3PoolABI,
            address: event.args.primePool,
            functionName: "token0",
          },
          {
            abi: UniswapV3PoolABI,
            address: event.args.primePool,
            functionName: "token1",
          },
          {
            abi: UniswapV3PoolABI,
            address: event.args.primePool,
            functionName: "fee",
          },
          {
            abi: UniswapV3PoolABI,
            address: event.args.primePool,
            functionName: "tickSpacing",
          },
          {
            abi: FeeStrategyV2ABI,
            address: event.args.dpFee,
            functionName: "feePercentages",
            args: [event.log.address],
          },
        ],
      });
      [token0, token1, fee, tickSpacing, currentFee] = results;
      console.log("✅ Multicall successful");
    } catch (error: any) {
      console.log(
        "⚠️ Multicall failed, using fallback values:",
        error?.message,
      );
      // Use event args as fallbacks for essential data
      token0 = { result: event.args.callAsset, status: "success" };
      token1 = { result: event.args.putAsset, status: "success" };
      fee = { result: 3000, status: "success" };
      tickSpacing = { result: 60, status: "success" };
      currentFee = { result: 0n, status: "success" };
    }

    await context.db.insert(feeStrategyToOptionMarkets).values({
      feeStrategy: event.args.dpFee,
      chainId,
      optionMarket: event.log.address,
      currentFee: currentFee.status === "success" ? currentFee.result : 0n, // Add proper error handling
    });

    await context.db.insert(primePool).values({
      chainId,
      primePool: event.args.primePool,
      token0: (token0?.result ||
        event.args.callAsset ||
        "0x0000000000000000000000000000000000000000") as `0x${string}`,
      token1: (token1?.result ||
        event.args.putAsset ||
        "0x0000000000000000000000000000000000000000") as `0x${string}`,
      fee: fee?.result || 3000,
      tickSpacing: tickSpacing?.result || 60,
      optionMarket: event.log.address,
    });

    try {
      await context.db.insert(option_markets).values({
        address: event.log.address,
        chainId,
        primePool: event.args.primePool,
        optionPricing: event.args.optionPricing,
        dpFee: event.args.dpFee,
        callAsset: event.args.callAsset,
        putAsset: event.args.putAsset,
      });

      console.log("🎉 SUCCESSFULLY created option_markets entry!", {
        address: event.log.address,
        chainId,
        callAsset: event.args.callAsset,
        putAsset: event.args.putAsset,
      });
    } catch (error: any) {
      console.error("❌ CRITICAL ERROR in LogOptionsMarketInitialized:", {
        error: error?.message || error,
        address: event.log.address,
        blockNumber: event.block.number,
        args: event.args,
      });
      throw error;
    }
  },
);

ponder.on("OptionMarket:LogUpdateAddress", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db
    .update(feeStrategy, {
      feeStrategy: event.args.dpFee,
      chainId,
    })
    .set({
      feeStrategy: event.args.dpFee,
    });

  await context.db
    .update(option_markets, {
      address: event.log.address,
      chainId,
    })
    .set({
      optionPricing: event.args.optionPricing,
    });
});

ponder.on("feeStrategy:FeeUpdate", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  // Use upsert instead of update to handle case where record doesn't exist yet
  await context.db
    .insert(feeStrategyToOptionMarkets)
    .values({
      feeStrategy: event.log.address,
      chainId,
      optionMarket: event.args.optionMarket,
      currentFee: event.args.feePercentages,
    })
    .onConflictDoUpdate((row) => ({
      currentFee: event.args.feePercentages,
    }));
});

ponder.on("OptionMarket:LogSettleOption", async ({ event, context }) => {
  const { client, db } = context;
  const chainId = Number(context.network.chainId);

  // Get option data to know how many ticks to check
  const opData = await client.readContract({
    abi: OptionMarketABI,
    address: event.log.address,
    functionName: "opData",
    args: [event.args.tokenId],
  });

  const opTickArrayLen = Number(opData[0]);

  // Check each tick's liquidity
  const optionTicks = await getOptionData(
    client as PublicClient,
    event.log.address,
    event.args.tokenId,
    opTickArrayLen,
  );

  await Promise.all(
    optionTicks.map((optionTick, i) =>
      db
        .update(internal_options, {
          optionMarket: event.log.address,
          tokenId: BigInt(event.args.tokenId),
          index: i,
          chainId,
        })
        .set((row) => ({
          liquiditySettled:
            row.liquiditySettled +
            (row.liquidityAtLive - optionTick.liquidityToUse),
          liquidityAtLive: optionTick.liquidityToUse,
        })),
    ),
  );

  await context.db.insert(settleOptionEvent).values({
    id: event.log.id,
    chainId,
    market: event.log.address,
    timestamp: Number(event.block.timestamp),
    user: event.args.user,
    optionId: event.args.tokenId,
  });
});

// liquidity handler & position manager

ponder.on("LiquidityHandler:LogMintedPosition", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db
    .insert(lp_account)
    .values({
      address: event.args.user,
      chainId,
    })
    .onConflictDoNothing();

  await context.db.insert(mint_position_event).values({
    id: event.log.id,
    chainId,
    handler_address: event.log.address,
    token_id: event.args.tokenId,
    user_address: event.args.user,
    liquidity_minted: event.args.liquidityMinted,
    pool: event.args.pool,
    hook: event.args.hook,
    tick_lower: event.args.tickLower,
    tick_upper: event.args.tickUpper,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(user_liquidity_position)
    .values({
      token_id: event.args.tokenId,
      chainId,
      handler_address: event.log.address,
      user_address: event.args.user,
      total_liquidity: event.args.liquidityMinted,
      used_liquidity: 0n,
      pool: event.args.pool,
      tick_lower: event.args.tickLower,
      tick_upper: event.args.tickUpper,
    })
    .onConflictDoUpdate((row) => ({
      total_liquidity: (row.total_liquidity ?? 0n) + event.args.liquidityMinted,
    }));
});

ponder.on("LiquidityHandler:LogBurnedPosition", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(burn_position_event).values({
    id: event.log.id,
    chainId,
    handler_address: event.log.address,
    token_id: event.args.tokenId,
    user_address: event.args.user,
    liquidity_burned: event.args.liquidityBurned,
    pool: event.args.pool,
    hook: event.args.hook,
    tick_lower: event.args.tickLower,
    tick_upper: event.args.tickUpper,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(user_liquidity_position)
    .values({
      token_id: event.args.tokenId,
      chainId,
      handler_address: event.log.address,
      total_liquidity: 0n,
    })
    .onConflictDoUpdate((row) => ({
      total_liquidity: (row.total_liquidity ?? 0n) - event.args.liquidityBurned,
    }));
});

ponder.on("LiquidityHandler:LogUsePosition", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(use_position_event).values({
    id: event.log.id,
    chainId,
    handler_address: event.log.address,
    token_id: event.args.tokenId,
    liquidity_used: event.args.liquidityUsed,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(user_liquidity_position)
    .values({
      token_id: event.args.tokenId,
      chainId,
      handler_address: event.log.address,
      used_liquidity: event.args.liquidityUsed,
    })
    .onConflictDoUpdate((row) => ({
      used_liquidity: (row.used_liquidity ?? 0n) + event.args.liquidityUsed,
    }));
});

ponder.on("LiquidityHandler:LogUnusePosition", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(unuse_position_event).values({
    id: event.log.id,
    chainId,
    handler_address: event.log.address,
    token_id: event.args.tokenId,
    liquidity_unused: event.args.liquidityUnused,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(user_liquidity_position)
    .values({
      token_id: event.args.tokenId,
      chainId,
      handler_address: event.log.address,
      used_liquidity: 0n,
    })
    .onConflictDoUpdate((row) => ({
      used_liquidity: (row.used_liquidity ?? 0n) - event.args.liquidityUnused,
    }));
});

ponder.on("LiquidityHandler:LogDonation", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(donation_event).values({
    id: event.log.id,
    chainId,
    handler_address: event.log.address,
    token_id: event.args.tokenId,
    premium_amount_earned: event.args.premiumAmountEarned,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on(
  "LiquidityHandler:LogPremiumCollected",
  async ({ event, context }) => {
    const chainId = Number(context.network.chainId);

    await context.db.insert(premium_collection_event).values({
      id: event.log.id,
      chainId,
      handler_address: event.log.address,
      token_id: event.args.tokenId,
      user_address: event.args.user,
      amount: event.args.amount,
      timestamp: Number(event.block.timestamp),
    });
  },
);

ponder.on("LiquidityHandler:LogUpdateHookUse", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(hook_update_event).values({
    id: event.log.id,
    chainId,
    handler_address: event.log.address,
    hook_address: event.args.hook,
    allowed: event.args.allowed,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on(
  "LiquidityHandler:LogUpdateGlobalHookUse",
  async ({ event, context }) => {
    const chainId = Number(context.network.chainId);

    await context.db.insert(global_hook_update_event).values({
      id: event.log.id,
      chainId,
      handler_address: event.log.address,
      global_allowed: event.args.globalAllowed,
      default_allowed: event.args.defaultAllowed,
      timestamp: Number(event.block.timestamp),
    });

    await context.db
      .insert(liquidity_handler)
      .values({
        address: event.log.address,
        chainId,
        global_hook_allowed: event.args.globalAllowed,
        default_hook_allowed: event.args.defaultAllowed,
      })
      .onConflictDoUpdate((row) => ({
        global_hook_allowed: event.args.globalAllowed,
        default_hook_allowed: event.args.defaultAllowed,
      }));
  },
);

ponder.on("LiquidityHandler:Paused", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(handler_pause_event).values({
    id: event.log.id,
    chainId,
    handler_address: event.log.address,
    is_paused: true,
    account: event.args.account,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(liquidity_handler)
    .values({
      address: event.log.address,
      chainId,
      is_paused: true,
    })
    .onConflictDoUpdate((row) => ({
      is_paused: true,
    }));
});

ponder.on("LiquidityHandler:Unpaused", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db.insert(handler_pause_event).values({
    id: event.log.id,
    chainId,
    handler_address: event.log.address,
    is_paused: false,
    account: event.args.account,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(liquidity_handler)
    .values({
      address: event.log.address,
      chainId,
      is_paused: false,
    })
    .onConflictDoUpdate((row) => ({
      is_paused: false,
    }));
});
