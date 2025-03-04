import { ponder } from "ponder:registry";
import { db } from "ponder:api";
import schema, {
  automatorAPY,
  automatorAssets,
  liquidityHandlerTotals,
  optionMarketTotals,
  poolTVLandOpenInterest,
  user_liquidity_position,
} from "ponder:schema";

import { TVLPreviewABI } from "../abis/TVLPreviewABI";
ponder.on("tvlInfo:block", async ({ event, context }) => {
  const [result] = await context.client.readContract({
    abi: TVLPreviewABI,
    address: "0x2558a965AA5D4851724dd4dfd3E06Aab1b8F74fE",
    functionName: "optionMarketTvl",
    args: [["0xd9e33c71D5A405A642C173f8f914F1Bb59009Aaf"], 0n, 0n],
  });
  await context.db.insert(optionMarketTotals).values({
    timestamp: Number(event.block.timestamp),
    optionMarket: "0xd9e33c71D5A405A642C173f8f914F1Bb59009Aaf",
    chainId: context.network.chainId,
    totalCallPositions: result?.totalCallPositions ?? 0n,
    totalPutPositions: result?.totalPutPositions ?? 0n,
    callAssetOutside: result?.totalCallAssetRemoved ?? 0n,
    putAssetOutside: result?.totalPutAssetRemoved ?? 0n,
  });

  const [liquidityHandlerResult] = await context.client.readContract({
    abi: TVLPreviewABI,
    address: "0x2558a965AA5D4851724dd4dfd3E06Aab1b8F74fE",
    functionName: "liquidityHandlerTvl",
    args: [
      ["0x2Cab86e7b648EbDe5dDFae913Bdb58DA3d723Cd6"],
      ["0xd0b53D9277642d899DF5C87A3966A349A798F224"],
      -200,
      200,
    ],
  });

  await context.db.insert(liquidityHandlerTotals).values({
    timestamp: Number(event.block.timestamp),
    liquidityHandler: "0x2Cab86e7b648EbDe5dDFae913Bdb58DA3d723Cd6",
    chainId: context.network.chainId,
    totalFreeAmount0: liquidityHandlerResult?.totalFreeAmount0 ?? 0n,
    totalFreeAmount1: liquidityHandlerResult?.totalFreeAmount1 ?? 0n,
  });
});
