import { index, onchainTable, primaryKey, relations } from "ponder";

export const account = onchainTable("account", (t) => ({
  address: t.hex().primaryKey(),
  balance: t.bigint().notNull(),
  isOwner: t.boolean().notNull(),
}));

export const strategist = onchainTable("strategist", (t) => ({
  address: t.hex().primaryKey(),
}));

export const owner = onchainTable("owner", (t) => ({
  address: t.hex().primaryKey(),
}));

export const strategy = onchainTable("strategy", (t) => ({
  address: t.hex().primaryKey(),
  strategist: t.hex(),
  owner: t.hex(),
  pool: t.hex(),
  router: t.hex(),
  pool_tick_spacing: t.bigint(),
  balancer_vault: t.hex(),
  asset: t.hex(),
  counter: t.hex(),
  deposit_fee_pips: t.bigint(),
  position_manager: t.hex(),
  liquidity_handler: t.hex(),
}));

export const strategistRelations = relations(strategist, ({ many }) => ({
  strategies: many(strategy),
}));

export const ownerRelations = relations(owner, ({ many }) => ({
  strategies: many(strategy),
}));

export const strategyRelations = relations(strategy, ({ one }) => ({
  strategist: one(strategist, {
    fields: [strategy.strategist],
    references: [strategist.address],
  }),
}));

export const strategyRelationstoOwner = relations(strategy, ({ one }) => ({
  owner: one(owner, {
    fields: [strategy.owner],
    references: [owner.address],
  }),
}));

export const allowance = onchainTable(
  "allowance",
  (t) => ({
    owner: t.hex(),
    spender: t.hex(),
    value: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.owner, table.spender] }),
  }),
);

export const transferEvent = onchainTable(
  "transfer_event",
  (t) => ({
    id: t.text().primaryKey(),
    value: t.bigint().notNull(),
    timestamp: t.integer().notNull(),
    from: t.hex(), // null for minting
    to: t.hex(), // need to check why normal deposit has a 0x00 address transfer in between
  }),
  (table) => ({
    fromIdx: index("from_index").on(table.from),
  }),
);

export const transferEventRelations = relations(transferEvent, ({ one }) => ({
  fromAccount: one(account, {
    fields: [transferEvent.from],
    references: [account.address],
  }),
}));

export const approvalEvent = onchainTable("approval_event", (t) => ({
  id: t.text().primaryKey(),
  value: t.bigint().notNull(),
  timestamp: t.integer().notNull(),
  owner: t.hex().notNull(),
  spender: t.hex().notNull(),
}));

export const rebalanceEvent = onchainTable("rebalance_event", (t) => ({
  id: t.text().primaryKey(),
  strategy: t.hex().notNull(),
  timestamp: t.integer().notNull(),
  current_tick: t.integer().notNull(),
  strategist: t.hex().notNull(),
  ticks_burn: t.json().$type<{ tick: number; liquidity: bigint }[]>(),
  ticks_mint: t.json().$type<{ tick: number; liquidity: bigint }[]>(),
  asset_balance_after: t.bigint(),
  counter_balance_after: t.bigint(),

}));

export const depositCapEvent = onchainTable("deposit_cap_event", (t) => ({
  id: t.text().primaryKey(),
  strategy: t.hex().notNull(),
  owner: t.hex().notNull(),
  timestamp: t.integer().notNull(),
  deposit_cap: t.bigint(),
}));

export const setOwnerEvents = onchainTable("set_owner_events", (t) => ({
  id: t.text().primaryKey(),
  strategy: t.hex().notNull(),
  caller: t.hex().notNull(),
  owner: t.hex().notNull(),
  approved: t.boolean().notNull(),
  timestamp: t.integer().notNull(),
}));

export const depositEvent = onchainTable("deposit_event", (t) => ({
  id: t.text().primaryKey(),
  strategy: t.hex().notNull(),
  user: t.hex().notNull(),
  amount: t.bigint(),
  timestamp: t.integer().notNull(),
  shares: t.bigint(),
}));

export const redeemEvent = onchainTable("redeem_event", (t) => ({
  id: t.text().primaryKey(),
  strategy: t.hex().notNull(),
  user: t.hex().notNull(),
  amount: t.bigint(),
  timestamp: t.integer().notNull(),
  shares: t.bigint(),
}));


// todo
export const StrategyTotals = onchainTable("strategy_totals", (t) => ({
  strategy: t.hex().notNull(),
  total_deposits: t.bigint(),
  total_withdrawals: t.bigint(),
  total_shares: t.bigint(),
  total_assets: t.bigint(),
  total_liquidity: t.bigint(),
  total_deposit_fees: t.bigint(),
  total_withdrawal_fees: t.bigint(),
}));

