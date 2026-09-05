const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/\.option-btn\.active \{\s*background: var\(--primary\);\s*color: white;/g, '.option-btn.active {\n            background: var(--primary);\n            color: var(--btn-text, white);');

fs.writeFileSync('index.html', html);
console.log("Fixed option-btn text color");
