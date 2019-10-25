const { promisify } = require('util');
const { existsSync } = require('fs');
const { join } = require('path');
const cp = require('child_process');
const exec = promisify(cp.exec);

const inputjs = 'unit/wildcard/input.js';
const outputjs = 'unit/wildcard/assets/asset1.txt';

function normalizeOutput(output) {
  if (process.platform === 'win32') {
  // When using Windows, the expected output should use backslash
    output = output.map(str => str.replace(/\//g, '\\'));
  }
  return output;
}

it('should correctly print trace from cli', async () => {
  const { stderr, stdout } = await exec(`../src/cli.js print ${inputjs}`, { cwd: __dirname });
  if (stderr) {
    throw new Error(stderr);
  }
  expect(normalizeOutput(stdout)).toMatch(outputjs);
});

it('should correctly print trace from required cli', async () => {
  // This test is only here to satisfy code coverage
  const cli = require('../src/cli.js')
  const files = [join(__dirname, inputjs)];
  const stdout = await cli('print', files);
  expect(normalizeOutput(stdout)).toMatch(outputjs);
});

it('should correctly build dist from cli', async () => {
  const { stderr } = await exec(`../src/cli.js build ${inputjs}`, { cwd: __dirname });
  if (stderr) {
    throw new Error(stderr);
  }
  const found = existsSync(join(__dirname, outputjs));
  expect(found).toBe(true);
});

it('should correctly print help when unknown action is used', async () => {
  const { stderr, stdout } = await exec(`../src/cli.js nothing ${inputjs}`, { cwd: __dirname });
  if (stderr) {
    throw new Error(stderr);
  }
  expect(normalizeOutput(stdout)).toMatch('provide an action');
});