const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Shift Click logic for toggleWordWhitelist
const toggleWordOld = /function toggleWordWhitelist\(wordIndex\) \{[\s\S]*?renderWhitelistList\(\);\n\s*updateFlashcardButtonState\(wordIndex\);\n\s*playSound\('click'\);\n\s*\}/;

const toggleWordNew = `let lastClickedWhitelistIndex = null;

        function toggleWordWhitelist(wordIndex, isShiftKey = false) {
            if (!Array.isArray(quizSettings.whitelistedWords)) {
                quizSettings.whitelistedWords = [];
            }
            
            const searchVal = (getEl('whitelist-search')?.value || '').toLowerCase().trim();
            const matchingIndices = [];
            wordsData.forEach((word, index) => {
                if (searchVal) {
                    const matchArabic = word.a.includes(searchVal);
                    const matchTranslit = word.t.toLowerCase().includes(searchVal);
                    const matchMeaning = word.m.toLowerCase().includes(searchVal);
                    const matchCategory = word.p.toLowerCase().includes(searchVal);
                    if (!matchArabic && !matchTranslit && !matchMeaning && !matchCategory) return;
                }
                matchingIndices.push(index);
            });

            if (isShiftKey && lastClickedWhitelistIndex !== null) {
                const startPos = matchingIndices.indexOf(lastClickedWhitelistIndex);
                const endPos = matchingIndices.indexOf(wordIndex);
                
                if (startPos !== -1 && endPos !== -1) {
                    const min = Math.min(startPos, endPos);
                    const max = Math.max(startPos, endPos);
                    
                    const targetStateAdd = !quizSettings.whitelistedWords.includes(wordIndex);

                    for (let i = min; i <= max; i++) {
                        const idx = matchingIndices[i];
                        const pos = quizSettings.whitelistedWords.indexOf(idx);
                        if (targetStateAdd && pos === -1) {
                            quizSettings.whitelistedWords.push(idx);
                        } else if (!targetStateAdd && pos > -1) {
                            quizSettings.whitelistedWords.splice(pos, 1);
                        }
                    }
                }
            } else {
                const pos = quizSettings.whitelistedWords.indexOf(wordIndex);
                if (pos > -1) {
                    quizSettings.whitelistedWords.splice(pos, 1);
                } else {
                    quizSettings.whitelistedWords.push(wordIndex);
                }
            }
            
            lastClickedWhitelistIndex = wordIndex;
            saveSettings();
            renderWhitelistList();
            updateFlashcardButtonState(wordIndex);
            playSound('click');
        }`;

html = html.replace(toggleWordOld, toggleWordNew);

// 2. toggleSelectAllWhitelist updates to only affect matching items
const selectAllOld = /function toggleSelectAllWhitelist\(shouldSelectAll\) \{[\s\S]*?playSound\('click'\);\n\s*\}/;
const selectAllNew = `function toggleSelectAllWhitelist(shouldSelectAll) {
            const searchVal = (getEl('whitelist-search')?.value || '').toLowerCase().trim();
            const matchingIndices = [];
            wordsData.forEach((word, index) => {
                if (searchVal) {
                    const matchArabic = word.a.includes(searchVal);
                    const matchTranslit = word.t.toLowerCase().includes(searchVal);
                    const matchMeaning = word.m.toLowerCase().includes(searchVal);
                    const matchCategory = word.p.toLowerCase().includes(searchVal);
                    if (!matchArabic && !matchTranslit && !matchMeaning && !matchCategory) return;
                }
                matchingIndices.push(index);
            });

            if (shouldSelectAll) {
                matchingIndices.forEach(idx => {
                    if (!quizSettings.whitelistedWords.includes(idx)) {
                        quizSettings.whitelistedWords.push(idx);
                    }
                });
            } else {
                quizSettings.whitelistedWords = quizSettings.whitelistedWords.filter(idx => !matchingIndices.includes(idx));
            }
            saveSettings();
            renderWhitelistList();
            wordsData.forEach((_, i) => updateFlashcardButtonState(i));
            playSound('click');
        }`;
html = html.replace(selectAllOld, selectAllNew);

// 3. update renderWhitelistList to pass event.shiftKey
const renderWhitelistItemOld = /item\.onclick = \(\) => \{\n\s*toggleWordWhitelist\(index\);\n\s*\};\n\s*item\.innerHTML = `\n\s*<input type="checkbox" class="whitelist-checkbox" \$\{isWhitelisted \? 'checked' : ''\} onclick="event\.stopPropagation\(\); toggleWordWhitelist\(\$\{index\}\);">/;
const renderWhitelistItemNew = `item.onclick = (e) => {
                    toggleWordWhitelist(index, e.shiftKey);
                };
                item.innerHTML = \`
                    <input type="checkbox" class="whitelist-checkbox" \$\{isWhitelisted ? 'checked' : ''\} onclick="event.stopPropagation(); toggleWordWhitelist(\$\{index\}, event.shiftKey);">`;
html = html.replace(renderWhitelistItemOld, renderWhitelistItemNew);

// 4. Update Study Mode header to include search and Reveal All/Hide All
const studyHeaderOld = /<div class="glass-panel wide" id="screen-study">\n\s*<h1>Study Guide<\/h1>\n\s*<p class="subtitle">Tap any card to reveal its translation and details\.<\/p>\n\s*<button class="btn btn-outline" style="width: auto; padding: 10px 22px;" onclick="showMenu\(\)">← Back to Menu<\/button>/;
const studyHeaderNew = `<div class="glass-panel wide" id="screen-study">
        <h1>Study Guide</h1>
        <p class="subtitle">Tap any card to reveal its translation and details.</p>
        <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
            <button class="btn btn-outline" style="width: auto; padding: 10px 22px; flex: 0 0 auto;" onclick="showMenu()">← Back to Menu</button>
            <input type="text" id="study-search" placeholder="Search Arabic or English..." oninput="filterStudyCards()" style="flex: 1; min-width: 200px; padding: 10px 15px; font-size: 0.95rem;">
            <button class="btn-mini" onclick="toggleAllFlashcards(true)" style="padding: 10px 14px; background: var(--primary-glow); border-color: var(--glass-border);">Reveal All</button>
            <button class="btn-mini" onclick="toggleAllFlashcards(false)" style="padding: 10px 14px; background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4);">Hide All</button>
        </div>`;
html = html.replace(studyHeaderOld, studyHeaderNew);

// 5. Add filterStudyCards and toggleAllFlashcards below renderFlashcards
const renderFlashcardsRegex = /(function renderFlashcards\(\) \{[\s\S]*?grid\.appendChild\(card\);\n\s*\}\);\n\s*\})/;
const renderFlashcardsReplacement = `$1

        function filterStudyCards() {
            const searchVal = (getEl('study-search')?.value || '').toLowerCase().trim();
            const cards = document.querySelectorAll('.flashcard');
            cards.forEach((card) => {
                const btn = card.querySelector('.flashcard-whitelist-btn');
                if(!btn) return;
                const index = btn.getAttribute('data-word-index');
                const word = wordsData[index];
                if (searchVal) {
                    const matchArabic = word.a.includes(searchVal);
                    const matchTranslit = word.t.toLowerCase().includes(searchVal);
                    const matchMeaning = word.m.toLowerCase().includes(searchVal);
                    const matchCategory = word.p.toLowerCase().includes(searchVal);
                    if (!matchArabic && !matchTranslit && !matchMeaning && !matchCategory) {
                        card.style.display = 'none';
                        return;
                    }
                }
                card.style.display = 'block';
            });
        }

        function toggleAllFlashcards(reveal) {
            const cards = document.querySelectorAll('.flashcard');
            cards.forEach(card => {
                if (card.style.display !== 'none') {
                    if (reveal) {
                        card.classList.add('flipped');
                    } else {
                        card.classList.remove('flipped');
                    }
                }
            });
            playSound('click');
        }`;
html = html.replace(renderFlashcardsRegex, renderFlashcardsReplacement);

// 6. Update openStudyMode to reset search
const openStudyModeOld = /function openStudyMode\(\) \{\n\s*switchScreen\('screen-study'\);\n\s*renderFlashcards\(\);\n\s*\}/;
const openStudyModeNew = `function openStudyMode() {
            switchScreen('screen-study');
            const searchInput = getEl('study-search');
            if(searchInput) searchInput.value = '';
            renderFlashcards();
        }`;
html = html.replace(openStudyModeOld, openStudyModeNew);

fs.writeFileSync('index.html', html);
console.log('Done 3');
