const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Insert the modal UI right before the End Screen or Download App modal
const modalHTML = `
    <!-- MODAL: TEST HISTORY -->
    <div class="modal-overlay" id="modal-test-history" onclick="if(event.target === this) closeModal('modal-test-history')">
        <div class="glass-panel modal-card wide" onclick="event.stopPropagation()">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 class="section-title" style="margin-bottom: 0;">📈 Your Test History</h2>
                <button class="btn-mini" style="padding: 4px 10px; font-size: 1rem;" onclick="closeModal('modal-test-history')">✕</button>
            </div>
            
            <div id="test-history-list" style="display: flex; flex-direction: column; gap: 12px; max-height: 60vh; overflow-y: auto; padding-right: 4px;">
                <div style="text-align: center; color: var(--text-muted); padding: 20px;">Loading your history...</div>
            </div>
        </div>
    </div>
`;
html = html.replace('<!-- MODAL: DOWNLOAD MOBILE APP (ANDROID APK & APPLE IOS) -->', modalHTML + '\n    <!-- MODAL: DOWNLOAD MOBILE APP (ANDROID APK & APPLE IOS) -->');


// 2. Insert JS logic for history
const historyJS = `
        async function openTestHistoryModal() {
            if (!currentUser) return;
            openModal('modal-test-history');
            loadTestHistory();
        }

        async function loadTestHistory() {
            const listEl = getEl('test-history-list');
            if (!listEl) return;
            listEl.innerHTML = \`<div style="text-align: center; color: var(--text-muted); padding: 20px;">Loading your history...</div>\`;
            
            try {
                const { data, error } = await supabaseClient
                    .from('test_history')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50);
                    
                if (error) throw error;
                
                if (!data || data.length === 0) {
                    listEl.innerHTML = \`<div style="text-align: center; color: var(--text-muted); padding: 20px;">No test history found yet. Take a quiz!</div>\`;
                    return;
                }
                
                let html = '';
                data.forEach(test => {
                    const date = new Date(test.created_at).toLocaleString();
                    const percent = Math.round((test.score / test.total_questions) * 100);
                    let color = 'var(--danger)';
                    if (percent >= 80) color = 'var(--success)';
                    else if (percent >= 50) color = 'var(--gold)';
                    
                    const settingsInfo = \`Mode: \${test.quiz_settings.orderMode} | Words: \${test.quiz_settings.wordDisplay} | Total Excluded: \${test.quiz_settings.whitelistedWords ? test.quiz_settings.whitelistedWords.length : 0}\`;
                    
                    html += \`
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); padding: 12px 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="font-weight: 600; font-size: 0.95rem;">Score: <span style="color: \${color}; font-size: 1.1rem;">\${test.score} / \${test.total_questions}</span> (\${percent}%)</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">\${date}</div>
                            </div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">\${settingsInfo}</div>
                        </div>
                    \`;
                });
                listEl.innerHTML = html;
            } catch (err) {
                console.error("Error loading test history:", err);
                listEl.innerHTML = \`<div style="text-align: center; color: var(--danger); padding: 20px;">Failed to load history.</div>\`;
            }
        }

        async function saveTestHistory(score, total, settings, words) {
            if (!currentUser || !supabaseClient) return;
            
            try {
                await supabaseClient.from('test_history').insert([{
                    user_id: currentUser.id,
                    score: score,
                    total_questions: total,
                    quiz_settings: settings
                }]);
            } catch (err) {
                console.error("Error saving test history:", err);
            }
        }
`;

// Insert it somewhere globally accessible in the script block, maybe right before the endQuiz function
html = html.replace(/function endQuiz\(\) \{/, historyJS + '\n        function endQuiz() {');

// 3. Update endQuiz to call saveTestHistory
const endQuizUpdate = `
            if (currentUser) {
                saveTestHistory(score, quizWords.length, quizSettings, quizWords);
            }
`;
html = html.replace(/finalScoreText\.innerText = `You scored \${score} out of \${quizWords\.length}!`;/, `finalScoreText.innerText = \`You scored \${score} out of \${quizWords.length}!\`;\n${endQuizUpdate}`);

fs.writeFileSync('index.html', html);
console.log('Test history feature injected');
