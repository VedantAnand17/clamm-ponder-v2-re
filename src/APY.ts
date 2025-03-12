import { ponder } from "ponder:registry";
import { db } from "ponder:api";
import schema, {
  automatorAPY,
  automatorAssets,
  poolTVLandOpenInterest,
  user_liquidity_position,
} from "ponder:schema";
import { Automatorv11ABI } from "../abis/Automatorv11ABI";
import { client, graphql, eq, and, lt, gt } from "ponder";
import * as fs from "fs/promises";
import { Automatorv21ABI } from "../abis/Automatorv21ABI";
import { VaultInspectorV2ABI } from "../abis/VaultInspectorV2";

// ponder.on("AutomatorAssets:block", async ({ event, context }) => {
//   const freeAssets = await context.client.readContract({
//     abi: VaultInspectorV2ABI,
//     address: "0x9b03c32fa0695aDBFe49f38b552861cF46264832",
//     functionName: "freeAssets",
//     args: ["0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C"],
//   });
//   const [sumAmount0, sumAmount1] = await context.client.readContract({
//     abi: VaultInspectorV2ABI,
//     address: "0x9b03c32fa0695aDBFe49f38b552861cF46264832",
//     functionName: "freePoolPositionInToken01",
//     args: ["0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C"],
//   });
//   await context.db.insert(automatorAssets).values({
//     automator: "0xe1B68841E764Cc31be1Eb1e59d156a4ED1217c2C",
//     chainId: context.network.chainId,
//     timestamp: Number(event.block.timestamp),
//     freePoolPositionAmount0: sumAmount0,
//     freePoolPositionAmount1: sumAmount1,
//     freeAssets: freeAssets,
//   });
// });

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

// Function to get aggregated liquidity by tick ranges for a specific pool
// async function getLiquidityByTickRanges(poolAddress: string) {
//   try {
//     // Query user_liquidity_position for the specified pool using the query builder pattern
//     const positions = await db.query.user_liquidity_position.findMany({
//       columns: {
//         tick_lower: true,
//         tick_upper: true,
//         total_liquidity: true,
//       },
//       where: (table, { eq }) => eq(table.pool, poolAddress as `0x${string}`),
//     });

//     // Early return for debugging
//     if (!positions || positions.length === 0) {
//       console.log(`No positions found for pool ${poolAddress}`);
//       return "1";
//     }

//     console.log(`Found ${positions.length} positions for pool ${poolAddress}`);

//     // Group positions by tick ranges and sum total_liquidity
//     const liquidityMap = new Map<string, bigint>();

//     for (const position of positions) {
//       // Skip positions with null/undefined values
//       if (
//         position.tick_lower === null ||
//         position.tick_upper === null ||
//         position.total_liquidity === null
//       ) {
//         console.log("Skipping position with null values:", position);
//         return "111";
//       }

//       const key = `${position.tick_lower}_${position.tick_upper}`;
//       const currentSum = liquidityMap.get(key) || 0n;

//       try {
//         // Safely convert the total_liquidity to BigInt
//         const liquidityValue = BigInt(String(position.total_liquidity));
//         liquidityMap.set(key, currentSum + liquidityValue);
//       } catch (error) {
//         console.error(
//           `Error converting liquidity to BigInt: ${position.total_liquidity}`,
//           error
//         );
//         // Continue processing other positions
//       }
//     }

//     // Format the result as an array of objects
//     const totalLiquidity = Array.from(liquidityMap.entries()).map(
//       ([key, sum]) => {
//         const [tick_lower, tick_upper] = key.split("_").map(Number);
//         return {
//           tick_lower,
//           tick_upper,
//           sumOfTotalLiquidity: sum.toString(),
//         };
//       }
//     );

//     return totalLiquidity;
//   } catch (error) {
//     console.error("Error in getLiquidityByTickRanges:", error);
//     // Log more details about the error
//     if (error instanceof Error) {
//       console.error("Error message:", error.message);
//       console.error("Error stack:", error.stack);
//     }
//     return [];
//   }
// }
// ponder.on("PoolTVLandOpenInterest:block", async ({ event, context }) => {
//   try {
//     const pool = "0xd0b53D9277642d899DF5C87A3966A349A798f224";

//     // Get aggregated liquidity by tick ranges
//     const liquidityByTicks = await getLiquidityByTickRanges(pool);

//     // Add more detailed logging to diagnose the issue
//     console.log(
//       `Found ${
//         Array.isArray(liquidityByTicks)
//           ? liquidityByTicks.length
//           : typeof liquidityByTicks === "number"
//           ? liquidityByTicks
//           : "unknown"
//       } aggregated tick ranges for pool ${pool}`
//     );

//     await fs.writeFile("liquidity.json", JSON.stringify(liquidityByTicks));

//     // Calculate token balances (you need to implement this part)
//     const token0bal = 0n; // Replace with actual calculation
//     const token1bal = 0n; // Replace with actual calculation

//     // Determine the token0balance value based on the return type
//     const token0balance = Array.isArray(liquidityByTicks)
//       ? liquidityByTicks.length
//       : typeof liquidityByTicks === "number"
//       ? liquidityByTicks
//       : 0;

//     // Only proceed with database insert if we have liquidity data
//     // await context.db.insert(poolTVLandOpenInterest).values({
//     //   pool: "0xd0b53D9277642d899DF5C87A3966A349A798F224",
//     //   chainId: context.network.chainId,
//     //   timestamp: Number(event.block.timestamp),
//     //   token0balance: token0balance,
//     //   token1balance: token1bal,
//     // });
//   } catch (error) {
//     console.error("Error in PoolTVLandOpenInterest:block handler:", error);
//   }
// });
