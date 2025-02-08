import { ponder } from "ponder:registry";
import {
  account,
  allowance,
  approvalEvent,
  depositCapEvent,
  depositEvent,
  owner,
  rebalanceEvent,
  redeemEvent,
  setOwnerEvents,
  strategist,
  strategy,
  transferEvent,
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
        owner: event.log.address,
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
