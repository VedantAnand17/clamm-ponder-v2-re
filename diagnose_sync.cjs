const https = require('https');

const RPC_URL = 'https://still-stylish-general.monad-testnet.quiknode.pro/f686122d4301cb46397e299c0454bf12543df274';
const CONTRACTS = {
  OptionMarket: '0xd851E7f448c8EF6Aea887590B3A8a91979b8F31a',
  Automatorv21: ['0x477Abf43f0E6899ACdCb9D17474627E54B4C1946', '0x0d83AE1933b21bb96166f7570C18576E3A8a792B'],
  LiquidityHandler: '0x0B3a5F1633B27ab5b487461DC8defE906Ba0ddA8'
};

const START_BLOCK = 26718971; // 0x197b2fb
const LATEST_BLOCK_HEX = '0x1a82c87'; // ~27682951

// Event signatures for key events
const EVENT_SIGNATURES = {
  LogOptionsMarketInitialized: '0x4911d4a2d9b6b46b85f970e7e5fd7c57fe6dd6b9cb6e7dbec4a9b7901e1c9a9e', // This might be incorrect
  Transfer: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  LogMintOption: '0x1dd1286e7e35885a7d296f5a3fc8a2e7ace5ea4c879bbc4e2a4229990398569f' // This might also be incorrect
};

function makeRPCCall(method, params) {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: 1
  });

  const url = new URL(RPC_URL);
  const options = {
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function checkContractCode(address) {
  try {
    const response = await makeRPCCall('eth_getCode', [address, 'latest']);
    const hasCode = response.result && response.result !== '0x';
    console.log(`📋 Contract ${address}: ${hasCode ? '✅ HAS CODE' : '❌ NO CODE'}`);
    return hasCode;
  } catch (error) {
    console.error(`❌ Error checking contract ${address}:`, error.message);
    return false;
  }
}

async function checkLogsInRange(address, fromBlock, toBlock, topics = null) {
  try {
    const params = {
      fromBlock: `0x${fromBlock.toString(16)}`,
      toBlock: `0x${toBlock.toString(16)}`,
      address: address
    };
    
    if (topics) {
      params.topics = [topics];
    }

    const response = await makeRPCCall('eth_getLogs', [params]);
    
    if (response.error) {
      console.log(`⚠️  Error in range ${fromBlock}-${toBlock}: ${response.error.message}`);
      return [];
    }
    
    const logs = response.result || [];
    if (logs.length > 0) {
      console.log(`🎯 Found ${logs.length} events in blocks ${fromBlock}-${toBlock} for ${address}`);
      logs.forEach((log, i) => {
        console.log(`   Event ${i + 1}: Block ${parseInt(log.blockNumber, 16)}, TX: ${log.transactionHash}`);
      });
    }
    return logs;
  } catch (error) {
    console.error(`❌ Error checking logs for ${address}:`, error.message);
    return [];
  }
}

async function scanForEvents(address, startBlock, endBlock, chunkSize = 100) {
  console.log(`🔍 Scanning for events in ${address} from block ${startBlock} to ${endBlock}`);
  let totalEvents = 0;
  
  for (let currentBlock = startBlock; currentBlock < endBlock; currentBlock += chunkSize) {
    const toBlock = Math.min(currentBlock + chunkSize - 1, endBlock);
    const events = await checkLogsInRange(address, currentBlock, toBlock);
    totalEvents += events.length;
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`📊 Total events found for ${address}: ${totalEvents}`);
  return totalEvents;
}

async function diagnose() {
  console.log('🔧 Starting Ponder Sync Diagnostic Tool');
  console.log('=====================================');
  
  // Check current block
  try {
    const currentBlockResponse = await makeRPCCall('eth_blockNumber', []);
    const currentBlock = parseInt(currentBlockResponse.result, 16);
    console.log(`📊 Current block: ${currentBlock} (${currentBlockResponse.result})`);
    console.log(`📊 Start block: ${START_BLOCK} (0x${START_BLOCK.toString(16)})`);
    console.log(`📊 Blocks to sync: ${currentBlock - START_BLOCK}`);
  } catch (error) {
    console.error('❌ Error getting current block:', error.message);
    return;
  }

  // Check all contracts exist
  console.log('\n🔍 Checking contract deployments...');
  for (const [name, addresses] of Object.entries(CONTRACTS)) {
    const addressArray = Array.isArray(addresses) ? addresses : [addresses];
    for (const address of addressArray) {
      await checkContractCode(address);
    }
  }

  // Check for events around start block
  console.log('\n🔍 Checking for events around start block...');
  const testRanges = [
    [START_BLOCK - 1000, START_BLOCK - 1], // Before start block
    [START_BLOCK, START_BLOCK + 100], // At start block
    [START_BLOCK + 1000, START_BLOCK + 1100], // After start block
  ];

  for (const [fromBlock, toBlock] of testRanges) {
    console.log(`\n📅 Checking range ${fromBlock} - ${toBlock}:`);
    await checkLogsInRange(CONTRACTS.OptionMarket, fromBlock, toBlock);
    
    // Check first Automator contract
    await checkLogsInRange(CONTRACTS.Automatorv21[0], fromBlock, toBlock);
  }

  // Look for LogOptionsMarketInitialized events specifically
  console.log('\n🎯 Looking specifically for LogOptionsMarketInitialized events...');
  console.log('(This is critical - without this event, no option markets will be created!)');
  
  // Scan broader range for initialization events
  const broadRanges = [
    [1, 1000000], // Very early blocks
    [26000000, 26500000], // Before deployment
    [26500000, 27000000], // Around deployment
    [27000000, 27700000], // Recent blocks
  ];

  for (const [fromBlock, toBlock] of broadRanges) {
    console.log(`\nScanning blocks ${fromBlock} - ${toBlock} for initialization events...`);
    try {
      await checkLogsInRange(CONTRACTS.OptionMarket, fromBlock, Math.min(fromBlock + 100, toBlock));
    } catch (error) {
      console.log(`Skipping range due to error: ${error.message}`);
    }
  }

  console.log('\n📋 Diagnostic Summary:');
  console.log('=====================');
  console.log('1. ✅ RPC connection works');
  console.log('2. ✅ Contracts are deployed');
  console.log('3. ❓ Check above for events found');
  console.log('\n💡 Recommendations:');
  console.log('- If NO LogOptionsMarketInitialized events found: The option market needs to be initialized first');
  console.log('- If events found BEFORE start block: Lower the startBlock in ponder.config.ts');
  console.log('- If events found AFTER start block: Wait for sync to progress or check for contract interaction');
  console.log('- If NO events found anywhere: The contracts may not have been used yet');
}

diagnose().catch(console.error); 