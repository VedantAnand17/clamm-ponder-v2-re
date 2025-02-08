import { type Address, type PublicClient } from "viem";

// Standard ERC20 balanceOf ABI fragment
const erc20Abi = [{
  name: 'balanceOf',
  type: 'function',
  inputs: [{ name: 'account', type: 'address' }],
  outputs: [{ name: 'balance', type: 'uint256' }],
  stateMutability: 'view'
}] as const;

export async function getStrategyBalance(
  client: PublicClient,
  strategyAddress: Address,
  tokenAddresses: { asset: Address, counter: Address },
  blockParams?: { blockNumber: bigint }
) {
  const balances = await client.multicall({
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddresses.asset,
        functionName: 'balanceOf',
        args: [strategyAddress]
      },
      {
        abi: erc20Abi,
        address: tokenAddresses.counter,
        functionName: 'balanceOf',
        args: [strategyAddress]
      },
    ],
    ...blockParams,
    allowFailure: true
  });

  const [assetBalance, counterBalance] = balances.map(result => 
    result.status === 'success' ? result.result : 0n
  );

  return {
    asset_balance: assetBalance,
    counter_balance: counterBalance,
  };
}