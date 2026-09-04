const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const noirPill = `            <div class="theme-pill" onclick="setTheme('noir', event)">
                <span class="theme-dot" style="background:#000000; border: 1px solid var(--glass-border);"></span> Noir
            </div>`;

// Find the cyber pill
html = html.replace(/(<div class="theme-pill" onclick="setTheme\('cyber', event\)">\s*<span class="theme-dot" style="background:[^>]+><\/span> Cyber\s*<\/div>)/g, '$1\n' + noirPill);

fs.writeFileSync('index.html', html);
console.log('Noir pill added!');
