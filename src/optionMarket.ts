import { ponder } from "ponder:registry";
import {trader_account } from "ponder:schema";
import { bigint, replaceBigInts } from "ponder";

ponder.on("OptionMarket:LogUpdateExerciseDelegate", async ({ event, context }) => {
    await context.db
    .update(trader_account, {
        address: event.transaction.from,
        chainId: context.network.chainId
    })
    .set({ exerciseDelegate: event.args.status });
    
})