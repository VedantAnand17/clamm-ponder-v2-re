import { ponder } from "ponder:registry";
import { automatorAPY } from "ponder:schema";
import { Automatorv11ABI } from "../abis/Automatorv11ABI.ts";

// ponder.on("Automator01APY:block", async ({ event, context }) => {
//   // Fetch the price at the current block height.
//   const startShares = 1000000000n;
//   const { assetChanges } = await context.client.simulateContract({
//     abi: Automatorv11ABI,
//     address: "0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C",
//     functionName: "redeem",
//     args: [startShares, 0n],
//   });
//   const latestPrice = assetChanges[0].amount;
//   console.log(latestPrice);

//   // Insert a row into the prices table.
//   await context.db.insert(automatorAPY).values({
//     automator: "0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C",
//     chainId: context.network.chainId,
//     timestamp: Number(event.block.timestamp),
//     currentAssets: latestPrice,
//   });
// });
