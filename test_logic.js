const assert = require('assert');

let percent = 64;
let wrongAnswers = [];
let detailsHTML = '';
if (percent === 100 || wrongAnswers.length === 0) {
    detailsHTML = `<div style="padding: 12px 16px; color: var(--success); font-weight: 600; text-align: center;">🎉 Perfect Score! No mistakes.</div>`;
} else {
    detailsHTML = "Mistakes";
}
console.log(detailsHTML);
