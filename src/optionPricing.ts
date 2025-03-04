import { ponder } from "ponder:registry";
import {
  trader_account,
  option_markets,
  primePool,
  optionPricing,
} from "ponder:schema";
import { bigint, client, index, replaceBigInts } from "ponder";
import { UniswapV3PoolABI } from "../abis/UniswapV3PoolABI";

ponder.on("optionPricing:IVsUpdated", async ({ event, context }) => {
  const chainId = Number(context.network.chainId);

  await context.db
    .insert(optionPricing)
    .values(
      replaceBigInts(
        {
          chainId,
          optionPricing: event.log.address,
          ttlIV: event.args.ttls.map((ttl, index) => ({
            ttl: Number(ttl),
            IV: event.args.ivs[index] ?? 0n,
          })),
        },
        String
      )
    )
    .onConflictDoUpdate(
      replaceBigInts(
        {
          ttlIV: event.args.ttls.map((ttl, index) => ({
            ttl: Number(ttl),
            IV: event.args.ivs[index] ?? 0n,
          })),
        },
        String
      )
    );
});
