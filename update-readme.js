const fs = require('fs');
const moment = require('moment');

const today = moment();
const newYear = moment().endOf('year');
const diffDays = newYear.diff(today, 'days');
const nextYear = newYear.year() + 1;

let fileContent = fs.readFileSync('README.md', 'utf8');

const marker = '<h3 align="left">When New Year:</h3>';
const index = fileContent.indexOf(marker);
if (index === -1) {
  console.error('Marker not found in README.md');
  process.exit(1);
}

fileContent = fileContent.replace(/\*\*\d+ days before \d+\*\* ⏱ days before new years\n/, '');

const readmeContent = `\n\n**${diffDays} days before ${nextYear}** ⏱ days before new years\n`;
fileContent = fileContent.slice(0, index + marker.length) + readmeContent + fileContent.slice(index + marker.length);

fs.writeFileSync('README.md', fileContent);
