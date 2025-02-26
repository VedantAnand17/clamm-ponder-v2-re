import { ponder } from "ponder:registry";
import { trader_account, option_markets, primePool } from "ponder:schema";
import { bigint, client, replaceBigInts } from "ponder";
import { UniswapV3PoolABI } from "../abis/UniswapV3PoolABI";

ponder.on(
  "OptionMarket:LogUpdateExerciseDelegate",
  async ({ event, context }) => {
    const chainId = Number(context.network.chainId);

    // First insert the record if it doesn't exist -- happening because user might call
    // before minting option
    await context.db
      .insert(trader_account)
      .values({
        address: event.transaction.from,
        chainId,
      })
      .onConflictDoNothing();

    // Then update the record
    await context.db
      .update(trader_account, {
        address: event.transaction.from,
        chainId: context.network.chainId,
      })
      .set({ exerciseDelegate: event.args.status });
  }
);
