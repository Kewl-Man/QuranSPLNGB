const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

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
            --orb-3: #0a0a0a;
            --card-bg: rgba(10, 10, 10, 0.7);
        }
`;

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
            --orb-3: #a1a1aa;
            --glass-border: rgba(0, 0, 0, 0.2);
        }
`;

// Insert after Dark cyber block
const darkCyberStr = '--card-bg: rgba(24, 4, 44, 0.55);\n        }';
html = html.replace(darkCyberStr, darkCyberStr + '\n' + darkNoirCSS);

// Insert after Light cyber block
const lightCyberStr = '--glass-border: rgba(8, 145, 178, 0.25);\n        }';
html = html.replace(lightCyberStr, lightCyberStr + '\n' + lightNoirCSS);

fs.writeFileSync('index.html', html);
console.log('Noir CSS injected correctly.');
