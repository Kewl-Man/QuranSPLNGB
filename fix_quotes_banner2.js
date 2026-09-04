const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /\.dedication-banner \{[\s\S]*?\}\s*\.dedication-banner:hover \{[\s\S]*?\}/;

const newBanner = `.dedication-banner {
            text-align: center;
            margin: -6px auto 24px auto;
            padding: 12px 18px;
            border-radius: 14px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            color: var(--primary);
            font-size: 0.92rem;
            font-weight: 500;
            line-height: 1.5;
            max-width: 540px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
            letter-spacing: 0.2px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .dedication-banner:hover {
            border-color: var(--primary);
            background: var(--primary-glow);
        }`;

html = html.replace(regex, newBanner);

const lightRegex = /\[data-mode="light"\] \.dedication-banner \{[\s\S]*?\}/;
const newLightBanner = `[data-mode="light"] .dedication-banner {
            background: var(--glass-bg);
            border-color: var(--glass-border);
            color: var(--primary-hover);
        }`;

html = html.replace(lightRegex, newLightBanner);

fs.writeFileSync('index.html', html);
console.log('Banner CSS fixed properly');
