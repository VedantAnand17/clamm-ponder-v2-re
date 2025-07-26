const https = require('https');

const RPC_URL = 'https://testnet-rpc.monad.xyz';
const OPTION_MARKET = '0x8fCc18a604C85475BE9DF68d6C106a1ca26A73cc';

// This is a rough estimate - you'll need the actual ABI
const SAMPLE_CALLS = {
  // Check if market is initialized
  isInitialized: '0x392e53cd', // isInitialized() function selector
  
  // These are example values - replace with actual parameters for your deployment
  initializeMarket: {
    selector: '0x485cc955', // initialize(address,address,address,address,address) - example
    // You'll need actual addresses for your deployment:
    // primePool, optionPricing, dpFee, callAsset, putAsset
  }
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

async function checkInitialization() {
  console.log('🔍 Checking if Option Market is initialized...');
  
  try {
    // Try to call a view function to check state
    const response = await makeRPCCall('eth_call', [
      {
        to: OPTION_MARKET,
        data: SAMPLE_CALLS.isInitialized
      },
      'latest'
    ]);
    
    console.log('Response:', response);
    
    if (response.result === '0x') {
      console.log('❌ Market appears uninitialized or function does not exist');
    } else {
      console.log('✅ Market may be initialized, result:', response.result);
    }
    
  } catch (error) {
    console.error('❌ Error checking initialization:', error.message);
  }
}

async function main() {
  console.log('🚀 Option Market Initialization Checker');
  console.log('======================================');
  console.log(`📋 Market Address: ${OPTION_MARKET}`);
  
  await checkInitialization();
  
  console.log('\n💡 Next Steps:');
  console.log('1. If the market is not initialized, you need to call the initialization function');
  console.log('2. Check your deployment scripts or documentation for the correct initialization parameters');
  console.log('3. The initialization should emit LogOptionsMarketInitialized event');
  console.log('4. Once initialized, Ponder will start capturing data');
  
  console.log('\n🔧 To initialize (you need the correct parameters):');
  console.log('- primePool address');
  console.log('- optionPricing address'); 
  console.log('- dpFee (fee strategy) address');
  console.log('- callAsset address');
  console.log('- putAsset address');
}

main().catch(console.error); 