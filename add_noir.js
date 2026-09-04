const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Insert Dark Mode CSS
const darkNoirCSS = `
        [data-mode="dark"][data-theme="noir"],
        :root:not([data-mode="light"])[data-theme="noir"] {
            --bg-color-1: #000000;
            --bg-color-2: #111111;
            --glass-bg: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.2);
            --primary: #ffffff;
            --primary-glow: rgba(255, 255, 255, 0.3);
            --primary-hover: #d4d4d8;
            --secondary: #a3a3a3;
            --text-main: #ffffff;
            --text-muted: #a3a3a3;
            --accent: #525252;
            --gold: #d4d4d8;
            --orb-1: #262626;
            --orb-2: #171717;
        }
`;
html = html.replace(/(\[data-mode="dark"\]\[data-theme="cyber"\],[\s\S]*?--orb-2: #020617;\n        })/, '$1\n' + darkNoirCSS);

// 2. Insert Light Mode CSS
const lightNoirCSS = `
        [data-mode="light"][data-theme="noir"] {
            --bg-color-1: #ffffff;
            --bg-color-2: #f4f4f5;
            --primary: #000000;
            --primary-glow: rgba(0, 0, 0, 0.25);
            --primary-hover: #27272a;
            --secondary: #525252;
            --accent: #71717a;
            --text-main: #000000;
            --text-muted: #525252;
            --gold: #3f3f46;
            --orb-1: #e4e4e7;
            --orb-2: #d4d4d8;
        }
`;
html = html.replace(/(\[data-mode="light"\]\[data-theme="cyber"\] \{[\s\S]*?--orb-2: #f5d0fe;\n        })/, '$1\n' + lightNoirCSS);

// 3. Insert Theme Pills
const noirPill = `            <div class="theme-pill" onclick="setTheme('noir', event)">
                <span class="theme-dot" style="background:#000000; border: 1px solid var(--glass-border);"></span> Noir
            </div>
`;
// Replace closing div of the cyber pill to inject noir pill after it
html = html.replace(/(<div class="theme-pill" onclick="setTheme\('cyber', event\)">\s*<span class="theme-dot" style="background:#22d3ee;"><\/span> Cyber\s*<\/div>)/g, '$1\n' + noirPill);

fs.writeFileSync('index.html', html);
console.log('Noir theme added');
