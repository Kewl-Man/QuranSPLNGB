const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = "Meaning: ${w.m} | Type: ${w.p} ${w.r ? '| Root: ' + w.r : ''}</div>";
const replacementStr = "Meaning: ${w.m} | Type: ${w.p} ${w.r ? '| Root: ' + w.r : ''} | Occurs: ${w.o}</div>";

html = html.replace(targetStr, replacementStr);
fs.writeFileSync('index.html', html);
console.log("Updated occurrences in history");
