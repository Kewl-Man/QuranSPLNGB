const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const loadHistoryRegex = /const percent = Math\.round\(\(test\.score \/ test\.total_questions\) \* 100\);\n\s*let color = 'var\(--danger\)';/g;

html = html.replace(loadHistoryRegex, `const percent = Math.round((test.score / test.total_questions) * 100);
                    const s = test.quiz_settings || {};
                    const isCompleted = s.completed === undefined ? true : s.completed;
                    const completedBadge = isCompleted ? '' : '<span style="background: rgba(245,158,11,0.2); color: var(--gold); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 6px; border: 1px solid var(--gold);">Incomplete</span>';
                    let color = 'var(--danger)';`);

const htmlScoreRegex = /<div style="font-weight: 600; font-size: 0\.95rem;">Score: <span style="color: \$\{color\}; font-size: 1\.1rem;">\$\{test\.score\} \/ \$\{test\.total_questions\}<\/span> \(\$\{percent\}%\)<\/div>/g;
html = html.replace(htmlScoreRegex, `<div style="font-weight: 600; font-size: 0.95rem;">Score: <span style="color: \$\{color\}; font-size: 1.1rem;">\$\{test.score\} / \$\{test.total_questions\}</span> (\$\{percent\}%)\$\{completedBadge\}</div>`);

const perfectScoreRegex = /if \(percent === 100 \|\| wrongAnswers\.length === 0\) \{/g;
html = html.replace(perfectScoreRegex, `if ((percent === 100 && isCompleted) || wrongAnswers.length === 0) {`);

const saveTestRegex = /async function saveTestHistory\(score, total, settings, words\) \{/g;
html = html.replace(saveTestRegex, `async function saveTestHistory(score, total, settings, words, isCompleted = true) {`);

const insertRegex = /quiz_settings: \{ \.\.\.settings, wrongAnswers: wrongAnswersLog \}/g;
html = html.replace(insertRegex, `quiz_settings: { ...settings, wrongAnswers: wrongAnswersLog, completed: isCompleted }`);

fs.writeFileSync('index.html', html);
console.log('Done 1');
