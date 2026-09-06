const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// fix updateMenuButtons
html = html.replace(/const savedSessionStr = localStorage\.getItem\('savedQuizSession'\);/g, `let savedSessionStr = null;
            try { savedSessionStr = localStorage.getItem('savedQuizSession'); } catch(e) {}`);

// fix saveCurrentQuizState
html = html.replace(/localStorage\.setItem\('savedQuizSession', JSON\.stringify\(\{([\s\S]*?)\}\)\);/g, `try { localStorage.setItem('savedQuizSession', JSON.stringify({$1})); } catch(e) {}`);

// fix endQuiz
html = html.replace(/localStorage\.removeItem\('savedQuizSession'\);/g, `try { localStorage.removeItem('savedQuizSession'); } catch(e) {}`);

// fix startQuiz
html = html.replace(/const savedSessionStr = localStorage\.getItem\('savedQuizSession'\);/g, `let savedSessionStr = null;
                try { savedSessionStr = localStorage.getItem('savedQuizSession'); } catch(e) {}`);

fs.writeFileSync('index.html', html);
console.log('Fixed localStorage try/catch');
