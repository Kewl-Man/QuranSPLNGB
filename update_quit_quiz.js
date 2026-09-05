const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<button class="btn btn-outline" style="width: auto; padding: 8px 14px; margin:0;" onclick="showMenu()">Quit</button>', 
    '<button class="btn btn-outline" style="width: auto; padding: 8px 14px; margin:0;" onclick="quitQuiz()">Quit</button>');

const quitFn = `
        function quitQuiz() {
            if (currentUser && currentQuizIndex > 0) {
                // Save progress if they've answered at least one question
                saveTestHistory(score, quizWords.length, quizSettings, quizWords, false);
            }
            showMenu();
        }
`;

html = html.replace('function showMenu() { switchScreen(\'screen-menu\'); }', 'function showMenu() { switchScreen(\'screen-menu\'); }\n' + quitFn);

fs.writeFileSync('index.html', html);
console.log('Done 2');
