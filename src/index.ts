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
} from "ponder:schema";
import { bigint, replaceBigInts } from "ponder";
import { initialiseStrategyData } from "./hooks/initialiseStrategyData";
import { getStrategyBalance } from "./hooks/getStrategyBalance";
ponder.on("Automatorv21:Transfer", async ({ event, context }) => {
  await context.db
    .insert(account)
    .values({ address: event.args.from, balance: 0n, isOwner: false })
    .onConflictDoUpdate((row) => ({
      balance: row.balance - event.args.value,
    }));

  await context.db
    .insert(account)
    .values({ address: event.args.to, balance: 0n, isOwner: false })
    .onConflictDoUpdate((row) => ({
      balance: row.balance + event.args.value,
    }));

  // add row to "transfer_event".
  await context.db.insert(transferEvent).values({
    id: event.log.id,
    value: event.args.value,
    timestamp: Number(event.block.timestamp),
    from: event.args.from,
    to: event.args.to,
  });
});

ponder.on("Automatorv21:Approval", async ({ event, context }) => {
  // upsert "allowance".
  await context.db
    .insert(allowance)
    .values({
      spender: event.args.spender,
      owner: event.args.owner,
      value: event.args.value,
    })
    .onConflictDoUpdate({ value: event.args.value });

  // add row to "approval_event".
  await context.db.insert(approvalEvent).values({
    id: event.log.id,
    value: event.args.value,
    timestamp: Number(event.block.timestamp),
    owner: event.args.owner,
    spender: event.args.spender,
  });
});

ponder.on("Automatorv21:Rebalance", async ({ event, context }) => {
  // First get the strategy data which contains asset and counter addresses
  // const strategyData = await context.db
  //   .query("strategy")
  //   .where("address", "=", event.log.address)
  //   .first();
  const strategy_data = await context.db.find(strategy, { address: event.log.address });

  
  // Get balances after the rebalance (at current block)
  const balancesAfter = await getStrategyBalance(
    context.client,
    event.log.address,
    { asset: strategy_data.asset, counter: strategy_data.counter },
    { blockNumber: event.block.number }
  );
  
  await context.db.insert(rebalanceEvent).values({
    id: event.log.id,
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
  await context.db
    .insert(depositCapEvent)
    .values({
      id: event.log.id,
      strategy: event.log.address,
      timestamp: Number(event.block.timestamp),
      owner: event.transaction.from,
      deposit_cap: event.args.depositCap,
    });

  await context.db
    .insert(owner)
    .values({ address: event.transaction.from })
    .onConflictDoUpdate({ address: event.transaction.from });

  const strategyData = await initialiseStrategyData(
    context.client,
    event.log.address,
    context.contracts.Automatorv21.abi
  );

  await context.db
    .insert(strategy)
    .values({ 
      address: event.log.address,
      owner: event.transaction.from,
      ...strategyData
    })
    .onConflictDoUpdate({
      set: {
        owner: event.transaction.from,
        ...strategyData
      }
    });
});

ponder.on("Automatorv21:SetDepositCap", async ({ event, context }) => {
  await context.db
    .insert(depositCapEvent)
    .values({
      id: event.log.id,
      strategy: event.log.address,
      timestamp: Number(event.block.timestamp),
      owner: event.transaction.from,
      deposit_cap: event.args.depositCap,
    });

    await context.db
    .insert(owner)
    .values({ address: event.transaction.from })
    .onConflictDoUpdate({ address: event.transaction.from });

    await context.db
    .insert(strategy)
    .values({ 
      address: event.log.address,
      owner: event.transaction.from
    })
    .onConflictDoUpdate({ owner: event.transaction.from });
});

ponder.on("Automatorv21:SetOwner", async ({ event, context }) => {
  await context.db
    .insert(setOwnerEvents)
    .values({
      id: event.log.id,
      strategy: event.log.address,
      caller: event.transaction.from,
      owner: event.args.user,
      approved: event.args.approved,
      timestamp: Number(event.block.timestamp),
    });

    if (event.args.approved) {
      await context.db
      .insert(owner)
      .values({ address: event.args.user })
      .onConflictDoUpdate({ address: event.args.user });

      await context.db
      .insert(strategy)
      .values({ 
        address: event.log.address,
        owner: event.args.user
      })
      .onConflictDoUpdate({ owner: event.args.user });
    }
});

ponder.on("Automatorv21:Deposit", async ({ event, context }) => {
  await context.db
    .insert(depositEvent)
    .values({
      id: event.log.id,
      strategy: event.log.address,
      user: event.args.sender,
      amount: event.args.assets,
      shares: event.args.sharesMinted,
      timestamp: Number(event.block.timestamp),
    });
});

ponder.on("Automatorv21:Redeem", async ({ event, context }) => {
  await context.db
    .insert(redeemEvent)
    .values({
      id: event.log.id,
      strategy: event.log.address,
      user: event.args.sender,
      amount: event.args.assetsWithdrawn,
      shares: event.args.shares,
      timestamp: Number(event.block.timestamp),
    });
});


// option market

ponder.on("OptionMarket:Transfer", async ({ event, context }) => {
  await context.db
    .insert(trader_account)
    .values({ address: event.args.from })
    .onConflictDoNothing();
  
  await context.db
    .insert(trader_account)
    .values({ address: event.args.to })
    .onConflictDoNothing();

  await context.db
    .insert(erc721_token)
    .values({
      id: event.args.id,
      owner: event.args.to,
      market: event.log.address,
      status: 'active'  // Default to active for new tokens
    })
    .onConflictDoUpdate({
      set: { 
        owner: event.args.to,
        market: event.log.address
        // Don't update status on transfer
      }
    });

  await context.db.insert(erc721TransferEvent).values({
    id: event.log.id,
    from: event.args.from,
    to: event.args.to,
    token: event.args.id,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("OptionMarket:LogMintOption", async ({ event, context }) => {
  await context.db
    .insert(trader_account)
    .values({ address: event.args.user })
    .onConflictDoNothing();

  await context.db
    .insert(erc721_token)
    .values({
      id: event.args.tokenId,
      owner: event.args.user,
      market: event.log.address,
      status: 'active'
    })
    .onConflictDoUpdate({
      set: { 
        owner: event.args.user,
        market: event.log.address,
        status: 'active'
      }
    });

  await context.db.insert(mintOptionEvent).values({
    id: event.log.id,
    market: event.log.address,
    timestamp: Number(event.block.timestamp),
    user: event.args.user,
    optionId: event.args.tokenId,
    isCall: event.args.isCall,
    premiumAmount: event.args.premiumAmount,
    totalAssetWithdrawn: event.args.totalAssetWithdrawn,
    protocolFees: event.args.protocolFees,
  });

  await context.db
    .insert(trader_market_position)
    .values({
      trader: event.args.user,
      market: event.log.address,
    })
    .onConflictDoNothing();
});

ponder.on("OptionMarket:LogOptionsMarketInitialized", async ({ event, context }) => {
  try {
    await context.db.insert(option_markets).values({
      address: event.log.address,
      primePool: event.args.primePool,
      optionPricing: event.args.optionPricing,
      dpFee: event.args.dpFee,
      callAsset: event.args.callAsset,
      putAsset: event.args.putAsset,
    });
  } catch (error) {
    console.error("Error processing LogOptionsMarketInitialized event:", error);
    throw error;
  }
});

ponder.on("OptionMarket:LogExerciseOption", async ({ event, context }) => {
  await context.db
    .insert(trader_account)
    .values({ address: event.args.user })
    .onConflictDoNothing();

  await context.db.insert(exerciseOptionEvent).values({
    id: event.log.id,
    market: event.log.address,
    timestamp: Number(event.block.timestamp),
    user: event.args.user,
    optionId: event.args.tokenId,
    totalProfit: event.args.totalProfit,
    totalAssetRelocked: event.args.totalAssetRelocked,
  });

  await context.db
    .insert(erc721_token)
    .values({
      id: event.args.tokenId,
      market: event.log.address,
      owner: event.args.user,
      status: 'exercised'
    })
    .onConflictDoUpdate({
      set: { status: 'exercised' }
    });
});

ponder.on("OptionMarket:LogSettleOption", async ({ event, context }) => {
  await context.db
    .insert(trader_account)
    .values({ address: event.args.user })
    .onConflictDoNothing();

  await context.db.insert(settleOptionEvent).values({
    id: event.log.id,
    market: event.log.address,
    timestamp: Number(event.block.timestamp),
    user: event.args.user,
    optionId: event.args.tokenId,
  });

  await context.db
    .insert(erc721_token)
    .values({
      id: event.args.tokenId,
      market: event.log.address,
      owner: event.args.user,
      status: 'settled'
    })
    .onConflictDoUpdate({
      set: { status: 'settled' }
    });
});


// liquidity handler & position manager

ponder.on("PositionManager:LogMintPosition", async ({ event, context }) => {
  await context.db
    .insert(lp_account)
    .values({ address: event.args.user })
    .onConflictDoNothing();

  await context.db.insert(mint_position_event).values({
    id: event.log.id,
    handler_address: event.args._handler,
    token_id: event.args.tokenId,
    user_address: event.args.user,
    liquidity_minted: event.args.sharesMinted,
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
      handler_address: event.args._handler,
      user_address: event.args.user,
      total_liquidity: event.args.sharesMinted,
      used_liquidity: 0n,
      pool: event.args.pool,
      tick_lower: event.args.tickLower,
      tick_upper: event.args.tickUpper,
    })
    .onConflictDoUpdate((row) => ({
      total_liquidity: row.total_liquidity + event.args.sharesMinted,
    }));
});

ponder.on("PositionManager:LogBurnPosition", async ({ event, context }) => {
  await context.db.insert(burn_position_event).values({
    id: event.log.id,
    handler_address: event.args._handler,
    token_id: event.args.tokenId,
    user_address: event.args.user,
    liquidity_burned: event.args.sharesBurned,
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
      handler_address: event.args._handler,
      total_liquidity: 0n,
    })
    .onConflictDoUpdate((row) => ({
      total_liquidity: row.total_liquidity - event.args.sharesBurned,
    }));
});

ponder.on("PositionManager:LogUsePosition", async ({ event, context }) => {
  await context.db.insert(use_position_event).values({
    id: event.log.id,
    token_id: event.args.tokenId,
    liquidity_used: event.args.liquidityUsed,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(user_liquidity_position)
    .values({
      token_id: event.args.tokenId,
      used_liquidity: event.args.liquidityUsed,
    })
    .onConflictDoUpdate((row) => ({
      used_liquidity: row.used_liquidity + event.args.liquidityUsed,
    }));
});

ponder.on("PositionManager:LogUnusePosition", async ({ event, context }) => {
  await context.db.insert(unuse_position_event).values({
    id: event.log.id,
    token_id: event.args.tokenId,
    liquidity_unused: event.args.liquidityUnused,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(user_liquidity_position)
    .values({
      token_id: event.args.tokenId,
      used_liquidity: 0n,
    })
    .onConflictDoUpdate((row) => ({
      used_liquidity: row.used_liquidity - event.args.liquidityUnused,
    }));
});

ponder.on("PositionManager:LogDonation", async ({ event, context }) => {
  await context.db.insert(donation_event).values({
    id: event.log.id,
    token_id: event.args.tokenId,
    premium_amount_earned: event.args.premiumAmountEarned,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("PositionManager:LogRemovePremium", async ({ event, context }) => {
  await context.db.insert(premium_collection_event).values({
    id: event.log.id,
    token_id: event.args.tokenId,
    user_address: event.args.user,
    amount: event.args.amount,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("LiquidityHandler:LogUpdateHookUse", async ({ event, context }) => {
  await context.db.insert(hook_update_event).values({
    id: event.log.id,
    handler_address: event.log.address,
    hook_address: event.args.hook,
    allowed: event.args.allowed,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("LiquidityHandler:LogUpdateGlobalHookUse", async ({ event, context }) => {
  await context.db.insert(global_hook_update_event).values({
    id: event.log.id,
    handler_address: event.log.address,
    global_allowed: event.args.globalAllowed,
    default_allowed: event.args.defaultAllowed,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(liquidity_handler)
    .values({
      address: event.log.address,
      global_hook_allowed: event.args.globalAllowed,
      default_hook_allowed: event.args.defaultAllowed,
    })
    .onConflictDoUpdate((row) => ({
      global_hook_allowed: event.args.globalAllowed,
      default_hook_allowed: event.args.defaultAllowed,
    }));
});

ponder.on("LiquidityHandler:Paused", async ({ event, context }) => {
  await context.db.insert(handler_pause_event).values({
    id: event.log.id,
    handler_address: event.log.address,
    is_paused: true,
    account: event.args.account,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(liquidity_handler)
    .values({
      address: event.log.address,
      is_paused: true,
    })
    .onConflictDoUpdate((row) => ({
      is_paused: true,
    }));
});

ponder.on("LiquidityHandler:Unpaused", async ({ event, context }) => {
  await context.db.insert(handler_pause_event).values({
    id: event.log.id,
    handler_address: event.log.address,
    is_paused: false,
    account: event.args.account,
    timestamp: Number(event.block.timestamp),
  });

  await context.db
    .insert(liquidity_handler)
    .values({
      address: event.log.address,
      is_paused: false,
    })
    .onConflictDoUpdate((row) => ({
      is_paused: false,
    }));
});