const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add saveCurrentQuizState to loadWord
const loadWordRegex = /function loadWord\(\) \{/g;
html = html.replace(loadWordRegex, `function saveCurrentQuizState() {
            if (currentIndex >= 0 && currentIndex < quizWords.length) {
                localStorage.setItem('savedQuizSession', JSON.stringify({
                    quizWords,
                    currentIndex,
                    score,
                    wrongAnswersLog,
                    quizSettings
                }));
            }
        }

        function loadWord() {
            saveCurrentQuizState();`);

// 2. Clear savedQuizSession in endQuiz
const endQuizRegex = /function endQuiz\(\) \{/g;
html = html.replace(endQuizRegex, `function endQuiz() {
            localStorage.removeItem('savedQuizSession');`);

// 3. Update quitQuiz logic to save state to localStorage
const quitQuizRegex = /function quitQuiz\(\) \{[\s\S]*?showMenu\(\);\n\s*\}/g;
html = html.replace(quitQuizRegex, `function quitQuiz() {
            if (currentIndex > 0) {
                if (currentUser) {
                    saveTestHistory(score, quizWords.length, quizSettings, quizWords, false);
                }
                saveCurrentQuizState();
            }
            showMenu();
        }`);

// 4. Update startQuiz to handle resuming or starting fresh
const startQuizRegex = /function startQuiz\(\) \{([\s\S]*?)let candidateWords = \[\];/g;
const newStartQuiz = `function startQuiz(forceNew = false) {
            if (!currentUser && !checkAdminAccess()) {
                openAuthModal('login', "✨ Sign in today to continue using! (It's FREE!)", 'Sign in or create a free account to unlock interactive quizzes, flashcards, word tracking, and customized settings.');
                return;
            }
            saveSettings();

            if (!forceNew) {
                const savedSessionStr = localStorage.getItem('savedQuizSession');
                if (savedSessionStr) {
                    try {
                        const savedSession = JSON.parse(savedSessionStr);
                        if (savedSession && savedSession.quizWords && savedSession.currentIndex >= 0) {
                            quizWords = savedSession.quizWords;
                            currentIndex = savedSession.currentIndex;
                            score = savedSession.score;
                            wrongAnswersLog = savedSession.wrongAnswersLog || [];
                            
                            switchScreen('screen-quiz');
                            
                            // Adjust Visible Input Fields
                            getEl('group-meaning').style.display = quizSettings.fields.meaning ? 'flex' : 'none';
                            getEl('group-pos').style.display = quizSettings.fields.pos ? 'flex' : 'none';
                            getEl('group-occ').style.display = quizSettings.fields.occ ? 'flex' : 'none';
                            const groupRoot = getEl('group-root');
                            if (groupRoot) groupRoot.style.display = quizSettings.fields.root ? 'flex' : 'none';
                            getEl('group-arabic').style.display = quizSettings.fields.arabic ? 'flex' : 'none';
                            
                            loadWord();
                            return;
                        }
                    } catch (e) {
                        console.error("Failed to parse saved session", e);
                    }
                }
            }

            let candidateWords = [];`;
html = html.replace(startQuizRegex, newStartQuiz);

// 5. Add a "Start Fresh" button in the Main Menu if a saved session exists.
// We'll add it right after "btn-play-quiz".
const menuButtonsRegex = /<button class="btn" id="btn-play-quiz" onclick="startQuiz\(\)">🎮 Play Interactive Quiz<\/button>/g;
html = html.replace(menuButtonsRegex, `<button class="btn" id="btn-play-quiz" onclick="startQuiz()">🎮 Play Interactive Quiz</button>
            <button class="btn btn-outline" id="btn-start-fresh-quiz" onclick="startQuiz(true)" style="display: none;">🔄 Start Fresh New Quiz</button>`);

// 6. Function to update Menu Buttons
const showMenuRegex = /function showMenu\(\) \{ switchScreen\('screen-menu'\); \n\s*function quitQuiz/g;
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
        } 
        function quitQuiz`);

// Add updateMenuButtons to init
const initRegex = /initApp\(\) \{\n/g;
html = html.replace(initRegex, `initApp() {\n            updateMenuButtons();\n`);

fs.writeFileSync('index.html', html);
console.log('Update Complete');
