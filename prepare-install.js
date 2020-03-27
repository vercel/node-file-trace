const { unlinkSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const pkgJson = readFileSync(join(__dirname, 'package.json'), 'utf8');
const pkg = JSON.parse(pkgJson);
const isWin = process.platform === 'win32';
const isNode12 = process.version.startsWith('v12.');

if (isWin || isNode12) {
  unlinkSync(join(__dirname, 'yarn.lock'));
}

if (isWin) {
  // Delete the integration tests that will never work in Windows
  unlinkSync(join(__dirname, 'test', 'integration', 'tensorflow.js'));
  unlinkSync(join(__dirname, 'test', 'integration', 'argon2.js'));
  unlinkSync(join(__dirname, 'test', 'integration', 'highlights.js'));
  unlinkSync(join(__dirname, 'test', 'integration', 'hot-shots.js'));
  unlinkSync(join(__dirname, 'test', 'integration', 'loopback.js'));
  delete pkg.devDependencies['@tensorflow/tfjs-node'];
  delete pkg.devDependencies['argon2'];
  delete pkg.devDependencies['highlights'];
  delete pkg.devDependencies['hot-shots'];
}

writeFileSync(join(__dirname, 'package.json'), JSON.stringify(pkg));