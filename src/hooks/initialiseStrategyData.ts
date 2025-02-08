import { type Address, type PublicClient } from "viem";
import { type Contract } from "ponder";

export async function initialiseStrategyData(
  client: PublicClient,
  address: Address,
  contractAbi: Contract['abi']
) {
  const results = await client.multicall({
    contracts: [
      {
        abi: contractAbi,
        address: address,
        functionName: 'pool',
      },
      {
        abi: contractAbi,
        address: address,
        functionName: 'router',
      },
      {
        abi: contractAbi,
        address: address,
        functionName: 'poolTickSpacing',
      },
      {
        abi: contractAbi,
        address: address,
        functionName: 'balancer',
      },
      {
        abi: contractAbi,
        address: address,
        functionName: 'asset',
      },
      {
        abi: contractAbi,
        address: address,
        functionName: 'counterAsset',
      },
      {
        abi: contractAbi,
        address: address,
        functionName: 'depositFeePips',
      },
      {
        abi: contractAbi,
        address: address,
        functionName: 'manager',
      },
      {
        abi: contractAbi,
        address: address,
        functionName: 'handler',
      },
    ],
    allowFailure: true
  });

  const [
    pool_address,
    router_address,
    pool_tick_spacing,
    balancer_vault,
    asset_address,
    counter_address,
    depositFeePips,
    position_manager,
    liquidity_handler,
  ] = results.map(result => 
    result.status === 'success' ? result.result : null
  );

  return {
    pool: pool_address,
    router: router_address,
    pool_tick_spacing: pool_tick_spacing,
    balancer_vault: balancer_vault,
    asset: asset_address,
    counter: counter_address,
    deposit_fee_pips: depositFeePips,
    position_manager: position_manager,
    liquidity_handler: liquidity_handler,
  };
}