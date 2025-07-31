import { ponder } from "ponder:registry";
import {
  trader_account,
  option_markets,
  primePool,
  optionPricing,
  IvUpdateEvents,
} from "ponder:schema";
import { bigint, client, index, replaceBigInts } from "ponder";
import { UniswapV3PoolABI } from "../abis/UniswapV3PoolABI";

ponder.on("optionPricing:UpdatedIVs", async ({ event, context }) => {
  const args = event.args as { ttls: readonly bigint[]; ttlIVs: readonly bigint[] };
  const chainId = Number(context.network.chainId);

  await context.db.insert(IvUpdateEvents).values(
    replaceBigInts(
      {
        chainId,
        optionPricing: event.log.address,
        ttlIV: args.ttls.map((ttl, index) => ({
          ttl: Number(ttl),
          IV: args.ttlIVs[index] ?? 0n,
        })),
        timestamp: Number(event.block.timestamp),
      },
      String
    )
  );

  await context.db
    .insert(optionPricing)
    .values(
      replaceBigInts(
        {
          chainId,
          optionPricing: event.log.address,
          ttlIV: args.ttls.map((ttl, index) => ({
            ttl: Number(ttl),
            IV: args.ttlIVs[index] ?? 0n,
          })),
        },
        String
      )
    )
    .onConflictDoUpdate(
      replaceBigInts(
        {
          ttlIV: args.ttls.map((ttl, index) => ({
            ttl: Number(ttl),
            IV: args.ttlIVs[index] ?? 0n,
          })),
        },
        String
      )
    );
});
