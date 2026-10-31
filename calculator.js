'use strict';

// Supports: + - * / % ^  parentheses, unary minus, decimals
// and a few functions: sqrt, abs, round, floor, ceil
// Recursive-descent parser, so no eval() is needed.

const FUNCTIONS = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
};

function tokenize(input) {
  const tokens = [];
  const re = /\s*(?:(\d+\.?\d*|\.\d+)|([a-z]+)|(.))/gy;
  let m;
  while (re.lastIndex < input.length && (m = re.exec(input))) {
    if (m[1] !== undefined) tokens.push({ type: 'num', value: parseFloat(m[1]) });
    else if (m[2] !== undefined) tokens.push({ type: 'id', value: m[2] });
    else if ('+-*/%^()'.includes(m[3])) tokens.push({ type: 'op', value: m[3] });
    else throw new Error(`Unexpected character "${m[3]}"`);
  }
  return tokens;
}

function evaluate(input) {
  const tokens = tokenize(input);
  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];
  const isOp = (v) => peek() && peek().type === 'op' && peek().value === v;

  // expression := term (('+' | '-') term)*
  function expression() {
    let left = term();
    while (isOp('+') || isOp('-')) {
      const op = next().value;
      const right = term();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  // term := power (('*' | '/' | '%') power)*
  function term() {
    let left = power();
    while (isOp('*') || isOp('/') || isOp('%')) {
      const op = next().value;
      const right = power();
      if ((op === '/' || op === '%') && right === 0) throw new Error('Division by zero');
      left = op === '*' ? left * right : op === '/' ? left / right : left % right;
    }
    return left;
  }

  // power := unary ('^' power)?   (right-associative)
  function power() {
    const base = unary();
    if (isOp('^')) {
      next();
      return Math.pow(base, power());
    }
    return base;
  }

  // unary := '-' unary | '+' unary | primary
  function unary() {
    if (isOp('-')) { next(); return -unary(); }
    if (isOp('+')) { next(); return unary(); }
    return primary();
  }

  // primary := number | id '(' expression ')' | '(' expression ')'
  function primary() {
    const t = next();
    if (!t) throw new Error('Unexpected end of expression');
    if (t.type === 'num') return t.value;
    if (t.type === 'id') {
      const fn = FUNCTIONS[t.value];
      if (!fn) throw new Error(`Unknown function "${t.value}"`);
      if (!isOp('(')) throw new Error(`Expected "(" after ${t.value}`);
      next();
      const arg = expression();
      if (!isOp(')')) throw new Error('Missing closing ")"');
      next();
      return fn(arg);
    }
    if (t.value === '(') {
      const val = expression();
      if (!isOp(')')) throw new Error('Missing closing ")"');
      next();
      return val;
    }
    throw new Error(`Unexpected token "${t.value}"`);
  }

  const result = expression();
  if (pos < tokens.length) throw new Error(`Unexpected token "${peek().value}"`);
  return result;
}

if (typeof module !== 'undefined' && module.exports) module.exports = { evaluate };
if (typeof window !== 'undefined') window.Calc = { evaluate };
