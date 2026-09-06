const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function quitQuiz\(\) \{[\s\S]*?showMenu\(\);\n\s*\}/g;
html = html.replace(regex, `function quitQuiz() {
            if (currentUser && (currentIndex > 0 || isAnswered)) {
                saveTestHistory(score, quizWords.length, quizSettings, quizWords, false);
            }
            saveCurrentQuizState();
            showMenu();
        }`);

fs.writeFileSync('index.html', html);
console.log('Fixed quitQuiz');
