import { ponder } from "ponder:registry";
import { autoExerciseEvents } from "ponder:schema";

ponder.on(
  "AutoExercise:LogExecutorExerciseOption",
  async ({ event, context }) => {
    const chainId = Number(context.network.chainId);

    await context.db.insert(autoExerciseEvents).values({
      chainId,
      autoExercise: event.log.address,
      optionMarket: event.args.optionMarket,
      tokenId: event.args.tokenId,
      owner: event.args.user,
      timestamp: Number(event.block.timestamp),
      asset: event.args.asset,
      amount: event.args.amountAfterExercise,
    });
  }
);
