const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
const campainPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

const src = fs.readFileSync(campainPath, 'utf8');
const output = solc.compile(src, 1).contracts;

console.log('compiling..');

fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

for (const contract in output) { 
  fs.outputJSONSync(path.resolve(buildPath, `${contract.replace(':', '')}.json`), output[contract]);
}
