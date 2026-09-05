const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/\.flashcard-whitelist-btn:hover \{\s*transform: scale\(1\.08\);\s*background: var\(--primary\);\s*color: white;/g, '.flashcard-whitelist-btn:hover {\n            transform: scale(1.08);\n            background: var(--primary);\n            color: var(--btn-text, white);');

fs.writeFileSync('index.html', html);
console.log("Fixed flashcard-whitelist-btn text color");
