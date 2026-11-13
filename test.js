// code-golf-expr (wallet 5, Pratt parser) — public cases + edge cases.
const { evalExpr } = require('./solution.js');
const cases = require('/home/hatch/workspace/aiprove/aiprove-repo/challenges/code-golf-expr/cases.json');
let pass = 0, fail = 0;
function eq(a, b) { return a === b || (Number.isNaN(a) && Number.isNaN(b)); }
function check(input, expected) {
  let got, threw = false;
  try { got = evalExpr(input); } catch (e) { threw = true; }
  const ok = expected === 'THROW' ? threw : (!threw && eq(got, expected));
  if (ok) pass++; else { fail++; console.log('FAIL', JSON.stringify(input), 'got', threw ? 'THROW' : got, 'want', expected); }
}
for (const c of cases) check(c.in, c.out);
// edge cases: unary, nesting, decimals, whitespace, exponents, div-by-zero, associativity
const edges = [
  ['-5', -5], ['+5', 5], ['--5', 5], ['---5', -5], ['-(2+3)', -5], ['+(2+3)', 5],
  ['2*-3', -6], ['2/-4', -0.5], ['5--3', 8], ['5+-3', 2], ['2*--3', 6],
  ['.5', 0.5], ['5.', 5], ['.5e2', 50], ['1e3', 1000], ['2.5e-1', 0.25], ['1E3', 1000],
  [' 1 + 2 ', 3], ['\t2\n*\n3', 6], ['1/0', Infinity], ['0/0', NaN], ['-1/0', -Infinity],
  ['7-3-2', 2], ['100/10/2', 5], ['2+3*4', 14], ['(2+3)*4', 20], ['((1))', 1],
  ['((((1+2))))', 3], ['0', 0], ['0.1+0.2', 0.30000000000000004], ['10%3', 'THROW'],
  ['1+2)', 'THROW'], ['((1', 'THROW'], ['abc', 'THROW'], ['1..2', 'THROW'],
  ['', 'THROW'], ['   ', 'THROW'], ['1+', 'THROW'], ['*2', 'THROW'], ['()', 'THROW'],
  ['2**3', 'THROW'], ['1+process.exit(9)', 'THROW'], ['require("fs")', 'THROW'],
  ['1e', 'THROW'], ['999999*999999', 999998000001], ['1/3', 1 / 3],
  ['((2+3)*(4-1))/5', 3], ['-(-(-2))', -2], ['3*(2+1)*(1+1)', 18],
];
for (const [inp, exp] of edges) check(inp, exp);
// 500-deep nesting
let deep = '1', d = 0; for (let k = 0; k < 500; k++) { deep = '(' + deep + '+1)'; d++; }
check(deep, 501);
console.log(`test.js: ${pass} pass, ${fail} fail`);
if (fail) process.exit(1);
