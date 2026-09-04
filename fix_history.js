const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace the buggy condition in loadTestHistory
const oldLogic = `if (percent === 100 || wrongAnswers.length === 0) {
                        detailsHTML = \\\`<div style="padding: 12px 16px; color: var(--success); font-weight: 600; text-align: center;">🎉 Perfect Score! No mistakes.</div>\\\`;
                    } else {
                        detailsHTML = '<div style="padding: 12px 16px; font-size: 0.85rem; color: var(--text-main);"><h4 style="margin: 0 0 10px 0; font-size: 0.95rem; color: var(--danger);">Mistakes:</h4><div style="display: flex; flex-direction: column; gap: 8px;">';`;

const newLogic = `if (percent === 100) {
                        detailsHTML = \`<div style="padding: 12px 16px; color: var(--success); font-weight: 600; text-align: center;">🎉 Perfect Score! No mistakes.</div>\`;
                    } else if (wrongAnswers.length === 0) {
                        detailsHTML = \`<div style="padding: 12px 16px; color: var(--text-muted); font-size: 0.85rem; text-align: center;">No mistake details recorded for this test.</div>\`;
                    } else {
                        detailsHTML = '<div style="padding: 12px 16px; font-size: 0.85rem; color: var(--text-main);"><h4 style="margin: 0 0 10px 0; font-size: 0.95rem; color: var(--danger);">Mistakes:</h4><div style="display: flex; flex-direction: column; gap: 8px;">';`;

html = html.replace(oldLogic, newLogic);
fs.writeFileSync('index.html', html);
console.log('Fixed history details condition');
