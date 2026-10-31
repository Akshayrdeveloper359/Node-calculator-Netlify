'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { evaluate } = require('./calculator');

test('basic arithmetic and precedence', () => {
  assert.strictEqual(evaluate('2 + 3 * 4'), 14);
  assert.strictEqual(evaluate('(2 + 3) * 4'), 20);
  assert.strictEqual(evaluate('10 / 4'), 2.5);
  assert.strictEqual(evaluate('10 % 3'), 1);
});

test('unary minus and power', () => {
  assert.strictEqual(evaluate('-3 + 5'), 2);
  assert.strictEqual(evaluate('2 ^ 3 ^ 2'), 512);
  assert.strictEqual(evaluate('-2 ^ 2'), 4);
});

test('functions', () => {
  assert.strictEqual(evaluate('sqrt(16) + abs(-2)'), 6);
});

test('errors', () => {
  assert.throws(() => evaluate('1 / 0'), /Division by zero/);
  assert.throws(() => evaluate('2 +'), /Unexpected end/);
  assert.throws(() => evaluate('(1 + 2'), /Missing closing/);
  assert.throws(() => evaluate('2 $ 3'), /Unexpected character/);
});
