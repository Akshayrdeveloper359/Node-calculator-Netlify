#!/usr/bin/env node
'use strict';

const readline = require('node:readline');
const { evaluate } = require('./calculator');

const format = (n) => String(Number.isInteger(n) ? n : +n.toFixed(10));

// One-shot mode: node cli.js "2 + 3 * 4"
if (process.argv.length > 2) {
  try {
    console.log(format(evaluate(process.argv.slice(2).join(' '))));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  return;
}

// Interactive mode
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '> ' });
let last = 0;

console.log('Node calculator. Type an expression, "ans" for last result, "exit" to quit.');
rl.prompt();

rl.on('line', (line) => {
  const text = line.trim();
  if (text === 'exit' || text === 'quit') return rl.close();
  if (text) {
    try {
      last = evaluate(text.replace(/\bans\b/g, `(${last})`));
      console.log(format(last));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
  rl.prompt();
});

rl.on('close', () => process.exit(0));
