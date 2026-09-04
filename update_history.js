const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Update saveTestHistory
html = html.replace(/quiz_settings: settings/, 'quiz_settings: { ...settings, wrongAnswers: wrongAnswersLog }');

// Update loadTestHistory
const oldLoadFuncRegex = /async function loadTestHistory\(\) \{[\s\S]*?async function saveTestHistory/;
const newLoadFunc = `
        function toggleTestHistoryDetails(el) {
            el.classList.toggle('expanded');
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
                    
                    const s = test.quiz_settings || {};
                    const settingsInfo = \`Mode: \${s.orderMode || 'Unknown'} | Words: \${s.wordDisplay || 'Unknown'} | Total Excluded: \${s.whitelistedWords ? s.whitelistedWords.length : 0}\`;
                    
                    const wrongAnswers = s.wrongAnswers || [];
                    let detailsHTML = '';
                    if (percent === 100 || wrongAnswers.length === 0) {
                        detailsHTML = \`<div style="padding: 12px 16px; color: var(--success); font-weight: 600; text-align: center;">🎉 Perfect Score! No mistakes.</div>\`;
                    } else {
                        detailsHTML = '<div style="padding: 12px 16px; font-size: 0.85rem; color: var(--text-main);"><h4 style="margin: 0 0 10px 0; font-size: 0.95rem; color: var(--danger);">Mistakes:</h4><div style="display: flex; flex-direction: column; gap: 8px;">';
                        wrongAnswers.forEach(wa => {
                            const w = wa.word;
                            const parts = (wa.wrongParts || []).map(p => \`\${p.field} (Correct: <b>\${p.correct}</b>)\`).join(', ');
                            detailsHTML += \`
                                <div style="background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 8px;">
                                    <div style="font-weight: 600; margin-bottom: 4px;">\${w.a} (\${w.t})</div>
                                    <div style="color: var(--text-muted);">Missed: \${parts || 'Unknown'}</div>
                                    <div style="margin-top: 4px; font-size: 0.8rem; color: var(--text-muted);">Meaning: \${w.m} | Type: \${w.p} \${w.r ? '| Root: ' + w.r : ''}</div>
                                </div>
                            \`;
                        });
                        detailsHTML += '</div></div>';
                    }

                    html += \`
                        <div class="history-item" onclick="toggleTestHistoryDetails(this)" style="background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; display: flex; flex-direction: column; cursor: pointer; transition: background 0.2s ease;">
                            <div style="padding: 12px 16px; display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="font-weight: 600; font-size: 0.95rem;">Score: <span style="color: \${color}; font-size: 1.1rem;">\${test.score} / \${test.total_questions}</span> (\${percent}%)</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">\${date}</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="font-size: 0.8rem; color: var(--text-muted);">\${settingsInfo}</div>
                                    <div class="expand-icon" style="font-size: 0.8rem; color: var(--text-muted); transition: transform 0.3s ease;">▼</div>
                                </div>
                            </div>
                            <div class="history-item-details">
                                <div class="history-item-details-inner">
                                    \${detailsHTML}
                                </div>
                            </div>
                        </div>
                    \`;
                });
                listEl.innerHTML = html;
            } catch (err) {
                console.error("Error loading test history:", err);
                listEl.innerHTML = \`<div style="text-align: center; color: var(--danger); padding: 20px;">Failed to load history.</div>\`;
            }
        }

        async function saveTestHistory`;

html = html.replace(oldLoadFuncRegex, newLoadFunc);

// Add CSS for animation
const animationCSS = `
        .history-item:hover {
            background: rgba(255,255,255,0.06) !important;
        }
        .history-item-details {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.3s ease-out;
            overflow: hidden;
            border-top: 1px solid transparent;
        }
        .history-item.expanded .history-item-details {
            grid-template-rows: 1fr;
            border-top-color: var(--glass-border);
        }
        .history-item-details-inner {
            min-height: 0;
            opacity: 0;
            transition: opacity 0.3s ease-out;
        }
        .history-item.expanded .history-item-details-inner {
            opacity: 1;
        }
        .history-item.expanded .expand-icon {
            transform: rotate(180deg);
        }
`;

html = html.replace(/<\/style>/, animationCSS + '\n    </style>');

fs.writeFileSync('index.html', html);
console.log('History Expansion applied');
