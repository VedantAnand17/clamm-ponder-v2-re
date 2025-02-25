import { index, onchainTable, primaryKey, relations } from "ponder";

// account that deposits to automator
export const account = onchainTable(
  "account",
  (t) => ({
    address: t.hex(),
    chainId: t.integer().notNull(),
    balance: t.bigint().notNull(),
    isOwner: t.boolean().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.address, table.chainId] }),
  })
);

export const strategist = onchainTable(
  "strategist",
  (t) => ({
    address: t.hex(),
    chainId: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.address, table.chainId] }),
  })
);

export const owner = onchainTable(
  "owner",
  (t) => ({
    address: t.hex(),
    chainId: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.address, table.chainId] }),
  })
);

export const strategy = onchainTable(
  "strategy",
  (t) => ({
    address: t.hex(),
    chainId: t.integer().notNull(),
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
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.address, table.chainId] }),
  })
);

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
    chainId: t.integer().notNull(),
    value: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.owner, table.spender, table.chainId] }),
  })
);

export const transferEvent = onchainTable(
  "transfer_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    value: t.bigint().notNull(),
    timestamp: t.integer().notNull(),
    from: t.hex(),
    to: t.hex(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
    fromIdx: index("from_index").on(table.from),
  })
);

export const transferEventRelations = relations(transferEvent, ({ one }) => ({
  fromAccount: one(account, {
    fields: [transferEvent.from],
    references: [account.address],
  }),
}));

export const approvalEvent = onchainTable(
  "approval_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    value: t.bigint().notNull(),
    timestamp: t.integer().notNull(),
    owner: t.hex().notNull(),
    spender: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const rebalanceEvent = onchainTable(
  "rebalance_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    strategy: t.hex().notNull(),
    timestamp: t.integer().notNull(),
    current_tick: t.integer().notNull(),
    strategist: t.hex().notNull(),
    ticks_burn: t.json().$type<{ tick: number; liquidity: bigint }[]>(),
    ticks_mint: t.json().$type<{ tick: number; liquidity: bigint }[]>(),
    asset_balance_after: t.bigint(),
    counter_balance_after: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const depositCapEvent = onchainTable(
  "deposit_cap_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    strategy: t.hex().notNull(),
    owner: t.hex().notNull(),
    timestamp: t.integer().notNull(),
    deposit_cap: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const setOwnerEvents = onchainTable(
  "set_owner_events",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    strategy: t.hex().notNull(),
    caller: t.hex().notNull(),
    owner: t.hex().notNull(),
    approved: t.boolean().notNull(),
    timestamp: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const depositEvent = onchainTable(
  "deposit_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    strategy: t.hex().notNull(),
    user: t.hex().notNull(),
    amount: t.bigint(),
    timestamp: t.integer().notNull(),
    shares: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const redeemEvent = onchainTable(
  "redeem_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    strategy: t.hex().notNull(),
    user: t.hex().notNull(),
    amount: t.bigint(),
    timestamp: t.integer().notNull(),
    shares: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

// option market

// trader account
export const trader_account = onchainTable(
  "trader_account",
  (t) => ({
    address: t.hex(),
    chainId: t.integer().notNull(),
    exerciseDelegate: t.boolean(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.address, table.chainId] }),
  })
);

// token representing trader's position in the market
export const erc721_token = onchainTable(
  "erc721_token",
  (t) => ({
    id: t.bigint(),
    createdAt: t.integer(),
    chainId: t.integer(),
    market: t.hex(),
    owner: t.hex(),
    opTickArrayLen: t.integer(),
    isCall: t.boolean(),
    expiry: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.market, table.chainId] }),
    ownerIdx: index("owner_index").on(table.owner),
  })
);

export const internal_options = onchainTable(
  "internal_options",
  (t) => ({
    handler: t.hex().notNull(),
    pool: t.hex().notNull(),
    optionMarket: t.hex().notNull(),
    tokenId: t.bigint().notNull(),
    index: t.integer().notNull(),
    chainId: t.integer().notNull(),
    hook: t.hex().notNull(),
    liquidityAtOpen: t.bigint().notNull(),
    liquidityAtLive: t.bigint().notNull(),
    liquidityExercised: t.bigint().notNull(),
    liquiditySettled: t.bigint().notNull(),
    tickLower: t.integer().notNull(),
    tickUpper: t.integer().notNull(),
    strike: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.optionMarket, table.tokenId, table.chainId, table.index],
    }),
  })
);

// option market from which trader can mint options. Each market supports multiple pools but they should have the same call and put assets.
export const option_markets = onchainTable(
  "option_markets",
  (t) => ({
    address: t.hex(),
    chainId: t.integer().notNull(),
    name: t.text(),
    symbol: t.text(),
    primePool: t.hex().notNull(),
    optionPricing: t.hex().notNull(),
    dpFee: t.hex().notNull(),
    callAsset: t.hex().notNull(),
    putAsset: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.address, table.chainId] }),
  })
);

// Junction table for many-to-many relationship between traders and options markets
export const trader_market_position = onchainTable(
  "trader_market_position",
  (t) => ({
    trader: t.hex(),
    market: t.hex(),
    chainId: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.trader, table.market, table.chainId] }),
  })
);

// Update relations to use the junction table representing the many-to-many relationship between trader, positions and option markets
export const trader_account_relations = relations(
  trader_account,
  ({ many }) => ({
    positions: many(trader_market_position),
  })
);

// Update relations to use the junction table representing the many-to-many relationship between trader, option markets and trader positions
export const option_markets_relations = relations(
  option_markets,
  ({ many }) => ({
    positions: many(trader_market_position),
  })
);

export const trader_market_position_relations = relations(
  trader_market_position,
  ({ one }) => ({
    trader: one(trader_account, {
      fields: [trader_market_position.trader],
      references: [trader_account.address],
    }),
    market: one(option_markets, {
      fields: [trader_market_position.market],
      references: [option_markets.address],
    }),
  })
);

// erc721 transfer event
export const erc721TransferEvent = onchainTable(
  "erc721TransferEvent",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    timestamp: t.integer().notNull(),
    from: t.hex().notNull(),
    to: t.hex().notNull(),
    token: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

// mint option event
export const mintOptionEvent = onchainTable(
  "mintOptionEvent",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    timestamp: t.integer().notNull(),
    user: t.hex().notNull(),
    market: t.hex().notNull(),
    optionId: t.bigint(),
    isCall: t.boolean(),
    premiumAmount: t.bigint(),
    totalAssetWithdrawn: t.bigint(),
    protocolFees: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

// export const options = onchainTable(
//   "options",
//   (t) => ({
//     id: t.text(),
//     chainId: t.integer().notNull(),
//     timestamp: t.integer().notNull(),
//     user: t.hex().notNull(),
//     market: t.hex().notNull(),
//     optionId: t.bigint(),
//     isCall: t.boolean(),
//     premiumAmount: t.bigint(),
//     totalAssetWithdrawn: t.bigint(),
//     protocolFees: t.bigint(),
//   }),
//   (table) => ({
//     pk: primaryKey({ columns: [table.id, table.chainId] }),
//   }),
// );

// Add relations for mintOptionEvent
export const mintOptionEventRelations = relations(
  mintOptionEvent,
  ({ one }) => ({
    user_account: one(trader_account, {
      fields: [mintOptionEvent.user],
      references: [trader_account.address],
    }),
    option_market: one(option_markets, {
      fields: [mintOptionEvent.market],
      references: [option_markets.address],
    }),
  })
);

// Add relations for erc721TransferEvent
export const erc721TransferEventRelations = relations(
  erc721TransferEvent,
  ({ one }) => ({
    from_account: one(trader_account, {
      fields: [erc721TransferEvent.from],
      references: [trader_account.address],
    }),
    to_account: one(trader_account, {
      fields: [erc721TransferEvent.to],
      references: [trader_account.address],
    }),
    token: one(erc721_token, {
      fields: [erc721TransferEvent.token],
      references: [erc721_token.id],
    }),
  })
);

// Add relations for erc721_token
export const erc721_token_relations = relations(erc721_token, ({ one }) => ({
  owner_account: one(trader_account, {
    fields: [erc721_token.owner],
    references: [trader_account.address],
  }),
  market: one(option_markets, {
    fields: [erc721_token.market],
    references: [option_markets.address],
  }),
}));

// Update erc721_token_to_internal_options relation
export const erc721_token_to_internal_options = relations(
  erc721_token,
  ({ many }) => ({
    internal_options: many(internal_options, {
      references: [
        internal_options.tokenId,
        internal_options.optionMarket,
        internal_options.chainId,
      ],
      fields: [erc721_token.id, erc721_token.market, erc721_token.chainId],
    }),
  })
);

// Update internal_options_to_token relation
export const internal_options_to_token = relations(
  internal_options,
  ({ one }) => ({
    token: one(erc721_token, {
      references: [erc721_token.id, erc721_token.market, erc721_token.chainId],
      fields: [
        internal_options.tokenId,
        internal_options.optionMarket,
        internal_options.chainId,
      ],
    }),
  })
);

// Exercise option event
export const exerciseOptionEvent = onchainTable(
  "exerciseOptionEvent",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    timestamp: t.integer().notNull(),
    user: t.hex().notNull(),
    market: t.hex().notNull(),
    optionId: t.bigint().notNull(),
    totalProfit: t.bigint().notNull(),
    totalAssetRelocked: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

// Settle option event
export const settleOptionEvent = onchainTable(
  "settleOptionEvent",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    timestamp: t.integer().notNull(),
    user: t.hex().notNull(),
    market: t.hex().notNull(),
    optionId: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

// Add relations for exerciseOptionEvent
export const exerciseOptionEventRelations = relations(
  exerciseOptionEvent,
  ({ one }) => ({
    user_account: one(trader_account, {
      fields: [exerciseOptionEvent.user],
      references: [trader_account.address],
    }),
    option_market: one(option_markets, {
      fields: [exerciseOptionEvent.market],
      references: [option_markets.address],
    }),
  })
);

// Add relations for settleOptionEvent
export const settleOptionEventRelations = relations(
  settleOptionEvent,
  ({ one }) => ({
    user_account: one(trader_account, {
      fields: [settleOptionEvent.user],
      references: [trader_account.address],
    }),
    option_market: one(option_markets, {
      fields: [settleOptionEvent.market],
      references: [option_markets.address],
    }),
  })
);

// tvl and other stats section

export const optionMarketTotals = onchainTable(
  "option_market_totals",
  (t) => ({
    timestamp: t.integer().notNull(),
    market: t.hex(),
    chainId: t.integer().notNull(),
    callAssetOutside: t.bigint(),
    putAssetOutside: t.bigint(),
    totalPremiumPaid: t.bigint(),
    totalInterestVolume: t.bigint(),
    totalUniqueTraders: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.market, table.chainId] }),
  })
);

export const liquidityHandlerTotals = onchainTable(
  "liquidity_handler_totals",
  (t) => ({
    timestamp: t.integer().notNull(),
    liquidityHandler: t.hex(),
    chainId: t.integer().notNull(),
    token0Inside: t.bigint(),
    token1Inside: t.bigint(),
    totalTransactionVolume: t.bigint(),
    totalUniqueLPs: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.liquidityHandler, table.chainId] }),
  })
);

export const liquidityHandlerActiveLiquidity = onchainTable(
  "liquidity_handler_active_liquidity",
  (t) => ({
    timestamp: t.integer().notNull(),
    liquidityHandler: t.hex(),
    chainId: t.integer().notNull(),
    pool: t.hex().notNull(),
    tickLower: t.bigint(),
    tickUpper: t.bigint(),
    usedLiquidity: t.bigint(),
    freeLiquidity: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.liquidityHandler, table.chainId] }),
  })
);

// position manager

// liquidity handler

// LP accounts
export const lp_account = onchainTable(
  "lp_account",
  (t) => ({
    address: t.hex(),
    chainId: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.address, table.chainId] }),
  })
);

// Core liquidity position tracking
export const user_liquidity_position = onchainTable(
  "user_liquidity_position",
  (t) => ({
    token_id: t.bigint(),
    chainId: t.integer().notNull(),
    handler_address: t.hex(),
    user_address: t.hex(),
    total_liquidity: t.bigint(),
    used_liquidity: t.bigint(),
    pool: t.hex(),
    tick_lower: t.integer(),
    tick_upper: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.token_id, table.handler_address, table.chainId],
    }),
  })
);

// Handler configuration
export const liquidity_handler = onchainTable(
  "liquidity_handler",
  (t) => ({
    address: t.hex(),
    chainId: t.integer().notNull(),
    is_paused: t.boolean(),
    global_hook_allowed: t.boolean(),
    default_hook_allowed: t.boolean(),
    premium_asset: t.hex(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.address, table.chainId] }),
  })
);

// Position Manager Events
export const mint_position_event = onchainTable(
  "mint_position_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    handler_address: t.hex(),
    token_id: t.bigint(),
    user_address: t.hex(),
    liquidity_minted: t.bigint(),
    pool: t.hex(),
    hook: t.hex(),
    tick_lower: t.integer(),
    tick_upper: t.integer(),
    timestamp: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const burn_position_event = onchainTable(
  "burn_position_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    handler_address: t.hex(),
    token_id: t.bigint(),
    user_address: t.hex(),
    liquidity_burned: t.bigint(),
    pool: t.hex(),
    hook: t.hex(),
    tick_lower: t.integer(),
    tick_upper: t.integer(),
    timestamp: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const use_position_event = onchainTable(
  "use_position_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    handler_address: t.hex(),
    token_id: t.bigint(),
    liquidity_used: t.bigint(),
    timestamp: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const unuse_position_event = onchainTable(
  "unuse_position_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    token_id: t.bigint(),
    liquidity_unused: t.bigint(),
    timestamp: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const donation_event = onchainTable(
  "donation_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    token_id: t.bigint(),
    premium_amount_earned: t.bigint(),
    timestamp: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const premium_collection_event = onchainTable(
  "premium_collection_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    token_id: t.bigint(),
    user_address: t.hex(),
    amount: t.bigint(),
    timestamp: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

// Liquidity Handler Events
export const hook_update_event = onchainTable(
  "hook_update_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    handler_address: t.hex(),
    hook_address: t.hex(),
    allowed: t.boolean(),
    timestamp: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const global_hook_update_event = onchainTable(
  "global_hook_update_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    handler_address: t.hex(),
    global_allowed: t.boolean(),
    default_allowed: t.boolean(),
    timestamp: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

export const handler_pause_event = onchainTable(
  "handler_pause_event",
  (t) => ({
    id: t.text(),
    chainId: t.integer().notNull(),
    handler_address: t.hex(),
    is_paused: t.boolean(),
    account: t.hex(),
    timestamp: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.chainId] }),
  })
);

// Relations
export const user_liquidity_position_relations = relations(
  user_liquidity_position,
  ({ one }) => ({
    account: one(lp_account, {
      fields: [user_liquidity_position.user_address],
      references: [lp_account.address],
    }),
    handler: one(liquidity_handler, {
      fields: [user_liquidity_position.handler_address],
      references: [liquidity_handler.address],
    }),
  })
);
