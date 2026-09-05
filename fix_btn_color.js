const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update .btn CSS
html = html.replace(/color: white;\n\s*border: none;/g, 'color: var(--btn-text, white);\n            border: none;');

// Inject --btn-text: #000000; into dark mode noir
const noirDarkRegex = /\[data-mode="dark"\]\[data-theme="noir"\],[\s\S]*?--card-bg: rgba\(10, 10, 10, 0\.7\);/g;
html = html.replace(noirDarkRegex, (match) => {
    return match + '\n            --btn-text: #000000;';
});

fs.writeFileSync('index.html', html);
console.log("Fixed btn text color for Noir Dark");
