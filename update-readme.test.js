const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { updateReadme } = require('./update-readme');

const readme = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');

test('preserves the profile and footer when updating the countdown', () => {
  const updated = updateReadme(readme, new Date('2026-11-09T11:27:00Z'));
  const before = '<!-- NEW-YEAR-COUNTDOWN:START -->';
  const after = '<!-- NEW-YEAR-COUNTDOWN:END -->';

  assert.ok(updated.includes('**53 days until 2027.**'));
  assert.equal(updated.split(before)[0], readme.split(before)[0]);
  assert.equal(updated.split(after)[1], readme.split(after)[1]);
});

test('repeated updates on the same UTC day do not accumulate whitespace', () => {
  const first = updateReadme(readme, new Date('2026-11-09T00:00:00Z'));
  let repeated = first;

  for (let run = 0; run < 100; run += 1) {
    repeated = updateReadme(repeated, new Date('2026-11-09T23:59:59Z'));
  }

  assert.equal(repeated, first);
});

test('consecutive days produce a change for the daily commit', () => {
  const first = updateReadme(readme, new Date('2026-11-09T11:27:00Z'));
  const next = updateReadme(first, new Date('2026-11-10T11:27:00Z'));

  assert.notEqual(next, first);
  assert.ok(next.includes('**52 days until 2027.**'));
});

test('handles year boundaries and leap years using UTC calendar days', () => {
  const examples = [
    ['2026-12-31T23:59:59Z', '**1 day until 2027.**'],
    ['2027-01-01T00:00:00Z', '**365 days until 2028.**'],
    ['2028-01-01T00:00:00Z', '**366 days until 2029.**'],
    ['2026-11-10T00:30:00+01:00', '**53 days until 2027.**'],
  ];

  for (const [date, expected] of examples) {
    assert.ok(updateReadme(readme, new Date(date)).includes(expected), date);
  }
});

test('refuses to update a README without the countdown markers', () => {
  assert.throws(() => updateReadme('# Profile\n'), /countdown markers not found/);
});
