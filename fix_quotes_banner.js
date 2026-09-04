const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldBanner = `.dedication-banner {
            text-align: center;
            margin: -6px auto 24px auto;
            padding: 12px 18px;
            border-radius: 14px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08));
            border: 1px solid rgba(16, 185, 129, 0.28);
            color: var(--accent);
            font-size: 0.92rem;
            font-weight: 500;
            line-height: 1.5;
            max-width: 650px;
            cursor: pointer;
            user-select: none;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .dedication-banner:hover {
            border-color: rgba(16, 185, 129, 0.5);
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.12));
        }`;

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
            max-width: 650px;
            cursor: pointer;
            user-select: none;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .dedication-banner:hover {
            border-color: var(--primary);
            background: var(--primary-glow);
        }`;

html = html.replace(oldBanner, newBanner);

const oldLightBanner = `[data-mode="light"] .dedication-banner {
            background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.15));
            border-color: rgba(5, 150, 105, 0.35);
            color: #065f46;
        }`;

const newLightBanner = `[data-mode="light"] .dedication-banner {
            background: var(--glass-bg);
            border-color: var(--glass-border);
            color: var(--primary-hover);
        }`;

html = html.replace(oldLightBanner, newLightBanner);

fs.writeFileSync('index.html', html);
console.log('Banner CSS fixed');
