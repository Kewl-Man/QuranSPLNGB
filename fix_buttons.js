const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
    /<button class="btn-mini" onclick="toggleAllFlashcards\(true\)" style="padding: 10px 14px; background: var\(--primary-glow\); border-color: var\(--glass-border\);">Reveal All<\/button>/g,
    '<button class="btn-mini" onclick="toggleAllFlashcards(true)" style="padding: 10px 14px; background: var(--primary-glow); border-color: var(--glass-border); color: var(--btn-text, white);">Reveal All</button>'
);

html = html.replace(
    /<button class="btn-mini" onclick="toggleAllFlashcards\(false\)" style="padding: 10px 14px; background: rgba\(239, 68, 68, 0.2\); border-color: rgba\(239, 68, 68, 0.4\);">Hide All<\/button>/g,
    '<button class="btn-mini" onclick="toggleAllFlashcards(false)" style="padding: 10px 14px; background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); color: var(--text-main);">Hide All</button>'
);

// Do the same for whitelist ones since they share the same styles
html = html.replace(
    /<button class="btn-mini" onclick="toggleSelectAllWhitelist\(true\)" style="padding: 10px 14px; background: var\(--primary-glow\); border-color: var\(--glass-border\);">Check All<\/button>/g,
    '<button class="btn-mini" onclick="toggleSelectAllWhitelist(true)" style="padding: 10px 14px; background: var(--primary-glow); border-color: var(--glass-border); color: var(--btn-text, white);">Check All</button>'
);

html = html.replace(
    /<button class="btn-mini" onclick="toggleSelectAllWhitelist\(false\)" style="padding: 10px 14px; background: rgba\(239, 68, 68, 0.2\); border-color: rgba\(239, 68, 68, 0.4\);">Uncheck All<\/button>/g,
    '<button class="btn-mini" onclick="toggleSelectAllWhitelist(false)" style="padding: 10px 14px; background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); color: var(--text-main);">Uncheck All</button>'
);

fs.writeFileSync('index.html', html);
