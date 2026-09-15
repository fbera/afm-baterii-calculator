const assert = require('node:assert/strict');
const { calculateProject } = require('./calculator.js');
const base = { capacity: 10, total: 20000, ineligible: 0, funding: 15000 };
const calc = changes => calculateProject({ ...base, ...changes });
assert.equal(calc({}).score, 35);
assert.equal(calc({ capacity: 20 }).score, 60);
assert.equal(calc({ capacity: 20, total: 40000 }).score, 100);
assert.equal(calc({ capacity: 30, total: 40000 }).score, 100);
assert.equal(calc({ capacity: 10.24 }).capacityScore, 25.6);
assert.equal(calc({ total: 15000, funding: 11250 }).score, 35);
assert.equal(calc({ total: 30000 }).limit, 15000);
assert.equal(calc({ ineligible: 10000, funding: 10000 }).score, 55);
for (const change of [{capacity: 9.99}, {funding: 15000.01}, {funding: 0}, {funding: -1}, {total: 0}, {ineligible: -1}, {ineligible: 20001}, {capacity: NaN}, {total: Infinity}, {total: 15000}, {ineligible: 10000}]) {
  assert.ok(calc(change).errors.length > 0, JSON.stringify(change));
}
console.log('All 20 scoring and validation checks passed.');
