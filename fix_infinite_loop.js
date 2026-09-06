const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/function showMenu\(\) \{ \n\s*updateMenuButtons\(\);\n\s*showMenu\(\); \n\s*\}/g, 
`function showMenu() { 
            updateMenuButtons();
            switchScreen('screen-menu'); 
        }`);

fs.writeFileSync('index.html', html);
console.log('Fixed infinite loop');
