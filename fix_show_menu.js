const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const showMenuRegex = /function showMenu\(\) \{ switchScreen\('screen-menu'\); \}/g;
html = html.replace(showMenuRegex, `function updateMenuButtons() {
            const savedSessionStr = localStorage.getItem('savedQuizSession');
            const playBtn = getEl('btn-play-quiz');
            const freshBtn = getEl('btn-start-fresh-quiz');
            if (playBtn && freshBtn) {
                if (savedSessionStr) {
                    playBtn.innerText = '🎮 Resume Incomplete Quiz';
                    freshBtn.style.display = 'block';
                } else {
                    playBtn.innerText = '🎮 Play Interactive Quiz';
                    freshBtn.style.display = 'none';
                }
            }
        }

        function showMenu() { 
            updateMenuButtons();
            switchScreen('screen-menu'); 
        }`);

fs.writeFileSync('index.html', html);
console.log('Fixed showMenu');
