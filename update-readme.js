const fs = require('node:fs');
const path = require('node:path');

function updateReadme(content, today = new Date()) {
  const block = /<!-- NEW-YEAR-COUNTDOWN:START -->[\s\S]*?<!-- NEW-YEAR-COUNTDOWN:END -->/;

  if (!block.test(content)) {
    throw new Error('NewYearBot countdown markers not found in README.md');
  }

  const nextYear = today.getUTCFullYear() + 1;
  const startOfDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const newYear = Date.UTC(nextYear, 0, 1);
  const days = (newYear - startOfDay) / (24 * 60 * 60 * 1000);

  return content.replace(block, [
    '<!-- NEW-YEAR-COUNTDOWN:START -->',
    `**${days} ${days === 1 ? 'day' : 'days'} until ${nextYear}.**`,
    '<!-- NEW-YEAR-COUNTDOWN:END -->',
  ].join('\n'));
}

if (require.main === module) {
  const readmePath = path.join(__dirname, 'README.md');
  const content = fs.readFileSync(readmePath, 'utf8');
  fs.writeFileSync(readmePath, updateReadme(content));
}

module.exports = { updateReadme };
