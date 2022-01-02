const v8 = require("v8"); // chrome/browser v8 engine

// console.log(v8.getHeapStatistics()); // get stats

const totalHeapSize = v8.getHeapStatistics().total_available_size;
const totalHeapSizeInGB = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2);

const STATS = `Total Heap Size (bytes) ${totalHeapSize} & (GB) ${totalHeapSizeInGB}`;
console.log(STATS);

// check/increase heap size for node.js
// node nodeHeapSize.js
// node --max-old-space-size=4096 nodeHeapSize.js
// node --max-old-space-size=8192 nodeHeapSize.js

// $ NODE_OPTIONS=--max_old_space_size=4096 node
// Welcome to Node.js v14.17.4.
// Type ".help" for more information.
// > v8.getHeapStatistics()


// node --max-old-space-size=1024 nodeHeapSize.js #increase to 1gb
// node --max-old-space-size=2048 nodeHeapSize.js #increase to 2gb
// node --max-old-space-size=3072 nodeHeapSize.js #increase to 3gb
// node --max-old-space-size=4096 nodeHeapSize.js #increase to 4gb
// node --max-old-space-size=5120 nodeHeapSize.js #increase to 5gb
// node --max-old-space-size=6144 nodeHeapSize.js #increase to 6gb
// node --max-old-space-size=7168 nodeHeapSize.js #increase to 7gb
// node --max-old-space-size=8192 nodeHeapSize.js #increase to 8gb
