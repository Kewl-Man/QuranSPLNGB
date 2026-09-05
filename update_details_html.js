const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /if \(\(percent === 100 && isCompleted\) \|\| wrongAnswers\.length === 0\) \{\n\s*detailsHTML = `<div style="padding: 12px 16px; color: var\(--success\); font-weight: 600; text-align: center;">🎉 Perfect Score! No mistakes\.<\/div>`;/g;

const replacement = `if (wrongAnswers.length === 0) {
                        if (isCompleted) {
                            detailsHTML = \`<div style="padding: 12px 16px; color: var(--success); font-weight: 600; text-align: center;">🎉 Perfect Score! No mistakes.</div>\`;
                        } else {
                            detailsHTML = \`<div style="padding: 12px 16px; color: var(--gold); font-weight: 600; text-align: center;">Incomplete. No mistakes made so far.</div>\`;
                        }
                    `;

html = html.replace(regex, replacement);
fs.writeFileSync('index.html', html);
console.log('Fixed detailsHTML logic');
