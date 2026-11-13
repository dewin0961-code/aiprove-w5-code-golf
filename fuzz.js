// Fuzz the Pratt parser against native eval on randomly generated valid
// expressions (grammar-generated, so eval is a safe independent reference).
const { evalExpr } = require('./solution.js');
function rnd(n) { return Math.floor(Math.random() * n); }
function num() {
  const kind = rnd(5);
  if (kind === 0) return String(rnd(1000));
  if (kind === 1) return (rnd(1000) / 10).toFixed(1);
  if (kind === 2) return '.' + rnd(100);
  if (kind === 3) return String(rnd(100)) + 'e' + (rnd(2) ? '-' : '') + rnd(3);
  return String(rnd(100)) + '.' + rnd(100);
}
function expr(depth) {
  if (depth <= 0 || rnd(3) === 0) {
    let n = num();
    if (rnd(4) === 0) n = '-' + n;
    if (rnd(6) === 0) n = '(' + n + ')';
    return n;
  }
  const op = '+-*/'[rnd(4)];
  const l = expr(depth - 1), r = expr(depth - 1);
  let e = l + op + r;
  if (rnd(2)) e = '(' + e + ')';
  return e;
}
let compared = 0, skipped = 0, bad = 0;
for (let k = 0; k < 20000; k++) {
  const s = expr(3);
  let ref, threwRef = false;
  try { ref = eval(s); } catch (e) { threwRef = true; }
  if (threwRef) { skipped++; continue; } // e.g. '--' decrement syntax in raw eval
  let got, threw = false;
  try { got = evalExpr(s); } catch (e) { threw = true; }
  if (threw || (got !== ref && !(Number.isNaN(got) && Number.isNaN(ref)))) { bad++; if (bad <= 5) console.log('MISMATCH', JSON.stringify(s), 'got', threw ? 'THROW' : got, 'ref', ref); }
  else compared++;
}
console.log(`fuzz.js: ${compared} compared, ${skipped} skipped (eval itself rejects), ${bad} mismatches`);
if (bad) process.exit(1);
