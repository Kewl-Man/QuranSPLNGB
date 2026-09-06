const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /switchScreen\('screen-menu'\);/g;
html = html.replace(regex, `showMenu();`);

fs.writeFileSync('index.html', html);
console.log('Fixed initAppRouting');
