const crypto = require('crypto');

function keccak256(data) {
  return crypto.createHash('sha3-256').update(data).digest('hex');
}

// Define the correct event signatures based on the ABI
const events = {
  'LogMintOption': 'LogMintOption(address,uint256,bool,uint256,uint256,uint256)',
  'LogOptionsMarketInitialized': 'LogOptionsMarketInitialized(address,address,address,address,address)',
  'Transfer': 'Transfer(address,address,uint256)' // ERC20 standard
};

console.log('Calculating correct event signatures...\n');

for (const [eventName, signature] of Object.entries(events)) {
  const hash = '0x' + keccak256(signature);
  console.log(`${eventName}: '${hash}',`);
  console.log(`  Signature: ${signature}\n`);
}

console.log('Copy these to replace the incorrect ones in diagnose_sync.cjs'); 