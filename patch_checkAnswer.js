const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add wrongAnswersLog
html = html.replace(/let score = 0;/, 'let score = 0;\n        let wrongAnswersLog = [];');
html = html.replace(/score = 0;\n\s*loadWord\(\);/, 'score = 0;\n            wrongAnswersLog = [];\n            loadWord();');

// 2. Modify checkAnswer
let checkAnswerRegex = /function checkAnswer\(\) \{[\s\S]*?getEl\('btn-action'\).onclick = nextWord;\n        \}/;
let checkAnswerMatch = html.match(checkAnswerRegex);
if (checkAnswerMatch) {
    let newCheckAnswer = checkAnswerMatch[0]
        .replace(/let allCorrect = true;/, "let allCorrect = true;\n            let wrongParts = [];")
        .replace(/else \{ getEl\('input-meaning'\).classList.add\('wrong'\); allCorrect = false; \}/, "else { getEl('input-meaning').classList.add('wrong'); allCorrect = false; wrongParts.push({ field: 'Meaning', correct: word.m }); }")
        .replace(/else \{ getEl\('input-pos'\).classList.add\('wrong'\); allCorrect = false; \}/, "else { getEl('input-pos').classList.add('wrong'); allCorrect = false; wrongParts.push({ field: 'Category', correct: word.p }); }")
        .replace(/else \{ getEl\('input-occ'\).classList.add\('wrong'\); allCorrect = false; \}/, "else { getEl('input-occ').classList.add('wrong'); allCorrect = false; wrongParts.push({ field: 'Occurrences', correct: word.o }); }")
        .replace(/else \{ getEl\('input-root'\).classList.add\('wrong'\); allCorrect = false; \}/, "else { getEl('input-root').classList.add('wrong'); allCorrect = false; wrongParts.push({ field: 'Root', correct: correctRoot }); }")
        .replace(/else \{ getEl\('input-arabic'\).classList.add\('wrong'\); allCorrect = false; \}/, "else { getEl('input-arabic').classList.add('wrong'); allCorrect = false; wrongParts.push({ field: 'Arabic', correct: word.a }); }");

    // Add wrongAnswersLog.push and fix the message string
    newCheckAnswer = newCheckAnswer.replace(/if \(allCorrect\) \{/, "if (!allCorrect && !missingInputs) wrongAnswersLog.push({ word, wrongParts });\n            \n            if (allCorrect) {");
    
    // Fix the message string
    newCheckAnswer = newCheckAnswer.replace(/msgEl\.innerHTML = \`Incorrect\. Word: <b>\\$\{word\.a\}<\/b> \(\\$\{word\.t\}\), Meaning: <b>\\$\{word\.m\}<\/b>\\$\{rootStr\} \(Occurs <b>\\$\{word\.o\}<\/b> times\)\.\`;/, "msgEl.innerHTML = \`Incorrect. Word: <b>\${word.a}</b> (\${word.t}), Meaning: <b>\${word.m}</b>, Type: <b>\${word.p}</b>\${rootStr} (Occurs <b>\${word.o}</b> times).\`;");

    html = html.replace(checkAnswerMatch[0], newCheckAnswer);
} else {
    console.log("Could not find checkAnswer function");
}

fs.writeFileSync('index.html', html);
console.log('Patched checkAnswer');
