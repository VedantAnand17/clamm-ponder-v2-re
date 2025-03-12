import { ponder } from "ponder:registry";
import { db } from "ponder:api";
import schema, {
  automatorAPY,
  automatorAssets,
  optionMarketTotals,
  poolTVLandOpenInterest,
  user_liquidity_position,
} from "ponder:schema";

import { TVLPreviewABI } from "../abis/TVLPreviewABI";
// ponder.on("tvlInfo:block", async ({ event, context }) => {
//   const tvlInfos = await context.client.readContract({
//     abi: TVLPreviewABI,
//     address: "0x2558a965AA5D4851724dd4dfd3E06Aab1b8F74fE",
//     functionName: "optionMarketTvl",
//     args: [["0xd9e33c71D5A405A642C173f8f914F1Bb59009Aaf"], 0n, 0n],
//   });

//   // The function returns an array, but we're only passing one market so we can access index 0
//   const marketInfo = tvlInfos[0];

//   await context.db.insert(optionMarketTotals).values({
//     timestamp: Number(event.block.timestamp),
//     optionMarket: "0xd9e33c71D5A405A642C173f8f914F1Bb59009Aaf",
//     chainId: context.network.chainId,
//     callAssetOutside: marketInfo.totalCallAssetRemoved,
//     putAssetOutside: marketInfo.totalPutAssetRemoved,
//   });
// });
